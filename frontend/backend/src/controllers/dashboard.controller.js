import { Project } from '../models/Project.js';
import { Client } from '../models/Client.js';
import { Invoice } from '../models/Invoice.js';
import { Service } from '../models/Service.js';
import { User } from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const effectiveOwnerId = (req) => (req.user.role === 'admin' || req.user.isOwner ? req.user._id : req.user.ownerId);
const ownerFilter = (req) => ({ ownerId: effectiveOwnerId(req) });

export const getOverview = asyncHandler(async (req, res) => {
  const filter = ownerFilter(req);
  const [projects, teams, clients, invoices, services, revenueResult] = await Promise.all([
    Project.countDocuments(filter),
    User.countDocuments({ ownerId: effectiveOwnerId(req), role: { $in: ['developer', 'designer', 'manager'] } }),
    Client.countDocuments(filter),
    Invoice.countDocuments(filter),
    Service.countDocuments(filter),
    Project.aggregate([
      { $match: { ownerId: effectiveOwnerId(req) } },
      { $group: { _id: null, total: { $sum: '$budget' } } },
    ]),
  ]);


  const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

  return res.json({
    success: true,
    message: 'Overview fetched successfully',
    data: { projects, teams, clients, invoices, services, totalRevenue },
  });
});

export const getChartData = asyncHandler(async (req, res) => {
  const filter = ownerFilter(req);
  const allProjects = await Project.find(filter).select('createdAt budget').lean();

  const monthlyMap = {};

  allProjects.forEach((project) => {
    const date = new Date(project.createdAt);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (!monthlyMap[key]) {
      monthlyMap[key] = { month: key, projects: 0, budget: 0 };
    }
    monthlyMap[key].projects += 1;
    monthlyMap[key].budget += project.budget || 0;
  });

  const chartData = Object.values(monthlyMap).sort((a, b) => a.month.localeCompare(b.month));

  return res.json({
    success: true,
    message: 'Chart data fetched successfully',
    data: chartData,
  });
});

export const getProjects = asyncHandler(async (req, res) => {
  const data = await Project.find(ownerFilter(req)).sort({ createdAt: -1 });
  return res.json({ success: true, message: 'Projects fetched successfully', data });
});

export const getTeams = asyncHandler(async (req, res) => {
  const data = await User.find({ ownerId: effectiveOwnerId(req), role: { $in: ['developer', 'designer', 'manager'] } })
    .sort({ createdAt: -1 })
    .populate('assignedProjects', 'name status templateKey templateName templateType');
  return res.json({ success: true, message: 'Teams fetched successfully', data });
});

export const getClients = asyncHandler(async (req, res) => {
  const data = await Client.find(ownerFilter(req)).sort({ createdAt: -1 });
  return res.json({ success: true, message: 'Clients fetched successfully', data });
});

export const getInvoices = asyncHandler(async (req, res) => {
  const data = await Invoice.find(ownerFilter(req)).sort({ createdAt: -1 }).populate('clientId', 'name email company');
  return res.json({ success: true, message: 'Invoices fetched successfully', data });
});

export const getServices = asyncHandler(async (req, res) => {
  const data = await Service.find(ownerFilter(req)).sort({ createdAt: -1 });
  return res.json({ success: true, message: 'Services fetched successfully', data });
});
