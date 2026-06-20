import { Project } from '../models/Project.js';
import { User } from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const effectiveOwnerId = (req) => {
  if (req.user.role === 'admin' || req.user.isOwner) return req.user._id;
  return req.user.ownerId;
};

const ownerFilter = (req) => ({ ownerId: effectiveOwnerId(req) });

const projectAccessFilter = (req) => {
  const filter = ownerFilter(req);

  if (req.user.role === 'developer' || req.user.role === 'designer') {
    filter._id = { $in: req.user.assignedProjects || [] };
  }

  return filter;
};

const teamMemberFilter = (req) => ({
  ownerId: effectiveOwnerId(req),
  role: { $in: ['developer', 'designer'] },
});

const serializeProject = (project, assignedMembers = []) => ({
  ...(project.toObject ? project.toObject() : project),
  assignedMembers,
  assignedMembersCount: assignedMembers.length,
});

export const listProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find(projectAccessFilter(req)).sort({ createdAt: -1 });
  const projectIds = projects.map((project) => project._id);
  const members = await User.find({ ...teamMemberFilter(req), assignedProjects: { $in: projectIds } })
    .select('name email role assignedProjects');

  const data = projects.map((project) => {
    const assignedMembers = members
      .filter((member) => (member.assignedProjects || []).some((projectId) => String(projectId) === String(project._id)))
      .map((member) => ({ _id: member._id, name: member.name, email: member.email, role: member.role }));

    return serializeProject(project, assignedMembers);
  });

  return res.json({ success: true, message: 'Projects fetched successfully', data });
});

export const createProject = asyncHandler(async (req, res) => {
  const project = await Project.create({
    ...req.body,
    startDate: new Date(req.body.startDate),
    endDate: new Date(req.body.endDate),
    ownerId: req.user._id,
    createdBy: req.user._id,
  });

  return res.status(201).json({ success: true, message: 'Project created successfully', data: project });
});

export const getProject = asyncHandler(async (req, res) => {
  if (req.user.role === 'developer' || req.user.role === 'designer') {
    const allowedProjectIds = (req.user.assignedProjects || []).map((projectId) => String(projectId));
    if (!allowedProjectIds.includes(String(req.params.id))) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
  }

  const project = await Project.findOne({ _id: req.params.id, ...ownerFilter(req) });

  if (!project) {
    return res.status(404).json({ success: false, message: 'Project not found' });
  }

  const assignedMembers = await User.find({ ...teamMemberFilter(req), assignedProjects: project._id })
    .select('name email role')
    .sort({ createdAt: -1 });

  return res.json({
    success: true,
    message: 'Project fetched successfully',
    data: serializeProject(
      project,
      assignedMembers.map((member) => ({ _id: member._id, name: member.name, email: member.email, role: member.role }))
    ),
  });
});

export const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findOneAndDelete({ _id: req.params.id, ...ownerFilter(req) });

  if (!project) {
    return res.status(404).json({ success: false, message: 'Project not found' });
  }

  return res.json({ success: true, message: 'Project deleted successfully', data: null });
});

export const updateProjectStatus = asyncHandler(async (req, res) => {
  if (req.user.role === 'developer' || req.user.role === 'designer') {
    const allowedProjectIds = (req.user.assignedProjects || []).map((projectId) => String(projectId));
    if (!allowedProjectIds.includes(String(req.params.id))) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
  }

  const project = await Project.findOne({ _id: req.params.id, ...ownerFilter(req) });

  if (!project) {
    return res.status(404).json({ success: false, message: 'Project not found' });
  }

  project.status = req.body.status;
  await project.save();

  return res.json({ success: true, message: 'Project status updated successfully', data: project });
});

export const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findOne({ _id: req.params.id, ...ownerFilter(req) });

  if (!project) {
    return res.status(404).json({ success: false, message: 'Project not found' });
  }

  const { name, status, startDate, endDate, clientName, budget } = req.body;

  if (name !== undefined) project.name = name;
  if (status !== undefined) project.status = status;
  if (startDate !== undefined) project.startDate = new Date(startDate);
  if (endDate !== undefined) project.endDate = new Date(endDate);
  if (clientName !== undefined) project.clientName = clientName;
  if (budget !== undefined) project.budget = budget;

  await project.save();

  return res.json({ success: true, message: 'Project updated successfully', data: project });
});
