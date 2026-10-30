import bcryptjs from 'bcryptjs';
import { HOD } from '../models/HOD.ts';
import { Warden } from '../models/Warden.ts';
import { Student } from '../models/Student.ts';
import { Leave } from '../models/Leave.ts';
import { Notification } from '../models/Notification.ts';

export const seedInitialDatabase = async () => {
  try {
    const existingHODCount = await HOD.countDocuments();
    if (existingHODCount > 0) {
      console.log('Database already contains seed accounts. Skipping initialization.');
      return;
    }

    console.log('Seeding initial HODs, Wardens, Students, and Sample Leave Applications...');

    const salt = await bcryptjs.genSalt(10);
    const defaultPasswordHash = await bcryptjs.hash('password123', salt);

    // 1. Seed HODs
    const hods = await HOD.insertMany([
      {
        name: 'Dr. Robert Vance',
        email: 'hod.cse@campus.edu',
        password: defaultPasswordHash,
        department: 'Computer Science and Engineering',
        phone: '+91 9876543210',
        officeRoom: 'CS Block, Room 301',
        role: 'hod',
      },
      {
        name: 'Dr. Sarah Jenkins',
        email: 'hod.ece@campus.edu',
        password: defaultPasswordHash,
        department: 'Electronics and Communication',
        phone: '+91 9876543211',
        officeRoom: 'EC Block, Room 204',
        role: 'hod',
      },
      {
        name: 'Dr. Arthur Davis',
        email: 'hod.mech@campus.edu',
        password: defaultPasswordHash,
        department: 'Mechanical Engineering',
        phone: '+91 9876543212',
        officeRoom: 'Mech Workshop, Room 102',
        role: 'hod',
      },
      {
        name: 'Dr. Emily Chen',
        email: 'hod.it@campus.edu',
        password: defaultPasswordHash,
        department: 'Information Technology',
        phone: '+91 9876543213',
        officeRoom: 'IT Tech Center, Room 405',
        role: 'hod',
      },
    ]);

    // 2. Seed Wardens
    const wardens = await Warden.insertMany([
      {
        name: 'Mr. Michael Turner',
        email: 'warden.kaveri@campus.edu',
        password: defaultPasswordHash,
        hostel: 'Kaveri Boys Hostel',
        phone: '+91 9876500001',
        block: 'Block A (Boys Wing)',
        role: 'warden',
      },
      {
        name: 'Mr. David Miller',
        email: 'warden.ganga@campus.edu',
        password: defaultPasswordHash,
        hostel: 'Ganga Boys Hostel',
        phone: '+91 9876500002',
        block: 'Block B (Boys Wing)',
        role: 'warden',
      },
      {
        name: 'Ms. Priya Sharma',
        email: 'warden.yamuna@campus.edu',
        password: defaultPasswordHash,
        hostel: 'Yamuna Girls Hostel',
        phone: '+91 9876500003',
        block: 'Block C (Girls Wing)',
        role: 'warden',
      },
      {
        name: 'Ms. Anita Patel',
        email: 'warden.saraswati@campus.edu',
        password: defaultPasswordHash,
        hostel: 'Saraswati Girls Hostel',
        phone: '+91 9876500004',
        block: 'Block D (Girls Wing)',
        role: 'warden',
      },
    ]);

    // 3. Seed Students
    const students = await Student.insertMany([
      {
        name: 'Rahul Verma',
        registerNumber: '2023CSE042',
        email: 'rahul.cse@student.edu',
        password: defaultPasswordHash,
        phone: '+91 9123456780',
        department: 'Computer Science and Engineering',
        year: '3rd Year',
        section: 'A',
        hostel: 'Kaveri Boys Hostel',
        roomNumber: 'A-204',
        role: 'student',
      },
      {
        name: 'Ananya Iyer',
        registerNumber: '2023ECE018',
        email: 'ananya.ece@student.edu',
        password: defaultPasswordHash,
        phone: '+91 9123456781',
        department: 'Electronics and Communication',
        year: '2nd Year',
        section: 'B',
        hostel: 'Yamuna Girls Hostel',
        roomNumber: 'C-112',
        role: 'student',
      },
      {
        name: 'Vikramaditya Singh',
        registerNumber: '2022MECH077',
        email: 'vikram.mech@student.edu',
        password: defaultPasswordHash,
        phone: '+91 9123456782',
        department: 'Mechanical Engineering',
        year: '4th Year',
        section: 'A',
        hostel: 'Ganga Boys Hostel',
        roomNumber: 'B-310',
        role: 'student',
      },
    ]);

    const s1 = students[0];
    const s2 = students[1];

    // 4. Seed Sample Leave Applications
    const sampleLeaves = [
      {
        applicationId: 'LV-2026-001',
        student: s1._id,
        studentDetails: {
          name: s1.name,
          registerNumber: s1.registerNumber,
          department: s1.department,
          year: s1.year,
          section: s1.section,
          hostel: s1.hostel,
          roomNumber: s1.roomNumber,
          phone: s1.phone,
          email: s1.email,
        },
        leaveType: 'Home leave',
        fromDate: '2026-11-05',
        toDate: '2026-11-09',
        numberOfDays: 5,
        reason: 'Attending elder sister wedding ceremony and family celebrations in hometown.',
        destination: '142 MG Road, Bangalore, Karnataka',
        parentContact: '+91 9845012345',
        emergencyContact: '+91 9845012346',
        hodStatus: 'Pending',
        wardenStatus: 'Pending',
        overallStatus: 'Pending',
        approvalHistory: [
          {
            approverName: s1.name,
            approverRole: 'student',
            action: 'Submitted',
            timestamp: new Date(Date.now() - 3600000 * 5),
            remarks: 'Application submitted for approval.',
          },
        ],
        appliedAt: new Date(Date.now() - 3600000 * 5),
      },
      {
        applicationId: 'LV-2026-002',
        student: s1._id,
        studentDetails: {
          name: s1.name,
          registerNumber: s1.registerNumber,
          department: s1.department,
          year: s1.year,
          section: s1.section,
          hostel: s1.hostel,
          roomNumber: s1.roomNumber,
          phone: s1.phone,
          email: s1.email,
        },
        leaveType: 'Medical leave',
        fromDate: '2026-11-12',
        toDate: '2026-11-14',
        numberOfDays: 3,
        reason: 'Root canal dental surgery and post-procedure recovery as advised by medical doctor.',
        destination: 'Apollo Specialty Hospital Dental Wing, Chennai',
        parentContact: '+91 9845012345',
        emergencyContact: '+91 9845012346',
        hodStatus: 'Approved',
        wardenStatus: 'Pending',
        overallStatus: 'Pending',
        approvalHistory: [
          {
            approverName: s1.name,
            approverRole: 'student',
            action: 'Submitted',
            timestamp: new Date(Date.now() - 3600000 * 24),
            remarks: 'Medical leave request submitted.',
          },
          {
            approverId: hods[0]._id.toString(),
            approverName: hods[0].name,
            approverRole: 'hod',
            action: 'Approved',
            timestamp: new Date(Date.now() - 3600000 * 18),
            remarks: 'Approved. Take care and ensure lecture notes are gathered upon return.',
          },
        ],
        appliedAt: new Date(Date.now() - 3600000 * 24),
      },
      {
        applicationId: 'LV-2026-003',
        student: s1._id,
        studentDetails: {
          name: s1.name,
          registerNumber: s1.registerNumber,
          department: s1.department,
          year: s1.year,
          section: s1.section,
          hostel: s1.hostel,
          roomNumber: s1.roomNumber,
          phone: s1.phone,
          email: s1.email,
        },
        leaveType: 'Personal leave',
        fromDate: '2026-10-20',
        toDate: '2026-10-22',
        numberOfDays: 3,
        reason: 'Participated in National Inter-College Hackathon at Indian Institute of Science.',
        destination: 'IISc Campus, Bengaluru',
        parentContact: '+91 9845012345',
        emergencyContact: '+91 9845012346',
        hodStatus: 'Approved',
        wardenStatus: 'Approved',
        overallStatus: 'Approved',
        approvalHistory: [
          {
            approverName: s1.name,
            approverRole: 'student',
            action: 'Submitted',
            timestamp: new Date(Date.now() - 3600000 * 200),
            remarks: 'Submitted with recommendation letter.',
          },
          {
            approverId: hods[0]._id.toString(),
            approverName: hods[0].name,
            approverRole: 'hod',
            action: 'Approved',
            timestamp: new Date(Date.now() - 3600000 * 190),
            remarks: 'Best of luck representing the college department.',
          },
          {
            approverId: wardens[0]._id.toString(),
            approverName: wardens[0].name,
            approverRole: 'warden',
            action: 'Approved',
            timestamp: new Date(Date.now() - 3600000 * 180),
            remarks: 'Gate pass authorized. Return before 8:00 PM on Oct 22nd.',
          },
        ],
        appliedAt: new Date(Date.now() - 3600000 * 200),
      },
      {
        applicationId: 'LV-2026-004',
        student: s2._id,
        studentDetails: {
          name: s2.name,
          registerNumber: s2.registerNumber,
          department: s2.department,
          year: s2.year,
          section: s2.section,
          hostel: s2.hostel,
          roomNumber: s2.roomNumber,
          phone: s2.phone,
          email: s2.email,
        },
        leaveType: 'Personal leave',
        fromDate: '2026-10-25',
        toDate: '2026-10-28',
        numberOfDays: 4,
        reason: 'Personal outing to visit relatives.',
        destination: 'Hyderabad, Telangana',
        parentContact: '+91 9988776655',
        emergencyContact: '+91 9988776654',
        hodStatus: 'Rejected',
        wardenStatus: 'Pending',
        overallStatus: 'Rejected',
        hodRejectionReason: 'Mid-term laboratory evaluations and practical examinations are scheduled during these dates.',
        approvalHistory: [
          {
            approverName: s2.name,
            approverRole: 'student',
            action: 'Submitted',
            timestamp: new Date(Date.now() - 3600000 * 90),
            remarks: 'Submitted for clearance.',
          },
          {
            approverId: hods[1]._id.toString(),
            approverName: hods[1].name,
            approverRole: 'hod',
            action: 'Rejected',
            timestamp: new Date(Date.now() - 3600000 * 80),
            remarks: 'Mid-term laboratory evaluations and practical examinations are scheduled during these dates.',
          },
        ],
        appliedAt: new Date(Date.now() - 3600000 * 90),
      },
    ];

    await Leave.insertMany(sampleLeaves);

    // 5. Seed Notifications
    await Notification.insertMany([
      {
        recipientId: s1._id.toString(),
        recipientRole: 'student',
        title: 'HOD Approved Your Medical Leave',
        message: 'Dr. Robert Vance approved your leave request (LV-2026-002). It is now awaiting Warden review.',
        leaveId: 'LV-2026-002',
        isRead: false,
        type: 'info',
        createdAt: new Date(Date.now() - 3600000 * 18),
      },
      {
        recipientId: s1._id.toString(),
        recipientRole: 'student',
        title: 'Leave Approved',
        message: 'Your leave application (LV-2026-003) has been fully approved by both HOD and Warden.',
        leaveId: 'LV-2026-003',
        isRead: true,
        type: 'success',
        createdAt: new Date(Date.now() - 3600000 * 180),
      },
      {
        recipientId: hods[0]._id.toString(),
        recipientRole: 'hod',
        title: 'New Leave Request Received',
        message: 'Rahul Verma submitted a Home Leave request (LV-2026-001) for 5 days.',
        leaveId: 'LV-2026-001',
        isRead: false,
        type: 'warning',
        createdAt: new Date(Date.now() - 3600000 * 5),
      },
      {
        recipientId: wardens[0]._id.toString(),
        recipientRole: 'warden',
        title: 'Leave Awaiting Warden Review',
        message: 'Medical leave (LV-2026-002) for Rahul Verma (Room A-204) approved by HOD, pending your decision.',
        leaveId: 'LV-2026-002',
        isRead: false,
        type: 'warning',
        createdAt: new Date(Date.now() - 3600000 * 18),
      },
    ]);

    console.log('Database seeded successfully with test credentials and realistic demo state.');
  } catch (error) {
    console.error('Database seeding error:', error);
  }
};
