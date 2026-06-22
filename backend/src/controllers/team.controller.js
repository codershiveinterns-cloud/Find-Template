import { getInvalidModules } from '../constants/modules.js';
import { Project } from '../models/Project.js';
import { Team } from '../models/Team.js';
import { User } from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { hashPassword } from '../utils/password.js';

const memberRoleFilter = { role: { $in: ['developer', 'designer', 'manager'] } };
const effectiveOwnerId = (req) => (req.user.role === 'admin' || req.user.isOwner ? req.user._id : req.user.ownerId);

const serializeTeamMember = (member, includePassword = false, owner = null) => {
  const assignedProjects = member.assignedProjects || [];
  const data = {
    _id: member._id,
    name: member.name,
    email: member.email,
    loginEmail: member.email,
    ownerEmail: owner?.email || member.ownerEmail,
    role: member.role,
    accountType: member.accountType,
    companyName: owner?.companyName || member.companyName,
    companyEmail: owner?.accountType === 'company_business' ? owner.companyEmail : member.companyEmail,
    ownerId: member.ownerId,
    assignedProjects,
    assignedProjectsCount: assignedProjects.length,
    assignedProjectModule: member.assignedProjectModule,
    assignedModules: member.assignedModules || [],
    createdAt: member.createdAt,
    updatedAt: member.updatedAt,
    lastLoginAt: member.lastLoginAt,
  };

  if (includePassword) {
    data.plainPass = member.plainPass;
  }

  return data;
};

const validateProjectOwnership = async (projectIds, ownerId) => {
  const ids = Array.isArray(projectIds) ? projectIds : [];

  if (ids.length === 0) {
    return [];
  }

  const projects = await Project.find({ _id: { $in: ids }, ownerId }).select('_id');

  if (projects.length !== ids.length) {
    return null;
  }

  return ids;
};

const validateManagerModules = (modules = [], packageName) => {
  const invalidModules = getInvalidModules(modules, packageName);
  if (invalidModules.length > 0) {
    return `These modules are not available in your active package: ${invalidModules.join(', ')}`;
  }
  return null;
};

const getMemberCompanyEmail = (owner) => (owner.accountType === 'company_business' ? owner.companyEmail : null);

const syncTeamRecord = async (member) => {
  const teamPayload = {
    name: member.name,
    email: member.email,
    role: member.role,
    memberId: member._id,
    members: [member._id],
    assignedProjects: member.assignedProjects || [],
    assignedProjectModule: member.assignedProjectModule,
    assignedModules: member.assignedModules || [],
    companyName: member.companyName || null,
    companyEmail: member.companyEmail || null,
    ownerId: member.ownerId,
    createdBy: member.createdBy || member.ownerId,
  };

  await Team.findOneAndUpdate(
    { memberId: member._id },
    teamPayload,
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
};

export const listTeamMembers = asyncHandler(async (req, res) => {
  const owner = req.user.role === 'admin' || req.user.isOwner ? req.user : req.workspaceOwner || await User.findById(effectiveOwnerId(req));
  const members = await User.find({ ownerId: effectiveOwnerId(req), ...memberRoleFilter })
    .populate('assignedProjects', 'name status clientName templateKey templateName templateType')
    .sort({ createdAt: -1 });

  await Promise.all(members.map((member) => syncTeamRecord(member)));

  return res.json({
    success: true,
    message: 'Team members fetched successfully',
    data: members.map((member) => serializeTeamMember(member, false, owner)),
  });
});

export const createTeamMember = asyncHandler(async (req, res) => {
  const { name, email, role, password, assignedProjects = [], assignedProjectModule = false, assignedModules = [] } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ success: false, message: 'Email already exists' });
  }

  const isManager = role === 'manager';
  const moduleError = isManager ? validateManagerModules(assignedModules, req.user.selectedPackage) : null;
  if (moduleError) {
    return res.status(400).json({ success: false, message: moduleError });
  }

  const validProjectIds = isManager ? [] : await validateProjectOwnership(assignedProjects, req.user._id);
  if (!validProjectIds) {
    return res.status(400).json({ success: false, message: 'One or more selected projects are invalid' });
  }

  const member = await User.create({
    accountType: req.user.accountType,
    name,
    email,
    plainPass: password,
    passwordHash: await hashPassword(password),
    role,
    isOwner: false,
    ownerId: req.user._id,
    createdBy: req.user._id,
    companyName: req.user.companyName || null,
    companyEmail: getMemberCompanyEmail(req.user),
    assignedProjects: validProjectIds,
    assignedProjectModule: isManager ? false : assignedProjectModule,
    assignedModules: isManager ? assignedModules : [],
    selectedPackage: null,
  });

  await syncTeamRecord(member);
  await member.populate('assignedProjects', 'name status clientName templateKey templateName templateType');

  return res.status(201).json({
    success: true,
    message: 'Team member registered successfully',
    data: serializeTeamMember(member, false, req.user),
  });
});

export const getTeamMember = asyncHandler(async (req, res) => {
  const owner = req.user.role === 'admin' || req.user.isOwner ? req.user : req.workspaceOwner || await User.findById(effectiveOwnerId(req));
  const member = await User.findOne({ _id: req.params.id, ownerId: effectiveOwnerId(req), ...memberRoleFilter })
    .populate('assignedProjects', 'name status clientName templateKey templateName templateType');

  if (!member) {
    return res.status(404).json({ success: false, message: 'Team member not found' });
  }

  return res.json({
    success: true,
    message: 'Team member fetched successfully',
    data: serializeTeamMember(member, req.user.role === 'admin', owner),
  });
});

export const updateTeamMember = asyncHandler(async (req, res) => {
  const member = await User.findOne({ _id: req.params.id, ownerId: effectiveOwnerId(req), ...memberRoleFilter }).select('+passwordHash');

  if (!member) {
    return res.status(404).json({ success: false, message: 'Team member not found' });
  }

  const { name, email, role, password, assignedProjects, assignedProjectModule, assignedModules } = req.body;

  if (email !== undefined && email !== member.email) {
    const existingUser = await User.findOne({ email, _id: { $ne: member._id } });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email already exists' });
    }
    member.email = email;
  }

  const nextRole = role || member.role;
  const isManager = nextRole === 'manager';

  if (isManager) {
    const nextAssignedModules = assignedModules !== undefined ? assignedModules : member.assignedModules || [];
    const moduleError = validateManagerModules(nextAssignedModules, req.user.selectedPackage);
    if (moduleError) {
      return res.status(400).json({ success: false, message: moduleError });
    }

    member.assignedProjects = [];
    member.assignedProjectModule = false;
    member.assignedModules = nextAssignedModules;
  } else {
    if (assignedProjects !== undefined) {
      const validProjectIds = await validateProjectOwnership(assignedProjects, req.user._id);
      if (!validProjectIds) {
        return res.status(400).json({ success: false, message: 'One or more selected projects are invalid' });
      }
      member.assignedProjects = validProjectIds;
    }
    if (assignedProjectModule !== undefined) member.assignedProjectModule = assignedProjectModule;
    member.assignedModules = [];
  }

  if (name !== undefined) member.name = name;
  if (role !== undefined) member.role = role;
  member.companyName = req.user.companyName || null;
  member.companyEmail = getMemberCompanyEmail(req.user);

  if (password) {
    member.plainPass = password;
    member.passwordHash = await hashPassword(password);
  }

  await member.save();
  await syncTeamRecord(member);
  await member.populate('assignedProjects', 'name status clientName templateKey templateName templateType');

  return res.json({
    success: true,
    message: 'Team member updated successfully',
    data: serializeTeamMember(member, false, req.user),
  });
});

export const deleteTeamMember = asyncHandler(async (req, res) => {
  const member = await User.findOneAndDelete({ _id: req.params.id, ownerId: effectiveOwnerId(req), ...memberRoleFilter });

  if (!member) {
    return res.status(404).json({ success: false, message: 'Team member not found' });
  }

  await Team.findOneAndDelete({ memberId: member._id, ownerId: member.ownerId });

  return res.json({ success: true, message: 'Team member deleted successfully', data: null });
});
