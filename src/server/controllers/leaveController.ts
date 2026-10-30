import { Response } from 'express';
import { Leave, LeaveType } from '../models/Leave.ts';
import { Student } from '../models/Student.ts';
import { HOD } from '../models/HOD.ts';
import { Warden } from '../models/Warden.ts';
import { Notification } from '../models/Notification.ts';
import { AuthenticatedRequest } from '../middleware/authMiddleware.ts';

// Helper to generate unique application ID
const generateApplicationId = async (): Promise<string> => {
  const year = new Date().getFullYear();
  let uniqueId = '';
  let exists = true;
  while (exists) {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    uniqueId = `LV-${year}-${randomNum}`;
    const found = await Leave.findOne({ applicationId: uniqueId });
    if (!found) {
      exists = false;
    }
  }
  return uniqueId;
};

// Calculate difference in days between two YYYY-MM-DD dates inclusive
const calculateDays = (fromStr: string, toStr: string): number => {
  const from = new Date(fromStr);
  const to = new Date(toStr);
  const diffTime = to.getTime() - from.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return diffDays > 0 ? diffDays : 1;
};

export const applyLeave = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    const student = await Student.findById(studentId);

    if (!student) {
      res.status(404).json({ success: false, message: 'Student account not found.' });
      return;
    }

    const {
      leaveType,
      fromDate,
      toDate,
      reason,
      destination,
      parentContact,
      emergencyContact,
      supportingDocument,
    } = req.body;

    // Validate mandatory fields
    if (!leaveType || !fromDate || !toDate || !reason || !destination || !parentContact) {
      res.status(400).json({
        success: false,
        message: 'Leave type, from date, to date, reason, destination, and parent contact are mandatory.',
      });
      return;
    }

    // Validate date logic
    const start = new Date(fromDate);
    const end = new Date(toDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      res.status(400).json({ success: false, message: 'Invalid fromDate or toDate format.' });
      return;
    }

    if (start > end) {
      res.status(400).json({ success: false, message: 'From Date cannot be later than To Date.' });
      return;
    }

    const numberOfDays = calculateDays(fromDate, toDate);
    const applicationId = await generateApplicationId();

    const newLeave = await Leave.create({
      applicationId,
      student: student._id,
      studentDetails: {
        name: student.name,
        registerNumber: student.registerNumber,
        department: student.department,
        year: student.year,
        section: student.section,
        hostel: student.hostel,
        roomNumber: student.roomNumber,
        phone: student.phone,
        email: student.email,
      },
      leaveType: leaveType as LeaveType,
      fromDate,
      toDate,
      numberOfDays,
      reason: reason.trim(),
      destination: destination.trim(),
      parentContact: parentContact.trim(),
      emergencyContact: emergencyContact ? emergencyContact.trim() : '',
      supportingDocument: supportingDocument || '',
      hodStatus: 'Pending',
      wardenStatus: 'Pending',
      overallStatus: 'Pending',
      approvalHistory: [
        {
          approverName: student.name,
          approverRole: 'student',
          action: 'Submitted',
          timestamp: new Date(),
          remarks: 'Leave application submitted.',
        },
      ],
      appliedAt: new Date(),
    });

    // Notify HOD of the department
    const hod = await HOD.findOne({ department: student.department });
    if (hod) {
      await Notification.create({
        recipientId: hod._id.toString(),
        recipientRole: 'hod',
        title: 'New Leave Application',
        message: `${student.name} (${student.registerNumber}) applied for ${leaveType} (${numberOfDays} days).`,
        leaveId: newLeave.applicationId,
        type: 'info',
      });
    }

    // Notify Warden of the hostel
    const warden = await Warden.findOne({ hostel: student.hostel });
    if (warden) {
      await Notification.create({
        recipientId: warden._id.toString(),
        recipientRole: 'warden',
        title: 'New Leave Application',
        message: `${student.name} (Room ${student.roomNumber}) applied for ${leaveType} (${numberOfDays} days).`,
        leaveId: newLeave.applicationId,
        type: 'info',
      });
    }

    // Student confirmation notification
    await Notification.create({
      recipientId: student._id.toString(),
      recipientRole: 'student',
      title: 'Leave Submitted Successfully',
      message: `Your leave request ${applicationId} has been submitted and is currently pending review by your HOD and Warden.`,
      leaveId: newLeave.applicationId,
      type: 'info',
    });

    res.status(201).json({
      success: true,
      message: 'Leave application submitted successfully.',
      data: newLeave,
    });
  } catch (error: any) {
    console.error('Apply leave error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyLeaves = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    const { status, type, search, page = '1', limit = '10' } = req.query;

    const query: any = { student: studentId };

    if (status && status !== 'All') {
      query.overallStatus = status;
    }

    if (type && type !== 'All') {
      query.leaveType = type;
    }

    if (search && typeof search === 'string' && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { applicationId: searchRegex },
        { reason: searchRegex },
        { destination: searchRegex },
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

export const getLeaveById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = req.user;

    const leave = await Leave.findOne({
      $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { applicationId: id }],
    });

    if (!leave) {
      res.status(404).json({ success: false, message: 'Leave application not found.' });
      return;
    }

    // Role-based authorization check
    if (user?.role === 'student') {
      if (leave.student.toString() !== user.id) {
        res.status(403).json({ success: false, message: 'Unauthorized to view this leave record.' });
        return;
      }
    } else if (user?.role === 'hod') {
      if (leave.studentDetails.department !== user.department) {
        res.status(403).json({
          success: false,
          message: 'Access restricted: Student does not belong to your department.',
        });
        return;
      }
    } else if (user?.role === 'warden') {
      if (leave.studentDetails.hostel !== user.hostel) {
        res.status(403).json({
          success: false,
          message: 'Access restricted: Student does not reside in your assigned hostel.',
        });
        return;
      }
    }

    res.status(200).json({
      success: true,
      data: leave,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const trackLeave = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = req.user;

    const leave = await Leave.findOne({
      $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { applicationId: id }],
    });

    if (!leave) {
      res.status(404).json({ success: false, message: 'Leave application not found.' });
      return;
    }

    if (user?.role === 'student' && leave.student.toString() !== user.id) {
      res.status(403).json({ success: false, message: 'Unauthorized access to leave tracking.' });
      return;
    }

    // Generate timeline nodes
    const timeline = [
      {
        step: 1,
        title: 'Application Submitted',
        description: `Applied by ${leave.studentDetails.name} on ${new Date(
          leave.appliedAt
        ).toLocaleDateString()}`,
        status: 'Completed',
        timestamp: leave.appliedAt,
      },
      {
        step: 2,
        title: 'HOD Department Review',
        description:
          leave.hodStatus === 'Pending'
            ? `Awaiting review by Head of ${leave.studentDetails.department}`
            : leave.hodStatus === 'Approved'
            ? 'Approved by Head of Department'
            : `Rejected by HOD: ${leave.hodRejectionReason || 'No reason specified'}`,
        status:
          leave.hodStatus === 'Approved'
            ? 'Approved'
            : leave.hodStatus === 'Rejected'
            ? 'Rejected'
            : 'Pending',
        remarks: leave.hodRejectionReason,
      },
      {
        step: 3,
        title: 'Hostel Warden Review',
        description:
          leave.wardenStatus === 'Pending'
            ? `Awaiting review by Warden of ${leave.studentDetails.hostel}`
            : leave.wardenStatus === 'Approved'
            ? 'Approved by Hostel Warden'
            : `Rejected by Warden: ${leave.wardenRejectionReason || 'No reason specified'}`,
        status:
          leave.wardenStatus === 'Approved'
            ? 'Approved'
            : leave.wardenStatus === 'Rejected'
            ? 'Rejected'
            : 'Pending',
        remarks: leave.wardenRejectionReason,
      },
      {
        step: 4,
        title: 'Final Clearance Status',
        description:
          leave.overallStatus === 'Approved'
            ? 'Leave Granted. Gate pass and attendance exception authorized.'
            : leave.overallStatus === 'Rejected'
            ? 'Leave Application Denied.'
            : 'Under multi-tier administrative review.',
        status: leave.overallStatus,
      },
    ];

    res.status(200).json({
      success: true,
      data: {
        leave,
        timeline,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
