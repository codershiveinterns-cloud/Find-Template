import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['in_progress', 'completed', 'pending'],
      default: 'pending',
      required: true,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    clientName: { type: String, required: true, trim: true },
    budget: { type: Number, required: true, min: 0, default: 0 },
    templateKey: { type: String, trim: true, default: null },
    templateName: { type: String, trim: true, default: null },
    templateType: { type: String, trim: true, default: null },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export const Project = mongoose.model('Project', projectSchema);
