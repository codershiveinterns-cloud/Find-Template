import { getPlanAllowedModules } from '../constants/modules.js';
import { User } from '../models/User.js';

export const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ success: false, message: 'You do not have permission to access this resource' });
  }

  next();
};

const getWorkspaceOwner = async (user) => {
  if (user.role === 'admin' || user.isOwner) return user;
  if (!user.ownerId) return null;
  return User.findById(user.ownerId).select('selectedPackage selectedPackageBilling selectedPackagePrice selectedPackageActivatedAt selectedPackageExpiresAt email companyEmail companyName accountType');
};

export const requireModuleAccess = (moduleKey, ...extraRoles) => async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }

  const owner = await getWorkspaceOwner(req.user);
  if (!owner) {
    return res.status(403).json({ success: false, message: 'Workspace owner not found' });
  }

  const packageAllowedModules = getPlanAllowedModules(owner.selectedPackage);
  if (!packageAllowedModules.includes(moduleKey)) {
    return res.status(403).json({ success: false, message: 'This module is not available in the active package' });
  }

  req.workspaceOwner = owner;
  req.allowedModules = packageAllowedModules;

  if (req.user.role === 'admin' || extraRoles.includes(req.user.role)) {
    return next();
  }

  if (req.user.role === 'manager' && (req.user.assignedModules || []).includes(moduleKey)) {
    return next();
  }

  return res.status(403).json({ success: false, message: 'You do not have permission to access this resource' });
};
