import mongoose from 'mongoose';
import { DASHBOARD_MODULE_KEYS } from '../constants/modules.js';

const teamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    role: {
      type: String,
      enum: ['developer', 'designer', 'manager'],
      required: true,
    },
    memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    assignedProjects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
      },
    ],
    assignedProjectModule: {
      type: Boolean,
      default: false,
    },
    assignedModules: [
      {
        type: String,
        enum: DASHBOARD_MODULE_KEYS,
      },
    ],
    companyName: { type: String, trim: true, default: null },
    companyEmail: { type: String, lowercase: true, trim: true, default: null },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

teamSchema.index({ ownerId: 1, createdAt: -1 });
teamSchema.index({ ownerId: 1, email: 1 });
teamSchema.index({ memberId: 1 }, { unique: true });

export const Team = mongoose.model('Team', teamSchema);
