import { User } from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { comparePassword, hashPassword } from '../utils/password.js';
import { signToken } from '../utils/jwt.js';
import { env } from '../config/env.js';

const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: env.nodeEnv === 'production',
  maxAge: 7 * 24 * 60 * 60 * 1000,
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

  console.log("users data",user);
  
  return res.status(201).json({
    success: true,
    message: 'Account created successfully. Please login.',
    data: user.toSafeProfile(),
  });
});

export const login = asyncHandler(async (req, res) => {
  const { accountType, email, password, role, companyEmail } = req.body;

  const user = await User.findOne({ email }).select('+passwordHash');
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid login credentials' });
  }

  if (user.accountType !== accountType || user.role !== role) {
    return res.status(401).json({ success: false, message: 'Invalid login credentials' });
  }

  if (accountType === 'company_business' && user.companyEmail !== companyEmail) {
    return res.status(401).json({ success: false, message: 'Invalid company email' });
  }

  const isPasswordValid = await comparePassword(password, user.passwordHash);
  if (!isPasswordValid) {
    return res.status(401).json({ success: false, message: 'Invalid login credentials' });
  }

  user.lastLoginAt = new Date();
  await user.save();

  const token = signToken({ userId: user._id, role: user.role });
  res.cookie('nexlance_token', token, cookieOptions);

  return res.json({
    success: true,
    message: 'Logged in successfully',
    data: user.toSafeProfile(),
  });
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie('nexlance_token', cookieOptions);
  return res.json({ success: true, message: 'Logged out successfully', data: null });
});

export const me = asyncHandler(async (req, res) => {
  return res.json({ success: true, message: 'Profile fetched successfully', data: req.user.toSafeProfile() });
});




