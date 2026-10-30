import mongoose, { Schema, Document, Types } from 'mongoose';

export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';
export type LeaveType = 'Home leave' | 'Medical leave' | 'Personal leave' | 'Other';

export interface IApprovalHistory {
  approverId?: string;
  approverName: string;
  approverRole: 'student' | 'hod' | 'warden' | 'system';
  action: 'Submitted' | 'Approved' | 'Rejected';
  timestamp: Date;
  remarks?: string;
}

export interface ILeave extends Document {
  applicationId: string;
  student: Types.ObjectId;
  studentDetails: {
    name: string;
    registerNumber: string;
    department: string;
    year: string;
    section: string;
    hostel: string;
    roomNumber: string;
    phone: string;
    email: string;
  };
  leaveType: LeaveType;
  fromDate: string;
  toDate: string;
  numberOfDays: number;
  reason: string;
  destination: string;
  parentContact: string;
  emergencyContact?: string;
  supportingDocument?: string;
  hodStatus: LeaveStatus;
  wardenStatus: LeaveStatus;
  overallStatus: LeaveStatus;
  hodRejectionReason?: string;
  wardenRejectionReason?: string;
  approvalHistory: IApprovalHistory[];
  appliedAt: Date;
  updatedAt: Date;
}

const ApprovalHistorySchema = new Schema<IApprovalHistory>(
  {
    approverId: { type: String },
    approverName: { type: String, required: true },
    approverRole: {
      type: String,
      enum: ['student', 'hod', 'warden', 'system'],
      required: true,
    },
    action: {
      type: String,
      enum: ['Submitted', 'Approved', 'Rejected'],
      required: true,
    },
    timestamp: { type: Date, default: Date.now },
    remarks: { type: String, default: '' },
  },
  { _id: false }
);

const LeaveSchema = new Schema<ILeave>(
  {
    applicationId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    student: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
      index: true,
    },
    studentDetails: {
      name: { type: String, required: true },
      registerNumber: { type: String, required: true, index: true },
      department: { type: String, required: true, index: true },
      year: { type: String, required: true },
      section: { type: String, required: true },
      hostel: { type: String, required: true, index: true },
      roomNumber: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, required: true },
    },
    leaveType: {
      type: String,
      enum: ['Home leave', 'Medical leave', 'Personal leave', 'Other'],
      required: true,
    },
    fromDate: {
      type: String,
      required: true,
    },
    toDate: {
      type: String,
      required: true,
    },
    numberOfDays: {
      type: Number,
      required: true,
      min: 1,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
    },
    destination: {
      type: String,
      required: true,
      trim: true,
    },
    parentContact: {
      type: String,
      required: true,
      trim: true,
    },
    emergencyContact: {
      type: String,
      trim: true,
      default: '',
    },
    supportingDocument: {
      type: String,
      default: '',
    },
    hodStatus: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
      index: true,
    },
    wardenStatus: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
      index: true,
    },
    overallStatus: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
      index: true,
    },
    hodRejectionReason: {
      type: String,
      default: '',
    },
    wardenRejectionReason: {
      type: String,
      default: '',
    },
    approvalHistory: [ApprovalHistorySchema],
    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const Leave = mongoose.models.Leave || mongoose.model<ILeave>('Leave', LeaveSchema);
