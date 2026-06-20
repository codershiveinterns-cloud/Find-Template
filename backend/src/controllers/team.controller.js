import { Project } from '../models/Project.js';
import { User } from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { hashPassword } from '../utils/password.js';

const memberRoleFilter = { role: { $in: ['developer', 'designer'] } };

const serializeTeamMember = (member, includePassword = false) => {
  const assignedProjects = member.assignedProjects || [];
  const data = {
    _id: member._id,
    name: member.name,
    email: member.email,
    role: member.role,
    accountType: member.accountType,
    companyName: member.companyName,
    companyEmail: member.companyEmail,
    ownerId: member.ownerId,
    assignedProjects,
    assignedProjectsCount: assignedProjects.length,
    assignedProjectModule: member.assignedProjectModule,
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

export const listTeamMembers = asyncHandler(async (req, res) => {
  const members = await User.find({ ownerId: req.user._id, ...memberRoleFilter })
    .populate('assignedProjects', 'name status clientName templateKey templateName templateType')
    .sort({ createdAt: -1 });

  return res.json({
    success: true,
    message: 'Team members fetched successfully',
    data: members.map((member) => serializeTeamMember(member)),
  });
});

export const createTeamMember = asyncHandler(async (req, res) => {
  const { name, email, role, password, assignedProjects = [], assignedProjectModule = false } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ success: false, message: 'Email already exists' });
  }

  const validProjectIds = await validateProjectOwnership(assignedProjects, req.user._id);
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
    companyEmail: req.user.companyEmail || req.user.email,
    assignedProjects: validProjectIds,
    assignedProjectModule,
    selectedPackage: null,
  });

  await member.populate('assignedProjects', 'name status clientName templateKey templateName templateType');

  return res.status(201).json({
    success: true,
    message: 'Team member registered successfully',
    data: serializeTeamMember(member),
  });
});

export const getTeamMember = asyncHandler(async (req, res) => {
  const member = await User.findOne({ _id: req.params.id, ownerId: req.user._id, ...memberRoleFilter })
    .populate('assignedProjects', 'name status clientName templateKey templateName templateType');

  if (!member) {
    return res.status(404).json({ success: false, message: 'Team member not found' });
  }

  return res.json({
    success: true,
    message: 'Team member fetched successfully',
    data: serializeTeamMember(member, true),
  });
});

export const updateTeamMember = asyncHandler(async (req, res) => {
  const member = await User.findOne({ _id: req.params.id, ownerId: req.user._id, ...memberRoleFilter }).select('+passwordHash');

  if (!member) {
    return res.status(404).json({ success: false, message: 'Team member not found' });
  }

  const { name, email, role, password, assignedProjects, assignedProjectModule } = req.body;

  if (email !== undefined && email !== member.email) {
    const existingUser = await User.findOne({ email, _id: { $ne: member._id } });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email already exists' });
    }
    member.email = email;
  }

  if (assignedProjects !== undefined) {
    const validProjectIds = await validateProjectOwnership(assignedProjects, req.user._id);
    if (!validProjectIds) {
      return res.status(400).json({ success: false, message: 'One or more selected projects are invalid' });
    }
    member.assignedProjects = validProjectIds;
  }

  if (name !== undefined) member.name = name;
  if (role !== undefined) member.role = role;
  if (assignedProjectModule !== undefined) member.assignedProjectModule = assignedProjectModule;
  member.companyName = req.user.companyName || null;
  member.companyEmail = req.user.companyEmail || req.user.email;

  if (password) {
    member.plainPass = password;
    member.passwordHash = await hashPassword(password);
  }

  await member.save();
  await member.populate('assignedProjects', 'name status clientName templateKey templateName templateType');

  return res.json({
    success: true,
    message: 'Team member updated successfully',
    data: serializeTeamMember(member),
  });
});

export const deleteTeamMember = asyncHandler(async (req, res) => {
  const member = await User.findOneAndDelete({ _id: req.params.id, ownerId: req.user._id, ...memberRoleFilter });

  if (!member) {
    return res.status(404).json({ success: false, message: 'Team member not found' });
  }

  return res.json({ success: true, message: 'Team member deleted successfully', data: null });
});
