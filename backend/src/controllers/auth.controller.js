import crypto from 'crypto';
import { User } from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { comparePassword, hashPassword } from '../utils/password.js';
import { signToken } from '../utils/jwt.js';
import { authCookieOptions } from '../utils/cookieOptions.js';
import { env } from '../config/env.js';
import { sendPasswordResetOtpEmail } from '../utils/mailer.js';

const teamRoles = ['developer', 'designer', 'manager'];

const serializeAuthUser = async (user) => {
  const profile = user.toSafeProfile();

  if (user.role === 'admin' || user.isOwner) {
    return {
      ...profile,
      loginEmail: user.email,
      ownerEmail: user.email,
    };
  }

  const owner = await User.findById(user.ownerId);
  if (!owner) return profile;

  const ownerProfile = owner.toSafeProfile();
  return {
    ...profile,
    companyName: owner.companyName,
    companyEmail: owner.accountType === 'company_business' ? owner.companyEmail : null,
    selectedPackage: ownerProfile.selectedPackage,
    selectedPackageBilling: ownerProfile.selectedPackageBilling,
    selectedPackagePrice: ownerProfile.selectedPackagePrice,
    selectedPackageActivatedAt: ownerProfile.selectedPackageActivatedAt,
    selectedPackageExpiresAt: ownerProfile.selectedPackageExpiresAt,
    paymentEmail: ownerProfile.paymentEmail,
    paymentMethod: ownerProfile.paymentMethod,
    purchasedTemplates: ownerProfile.purchasedTemplates,
    loginEmail: user.email,
    ownerEmail: owner.email,
  };
};

const findTeamUserForLogin = async ({ accountType, email, password, role }) => {
  const member = await User.findOne({
    email,
    accountType,
    role,
    isOwner: false,
  }).select('+passwordHash');

  if (!member) return null;

  const isPasswordValid = await comparePassword(password, member.passwordHash);
  if (!isPasswordValid) return null;

  return member;
};

const genericOtpMessage = 'If the account exists, an OTP has been sent to the registered email.';

const generateOtp = () => String(crypto.randomInt(100000, 1000000));

const clearPasswordResetFields = (user) => {
  user.passwordResetOtpHash = null;
  user.passwordResetOtpExpiresAt = null;
  user.passwordResetOtpAttempts = 0;
  user.passwordResetRequestedAt = null;
};

const resolvePasswordResetUser = async ({ accountType, email, role }, { includeResetHash = false } = {}) => {
  const selectReset = includeResetHash ? '+passwordResetOtpHash' : '';

  if (role === 'admin') {
    return User.findOne({ email, accountType, role: 'admin', isOwner: true }).select(selectReset);
  }

  if (!teamRoles.includes(role)) return null;

  return User.findOne({
    email,
    accountType,
    role,
    isOwner: false,
  }).select(selectReset);
};

export const signup = asyncHandler(async (req, res) => {
  const { accountType, name, email, password, companyName, companyEmail } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ success: false, message: 'Email already exists' });
  }

  const user = await User.create({
    accountType,
    name,
    email,
    plainPass: password,
    passwordHash: await hashPassword(password),
    role: 'admin',
    isOwner: true,
    companyName: accountType === 'company_business' ? companyName : null,
    companyEmail: accountType === 'company_business' ? companyEmail : null,
  });

  return res.status(201).json({
    success: true,
    message: 'Account created successfully. Please login.',
    data: user.toSafeProfile(),
  });
});

export const login = asyncHandler(async (req, res) => {
  const { accountType, email, password, role } = req.body;

  let user = null;

  if (role === 'admin') {
    user = await User.findOne({ email, accountType, role: 'admin', isOwner: true }).select('+passwordHash');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid login credentials' });
    }

    if (user.accountType !== accountType) {
      return res.status(401).json({ success: false, message: 'Invalid login credentials' });
    }


    const isPasswordValid = await comparePassword(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid login credentials' });
    }
  } else if (teamRoles.includes(role)) {
    try {
      user = await findTeamUserForLogin({ accountType, email, password, role });
    } catch (error) {
      if (error.statusCode) {
        return res.status(error.statusCode).json({ success: false, message: error.message });
      }
      throw error;
    }

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid login credentials' });
    }
  } else {
    return res.status(401).json({ success: false, message: 'Invalid login credentials' });
  }

  user.lastLoginAt = new Date();
  await user.save();

  const token = signToken({ userId: user._id, role: user.role });
  res.cookie('nexlance_token', token, authCookieOptions);

  return res.json({
    success: true,
    message: 'Logged in successfully',
    data: await serializeAuthUser(user),
  });
});

export const requestPasswordResetOtp = asyncHandler(async (req, res) => {
  const user = await resolvePasswordResetUser(req.body);

  if (!user) {
    return res.json({ success: true, message: genericOtpMessage, data: null });
  }

  const otp = generateOtp();
  user.passwordResetOtpHash = await hashPassword(otp);
  user.passwordResetOtpExpiresAt = new Date(Date.now() + env.passwordResetOtpExpiresMinutes * 60 * 1000);
  user.passwordResetOtpAttempts = 0;
  user.passwordResetRequestedAt = new Date();
  await user.save();

  await sendPasswordResetOtpEmail({ to: user.email, name: user.name, otp });

  return res.json({ success: true, message: genericOtpMessage, data: null });
});

export const resetPasswordWithOtp = asyncHandler(async (req, res) => {
  const { otp, newPassword } = req.body;
  const user = await resolvePasswordResetUser(req.body, { includeResetHash: true });

  if (!user || !user.passwordResetOtpHash || !user.passwordResetOtpExpiresAt) {
    return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
  }

  if (user.passwordResetOtpExpiresAt < new Date()) {
    clearPasswordResetFields(user);
    await user.save();
    return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new OTP.' });
  }

  if (user.passwordResetOtpAttempts >= 5) {
    clearPasswordResetFields(user);
    await user.save();
    return res.status(429).json({ success: false, message: 'Too many invalid OTP attempts. Please request a new OTP.' });
  }

  const isOtpValid = await comparePassword(otp, user.passwordResetOtpHash);
  if (!isOtpValid) {
    user.passwordResetOtpAttempts += 1;
    await user.save();
    return res.status(400).json({ success: false, message: 'Invalid OTP' });
  }

  user.plainPass = newPassword;
  user.passwordHash = await hashPassword(newPassword);
  clearPasswordResetFields(user);
  await user.save();

  return res.json({ success: true, message: 'Password reset successfully. Please login with your new password.', data: null });
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie('nexlance_token', authCookieOptions);
  return res.json({ success: true, message: 'Logged out successfully', data: null });
});

export const me = asyncHandler(async (req, res) => {
  return res.json({ success: true, message: 'Profile fetched successfully', data: await serializeAuthUser(req.user) });
});
