import mongoose, { Schema, Document } from 'mongoose';

export interface IWarden extends Document {
  name: string;
  email: string;
  password?: string;
  hostel: string;
  phone?: string;
  block?: string;
  role: 'warden';
  createdAt: Date;
  updatedAt: Date;
}

const WardenSchema = new Schema<IWarden>(
  {
    name: {
      type: String,
      required: [true, 'Warden name is required'],
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
    hostel: {
      type: String,
      required: [true, 'Hostel is required'],
      unique: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    block: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ['warden'],
      default: 'warden',
    },
  },
  {
    timestamps: true,
  }
);

export const Warden = mongoose.models.Warden || mongoose.model<IWarden>('Warden', WardenSchema);
