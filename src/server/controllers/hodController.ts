import { Response } from 'express';
import { Leave } from '../models/Leave.ts';
import { Student } from '../models/Student.ts';
import { HOD } from '../models/HOD.ts';
import { Notification } from '../models/Notification.ts';
import { AuthenticatedRequest } from '../middleware/authMiddleware.ts';

export const getHODDashboard = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const hodId = req.user?.id;
    const hod = await HOD.findById(hodId);

    if (!hod) {
      res.status(404).json({ success: false, message: 'HOD profile not found.' });
      return;
    }

    const department = hod.department;

    // Strict department scoping
    const totalStudents = await Student.countDocuments({ department });
    const totalLeaves = await Leave.countDocuments({ 'studentDetails.department': department });
    const pendingApprovals = await Leave.countDocuments({
      'studentDetails.department': department,
      hodStatus: 'Pending',
    });
    const approvedRequests = await Leave.countDocuments({
      'studentDetails.department': department,
      hodStatus: 'Approved',
    });
    const rejectedRequests = await Leave.countDocuments({
      'studentDetails.department': department,
      hodStatus: 'Rejected',
    });

    const recentRequests = await Leave.find({ 'studentDetails.department': department })
      .sort({ createdAt: -1 })
      .limit(6);

    res.status(200).json({
      success: true,
      data: {
        hod: {
          id: hod._id.toString(),
          name: hod.name,
          email: hod.email,
          department: hod.department,
          phone: hod.phone,
          officeRoom: hod.officeRoom,
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

export const getDepartmentStudents = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const department = req.user?.department;
    const { search, year, page = '1', limit = '10' } = req.query;

    const query: any = { department };

    if (year && year !== 'All') {
      query.year = year;
    }

    if (search && typeof search === 'string' && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [{ name: regex }, { registerNumber: regex }, { email: regex }];
    }

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const total = await Student.countDocuments(query);
    const students = await Student.find(query)
      .select('-password')
      .sort({ registerNumber: 1 })
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

export const getDepartmentLeaves = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const department = req.user?.department;
    const { status, type, search, page = '1', limit = '10' } = req.query;

    const query: any = { 'studentDetails.department': department };

    if (status && status !== 'All') {
      query.hodStatus = status;
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

export const getHODLeaveById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const department = req.user?.department;

    const leave = await Leave.findOne({
      $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { applicationId: id }],
      'studentDetails.department': department,
    });

    if (!leave) {
      res.status(404).json({
        success: false,
        message: 'Leave application not found in your department.',
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

export const decideLeaveHOD = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { decision, reason } = req.body;
    const hod = req.user;

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
      'studentDetails.department': hod?.department,
    });

    if (!leave) {
      res.status(404).json({
        success: false,
        message: 'Leave request not found or not in your department jurisdiction.',
      });
      return;
    }

    const remarks = reason ? reason.trim() : decision === 'Approved' ? 'Approved by Head of Department' : 'Rejected by Head of Department';

    if (decision === 'Approved') {
      leave.hodStatus = 'Approved';
      leave.hodRejectionReason = '';

      // Check if Warden has already approved
      if (leave.wardenStatus === 'Approved') {
        leave.overallStatus = 'Approved';
      } else if (leave.wardenStatus === 'Rejected') {
        leave.overallStatus = 'Rejected';
      } else {
        leave.overallStatus = 'Pending';
      }

      leave.approvalHistory.push({
        approverId: hod?.id,
        approverName: hod?.name || 'HOD',
        approverRole: 'hod',
        action: 'Approved',
        timestamp: new Date(),
        remarks,
      });

      // Notification for Student
      await Notification.create({
        recipientId: leave.student.toString(),
        recipientRole: 'student',
        title: 'HOD Approved Leave',
        message: `Your leave request (${leave.applicationId}) has been approved by HOD ${hod?.name}. Current status: ${leave.overallStatus}.`,
        leaveId: leave.applicationId,
        type: 'success',
      });
    } else {
      // Rejection by HOD
      leave.hodStatus = 'Rejected';
      leave.overallStatus = 'Rejected';
      leave.hodRejectionReason = remarks;

      leave.approvalHistory.push({
        approverId: hod?.id,
        approverName: hod?.name || 'HOD',
        approverRole: 'hod',
        action: 'Rejected',
        timestamp: new Date(),
        remarks,
      });

      // Notification for Student
      await Notification.create({
        recipientId: leave.student.toString(),
        recipientRole: 'student',
        title: 'HOD Rejected Leave',
        message: `Your leave request (${leave.applicationId}) was rejected by HOD ${hod?.name}. Reason: ${remarks}`,
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
    console.error('HOD decision error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
