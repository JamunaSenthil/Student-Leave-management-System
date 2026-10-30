import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  recipientId: string;
  recipientRole: 'student' | 'hod' | 'warden';
  title: string;
  message: string;
  leaveId?: string;
  isRead: boolean;
  type: 'info' | 'success' | 'warning' | 'danger';
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    recipientId: {
      type: String,
      required: true,
      index: true,
    },
    recipientRole: {
      type: String,
      enum: ['student', 'hod', 'warden'],
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    leaveId: {
      type: String,
      default: '',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      enum: ['info', 'success', 'warning', 'danger'],
      default: 'info',
    },
  },
  {
    timestamps: true,
  }
);

export const Notification =
  mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);
