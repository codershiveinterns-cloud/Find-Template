import { User } from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { comparePassword, hashPassword } from '../utils/password.js';
import { signToken } from '../utils/jwt.js';
import { authCookieOptions } from '../utils/cookieOptions.js';

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
    loginEmail: owner.email,
    ownerEmail: owner.email,
  };
};

const findTeamUserForLogin = async ({ accountType, email, password, role, companyEmail }) => {
  const owner = await User.findOne({
    email,
    accountType,
    role: 'admin',
    isOwner: true,
  });

  if (!owner) return null;

  if (accountType === 'company_business' && owner.companyEmail !== companyEmail) {
    const error = new Error('Invalid company email');
    error.statusCode = 401;
    throw error;
  }

  const candidates = await User.find({
    ownerId: owner._id,
    accountType,
    role,
    isOwner: false,
  }).select('+passwordHash');

  const matches = [];
  for (const candidate of candidates) {
    if (await comparePassword(password, candidate.passwordHash)) {
      matches.push(candidate);
    }
  }

  if (matches.length !== 1) return null;
  return matches[0];
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
  const { accountType, email, password, role, companyEmail } = req.body;

  let user = null;

  if (role === 'admin') {
    user = await User.findOne({ email, accountType, role: 'admin', isOwner: true }).select('+passwordHash');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid login credentials' });
    }

    if (user.accountType !== accountType) {
      return res.status(401).json({ success: false, message: 'Invalid login credentials' });
    }

    if (accountType === 'company_business' && user.companyEmail !== companyEmail) {
      return res.status(401).json({ success: false, message: 'Invalid company email' });
    }

    const isPasswordValid = await comparePassword(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid login credentials' });
    }
  } else if (teamRoles.includes(role)) {
    try {
      user = await findTeamUserForLogin({ accountType, email, password, role, companyEmail });
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

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie('nexlance_token', authCookieOptions);
  return res.json({ success: true, message: 'Logged out successfully', data: null });
});

export const me = asyncHandler(async (req, res) => {
  return res.json({ success: true, message: 'Profile fetched successfully', data: await serializeAuthUser(req.user) });
});
