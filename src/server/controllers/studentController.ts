import { Response } from 'express';
import { Student } from '../models/Student.ts';
import { Leave } from '../models/Leave.ts';
import { AuthenticatedRequest } from '../middleware/authMiddleware.ts';

export const getStudentProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    const student = await Student.findById(studentId).select('-password');

    if (!student) {
      res.status(404).json({ success: false, message: 'Student profile not found.' });
      return;
    }

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateStudentProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    const { phone, roomNumber, section, year } = req.body;

    const student = await Student.findById(studentId);
    if (!student) {
      res.status(404).json({ success: false, message: 'Student profile not found.' });
      return;
    }

    if (phone) student.phone = phone.trim();
    if (roomNumber) student.roomNumber = roomNumber.trim();
    if (section) student.section = section.trim();
    if (year) student.year = year.trim();

    await student.save();

    res.status(200).json({
      success: true,
      message: 'Profile details updated successfully.',
      data: {
        id: student._id.toString(),
        name: student.name,
        registerNumber: student.registerNumber,
        email: student.email,
        phone: student.phone,
        department: student.department,
        year: student.year,
        section: student.section,
        hostel: student.hostel,
        roomNumber: student.roomNumber,
        role: student.role,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStudentDashboard = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    const student = await Student.findById(studentId).select('-password');

    if (!student) {
      res.status(404).json({ success: false, message: 'Student profile not found.' });
      return;
    }

    const totalApplications = await Leave.countDocuments({ student: student._id });
    const pendingApplications = await Leave.countDocuments({
      student: student._id,
      overallStatus: 'Pending',
    });
    const approvedApplications = await Leave.countDocuments({
      student: student._id,
      overallStatus: 'Approved',
    });
    const rejectedApplications = await Leave.countDocuments({
      student: student._id,
      overallStatus: 'Rejected',
    });

    const recentLeaves = await Leave.find({ student: student._id })
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        student: {
          id: student._id.toString(),
          name: student.name,
          registerNumber: student.registerNumber,
          department: student.department,
          year: student.year,
          section: student.section,
          hostel: student.hostel,
          roomNumber: student.roomNumber,
          email: student.email,
          phone: student.phone,
        },
        stats: {
          total: totalApplications,
          pending: pendingApplications,
          approved: approvedApplications,
          rejected: rejectedApplications,
        },
        recentLeaves,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
