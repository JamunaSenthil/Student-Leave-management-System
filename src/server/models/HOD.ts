import mongoose, { Schema, Document } from 'mongoose';

export interface IHOD extends Document {
  name: string;
  email: string;
  password?: string;
  department: string;
  phone?: string;
  officeRoom?: string;
  role: 'hod';
  createdAt: Date;
  updatedAt: Date;
}

const HODSchema = new Schema<IHOD>(
  {
    name: {
      type: String,
      required: [true, 'HOD name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      unique: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    officeRoom: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ['hod'],
      default: 'hod',
    },
  },
  {
    timestamps: true,
  }
);

export const HOD = mongoose.models.HOD || mongoose.model<IHOD>('HOD', HODSchema);
