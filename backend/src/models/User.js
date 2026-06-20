import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    accountType: {
      type: String,
      enum: ['freelancer_individual', 'company_business'],
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    plainPass: {
      type: String,
      required: true,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ['admin', 'developer', 'designer'],
      default: 'admin',
      required: true,
    },
    isOwner: {
      type: Boolean,
      default: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
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
    companyName: {
      type: String,
      trim: true,
      default: null,
    },
    companyEmail: {
      type: String,
      lowercase: true,
      trim: true,
      default: null,
    },
    selectedPackage: {
      type: String,
      enum: ['plus', 'pro', 'business', null],
      default: null,
    },
    selectedPackageBilling: {
      type: String,
      enum: ['monthly', 'yearly', null],
      default: null,
    },
    selectedPackagePrice: {
      type: Number,
      default: 0,
    },
    selectedPackageActivatedAt: {
      type: Date,
      default: null,
    },
    paymentEmail: {
      type: String,
      lowercase: true,
      trim: true,
      default: null,
    },
    paymentMethod: {
      type: String,
      trim: true,
      default: null,
    },
    purchasedTemplates: [
      {
        templateKey: { type: String, required: true },
        name: { type: String, required: true },
        type: { type: String, required: true },
        paymentEmail: { type: String, lowercase: true, trim: true, default: null },
        paymentMethod: { type: String, trim: true, default: null },
        purchasedAt: { type: Date, default: Date.now },
      },
    ],
    lastLoginAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

userSchema.index({ companyEmail: 1 }, { sparse: true });
userSchema.index({ ownerId: 1, role: 1 });
userSchema.index({ companyEmail: 1, role: 1 });

userSchema.methods.toSafeProfile = function () {
  return {
    id: this._id,
    accountType: this.accountType,
    // plainPass:this.plainPass,
    name: this.name,
    email: this.email,
    role: this.role,
    isOwner: this.isOwner,
    ownerId: this.ownerId,
    assignedProjects: this.assignedProjects || [],
    assignedProjectModule: this.assignedProjectModule,
    companyName: this.companyName,
    companyEmail: this.companyEmail,
    selectedPackage: this.selectedPackage,
    selectedPackageBilling: this.selectedPackageBilling,
    selectedPackagePrice: this.selectedPackagePrice,
    selectedPackageActivatedAt: this.selectedPackageActivatedAt,
    paymentEmail: this.paymentEmail,
    paymentMethod: this.paymentMethod,
    purchasedTemplates: this.purchasedTemplates || [],
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    lastLoginAt: this.lastLoginAt,
  };
};

export const User = mongoose.model('User', userSchema);
