import { Response } from 'express';
import { Leave } from '../models/Leave.ts';
import { Student } from '../models/Student.ts';
import { Warden } from '../models/Warden.ts';
import { Notification } from '../models/Notification.ts';
import { AuthenticatedRequest } from '../middleware/authMiddleware.ts';

export const getWardenDashboard = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const wardenId = req.user?.id;
    const warden = await Warden.findById(wardenId);

    if (!warden) {
      res.status(404).json({ success: false, message: 'Warden profile not found.' });
      return;
    }

    const hostel = warden.hostel;

    // Strict hostel scoping
    const totalStudents = await Student.countDocuments({ hostel });
    const totalLeaves = await Leave.countDocuments({ 'studentDetails.hostel': hostel });
    const pendingApprovals = await Leave.countDocuments({
      'studentDetails.hostel': hostel,
      wardenStatus: 'Pending',
    });
    const approvedRequests = await Leave.countDocuments({
      'studentDetails.hostel': hostel,
      wardenStatus: 'Approved',
    });
    const rejectedRequests = await Leave.countDocuments({
      'studentDetails.hostel': hostel,
      wardenStatus: 'Rejected',
    });

    const recentRequests = await Leave.find({ 'studentDetails.hostel': hostel })
      .sort({ createdAt: -1 })
      .limit(6);

    res.status(200).json({
      success: true,
      data: {
        warden: {
          id: warden._id.toString(),
          name: warden.name,
          email: warden.email,
          hostel: warden.hostel,
          phone: warden.phone,
          block: warden.block,
        },
        stats: {
          totalStudents,
          totalLeaves,
          pendingApprovals,
          approvedRequests,
          rejectedRequests,
        },
        recentRequests,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getHostelStudents = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const hostel = req.user?.hostel;
    const { search, room, page = '1', limit = '10' } = req.query;

    const query: any = { hostel };

    if (room && typeof room === 'string' && room.trim() !== '') {
      query.roomNumber = new RegExp(room.trim(), 'i');
    }

    if (search && typeof search === 'string' && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [{ name: regex }, { registerNumber: regex }, { email: regex }, { roomNumber: regex }];
    }

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const total = await Student.countDocuments(query);
    const students = await Student.find(query)
      .select('-password')
      .sort({ roomNumber: 1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      data: students,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getHostelLeaves = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const hostel = req.user?.hostel;
    const { status, type, search, page = '1', limit = '10' } = req.query;

    const query: any = { 'studentDetails.hostel': hostel };

    if (status && status !== 'All') {
      query.wardenStatus = status;
    }

    if (type && type !== 'All') {
      query.leaveType = type;
    }

    if (search && typeof search === 'string' && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { applicationId: regex },
        { 'studentDetails.name': regex },
        { 'studentDetails.registerNumber': regex },
        { 'studentDetails.roomNumber': regex },
        { reason: regex },
      ];
    }

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const total = await Leave.countDocuments(query);
    const leaves = await Leave.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      data: leaves,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getWardenLeaveById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const hostel = req.user?.hostel;

    const leave = await Leave.findOne({
      $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { applicationId: id }],
      'studentDetails.hostel': hostel,
    });

    if (!leave) {
      res.status(404).json({
        success: false,
        message: 'Leave application not found in your assigned hostel.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: leave,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const decideLeaveWarden = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { decision, reason } = req.body;
    const warden = req.user;

    if (!['Approved', 'Rejected'].includes(decision)) {
      res.status(400).json({
        success: false,
        message: "Invalid decision. Must be 'Approved' or 'Rejected'.",
      });
      return;
    }

    if (decision === 'Rejected' && (!reason || reason.trim() === '')) {
      res.status(400).json({
        success: false,
        message: 'A rejection reason is required when denying leave requests.',
      });
      return;
    }

    const leave = await Leave.findOne({
      $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { applicationId: id }],
      'studentDetails.hostel': warden?.hostel,
    });

    if (!leave) {
      res.status(404).json({
        success: false,
        message: 'Leave request not found or not in your hostel jurisdiction.',
      });
      return;
    }

    const remarks = reason ? reason.trim() : decision === 'Approved' ? 'Approved by Hostel Warden' : 'Rejected by Hostel Warden';

    if (decision === 'Approved') {
      leave.wardenStatus = 'Approved';
      leave.wardenRejectionReason = '';

      // Check if HOD has also approved
      if (leave.hodStatus === 'Approved') {
        leave.overallStatus = 'Approved';
      } else if (leave.hodStatus === 'Rejected') {
        leave.overallStatus = 'Rejected';
      } else {
        leave.overallStatus = 'Pending';
      }

      leave.approvalHistory.push({
        approverId: warden?.id,
        approverName: warden?.name || 'Warden',
        approverRole: 'warden',
        action: 'Approved',
        timestamp: new Date(),
        remarks,
      });

      // Notification for Student
      await Notification.create({
        recipientId: leave.student.toString(),
        recipientRole: 'student',
        title: 'Warden Approved Leave',
        message: `Your leave request (${leave.applicationId}) has been approved by Warden ${warden?.name}. Current status: ${leave.overallStatus}.`,
        leaveId: leave.applicationId,
        type: 'success',
      });
    } else {
      // Rejection by Warden
      leave.wardenStatus = 'Rejected';
      leave.overallStatus = 'Rejected';
      leave.wardenRejectionReason = remarks;

      leave.approvalHistory.push({
        approverId: warden?.id,
        approverName: warden?.name || 'Warden',
        approverRole: 'warden',
        action: 'Rejected',
        timestamp: new Date(),
        remarks,
      });

      // Notification for Student
      await Notification.create({
        recipientId: leave.student.toString(),
        recipientRole: 'student',
        title: 'Warden Rejected Leave',
        message: `Your leave request (${leave.applicationId}) was rejected by Warden ${warden?.name}. Reason: ${remarks}`,
        leaveId: leave.applicationId,
        type: 'danger',
      });
    }

    await leave.save();

    res.status(200).json({
      success: true,
      message: `Leave application ${decision.toLowerCase()} successfully.`,
      data: leave,
    });
  } catch (error: any) {
    console.error('Warden decision error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
