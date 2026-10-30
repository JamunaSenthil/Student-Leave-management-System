import mongoose, { Schema, Document } from 'mongoose';

export interface IStudent extends Document {
  name: string;
  registerNumber: string;
  email: string;
  phone: string;
  password?: string;
  department: string;
  year: string;
  section: string;
  hostel: string;
  roomNumber: string;
  role: 'student';
  createdAt: Date;
  updatedAt: Date;
}

const StudentSchema = new Schema<IStudent>(
  {
    name: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true,
    },
    registerNumber: {
      type: String,
      required: [true, 'Register number is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
    },
    year: {
      type: String,
      required: [true, 'Year of study is required'],
      trim: true,
    },
    section: {
      type: String,
      required: [true, 'Section is required'],
      trim: true,
    },
    hostel: {
      type: String,
      required: [true, 'Hostel is required'],
      trim: true,
    },
    roomNumber: {
      type: String,
      required: [true, 'Room number is required'],
      trim: true,
    },
    role: {
      type: String,
      enum: ['student'],
      default: 'student',
    },
  },
  {
    timestamps: true,
  }
);

export const Student = mongoose.models.Student || mongoose.model<IStudent>('Student', StudentSchema);
