import { asyncHandler } from '../utils/asyncHandler.js';
import { comparePassword, hashPassword } from '../utils/password.js';

export const getProfile = asyncHandler(async (req, res) => {
  return res.json({ success: true, message: 'Profile fetched successfully', data: req.user.toSafeProfile() });
});

export const updateProfile = asyncHandler(async (req, res) => {
  req.user.name = req.body.name;
  await req.user.save();

  return res.json({ success: true, message: 'Profile updated successfully', data: req.user.toSafeProfile() });
});

const packagePrices = {
  monthly: { plus: 199, pro: 299, business: 399 },
  yearly: { plus: 1910.4, pro: 2870.4, business: 3830.1 },
};

export const confirmFakePayment = asyncHandler(async (req, res) => {
  const { plan, billing, email, paymentMethod } = req.body;

  req.user.selectedPackage = plan;
  req.user.selectedPackageBilling = billing;
  req.user.selectedPackagePrice = packagePrices[billing][plan];
  req.user.selectedPackageActivatedAt = new Date();
  req.user.paymentEmail = email;
  req.user.paymentMethod = paymentMethod;

  await req.user.save();

  return res.json({
    success: true,
    message: 'Payment confirmed successfully',
    data: req.user.toSafeProfile(),
  });
});

export const confirmTemplatePayment = asyncHandler(async (req, res) => {
  const { templateKey, name, type, email, paymentMethod } = req.body;
  const alreadyPurchased = req.user.purchasedTemplates?.some((template) => template.templateKey === templateKey);

  if (!alreadyPurchased) {
    req.user.purchasedTemplates.push({
      templateKey,
      name,
      type,
      paymentEmail: email,
      paymentMethod,
      purchasedAt: new Date(),
    });

    await req.user.save();
  }

  return res.json({
    success: true,
    message: 'Template payment confirmed successfully',
    data: req.user.toSafeProfile(),
  });
});

export const updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await req.user.constructor.findById(req.user._id).select('+passwordHash');

  const isPasswordValid = await comparePassword(currentPassword, user.passwordHash);
  if (!isPasswordValid) {
    return res.status(400).json({ success: false, message: 'Current password is incorrect' });
  }

  user.plainPass = newPassword;
  user.passwordHash = await hashPassword(newPassword);
  await user.save();

  return res.json({ success: true, message: 'Password updated successfully', data: null });
});
