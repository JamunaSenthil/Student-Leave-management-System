import { Response } from 'express';
import bcryptjs from 'bcryptjs';
import { Student } from '../models/Student.ts';
import { HOD } from '../models/HOD.ts';
import { Warden } from '../models/Warden.ts';
import { generateToken, AuthenticatedRequest } from '../middleware/authMiddleware.ts';

export const registerStudent = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const {
      name,
      registerNumber,
      email,
      phone,
      password,
      confirmPassword,
      department,
      year,
      section,
      hostel,
      roomNumber,
    } = req.body;

    // Validate mandatory fields
    if (
      !name ||
      !registerNumber ||
      !email ||
      !phone ||
      !password ||
      !confirmPassword ||
      !department ||
      !year ||
      !section ||
      !hostel ||
      !roomNumber
    ) {
      res.status(400).json({
        success: false,
        message: 'All registration fields are required.',
      });
      return;
    }

    if (password !== confirmPassword) {
      res.status(400).json({
        success: false,
        message: 'Password and Confirm Password do not match.',
      });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
      return;
    }

    // Check unique email and registerNumber
    const existingEmail = await Student.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      res.status(409).json({
        success: false,
        message: 'A student account with this email address already exists.',
      });
      return;
    }

    const existingReg = await Student.findOne({
      registerNumber: registerNumber.toUpperCase(),
    });
    if (existingReg) {
      res.status(409).json({
        success: false,
        message: 'A student account with this register number already exists.',
      });
      return;
    }

    // Hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const student = await Student.create({
      name: name.trim(),
      registerNumber: registerNumber.trim().toUpperCase(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      password: hashedPassword,
      department: department.trim(),
      year: year.trim(),
      section: section.trim(),
      hostel: hostel.trim(),
      roomNumber: roomNumber.trim(),
      role: 'student',
    });

    const token = generateToken({
      id: student._id.toString(),
      role: 'student',
      email: student.email,
      name: student.name,
      department: student.department,
      hostel: student.hostel,
      registerNumber: student.registerNumber,
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      message: 'Student account registered successfully.',
      token,
      user: {
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
        role: 'student',
      },
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error during registration.',
    });
  }
};

export const registerHOD = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { name, email, phone, password, confirmPassword, department, officeRoom } = req.body;

    if (!name || !email || !password || !confirmPassword || !department) {
      res.status(400).json({
        success: false,
        message: 'Name, email, password, confirm password, and department are required.',
      });
      return;
    }

    if (password !== confirmPassword) {
      res.status(400).json({
        success: false,
        message: 'Passwords do not match.',
      });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
      return;
    }

    const existingEmail = await HOD.findOne({ email: email.toLowerCase().trim() });
    if (existingEmail) {
      res.status(409).json({
        success: false,
        message: 'An HOD account with this email address already exists.',
      });
      return;
    }

    const existingDept = await HOD.findOne({ department: department.trim() });
    if (existingDept) {
      res.status(409).json({
        success: false,
        message: `An HOD is already appointed for ${department}. Each department has one appointed HOD.`,
      });
      return;
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const hod = await HOD.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : '',
      password: hashedPassword,
      department: department.trim(),
      officeRoom: officeRoom ? officeRoom.trim() : 'Department Main Office',
      role: 'hod',
    });

    const token = generateToken({
      id: hod._id.toString(),
      role: 'hod',
      email: hod.email,
      name: hod.name,
      department: hod.department,
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      message: 'HOD account registered successfully.',
      token,
      user: {
        id: hod._id.toString(),
        name: hod.name,
        email: hod.email,
        department: hod.department,
        phone: hod.phone,
        officeRoom: hod.officeRoom,
        role: 'hod',
      },
    });
  } catch (error: any) {
    console.error('HOD registration error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error during HOD registration.',
    });
  }
};

export const registerWarden = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { name, email, phone, password, confirmPassword, hostel, block } = req.body;

    if (!name || !email || !password || !confirmPassword || !hostel) {
      res.status(400).json({
        success: false,
        message: 'Name, email, password, confirm password, and hostel name are required.',
      });
      return;
    }

    if (password !== confirmPassword) {
      res.status(400).json({
        success: false,
        message: 'Passwords do not match.',
      });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
      return;
    }

    const existingEmail = await Warden.findOne({ email: email.toLowerCase().trim() });
    if (existingEmail) {
      res.status(409).json({
        success: false,
        message: 'A Warden account with this email address already exists.',
      });
      return;
    }

    const existingHostel = await Warden.findOne({ hostel: hostel.trim() });
    if (existingHostel) {
      res.status(409).json({
        success: false,
        message: `A Warden is already appointed for ${hostel}. Each hostel has one primary Warden.`,
      });
      return;
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const warden = await Warden.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : '',
      password: hashedPassword,
      hostel: hostel.trim(),
      block: block ? block.trim() : 'Main Residential Wing',
      role: 'warden',
    });

    const token = generateToken({
      id: warden._id.toString(),
      role: 'warden',
      email: warden.email,
      name: warden.name,
      hostel: warden.hostel,
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      message: 'Warden account registered successfully.',
      token,
      user: {
        id: warden._id.toString(),
        name: warden.name,
        email: warden.email,
        hostel: warden.hostel,
        phone: warden.phone,
        block: warden.block,
        role: 'warden',
      },
    });
  } catch (error: any) {
    console.error('Warden registration error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error during Warden registration.',
    });
  }
};

export const loginStudent = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { identifier, password } = req.body; // identifier can be email or registerNumber

    if (!identifier || !password) {
      res.status(400).json({
        success: false,
        message: 'Please provide Email/Register Number and Password.',
      });
      return;
    }

    const trimmedIdentifier = identifier.trim();
    const student = await Student.findOne({
      $or: [
        { email: trimmedIdentifier.toLowerCase() },
        { registerNumber: trimmedIdentifier.toUpperCase() },
      ],
    });

    if (!student) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials. No student account found with this identifier.',
      });
      return;
    }

    const isMatch = await bcryptjs.compare(password, student.password);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials. Incorrect password.',
      });
      return;
    }

    const token = generateToken({
      id: student._id.toString(),
      role: 'student',
      email: student.email,
      name: student.name,
      department: student.department,
      hostel: student.hostel,
      registerNumber: student.registerNumber,
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: 'Student logged in successfully.',
      token,
      user: {
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
        role: 'student',
      },
    });
  } catch (error: any) {
    console.error('Student login error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error during student login.',
    });
  }
};

export const loginHOD = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Please provide HOD Email and Password.',
      });
      return;
    }

    const hod = await HOD.findOne({ email: email.trim().toLowerCase() });
    if (!hod) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials. No HOD account found for this email.',
      });
      return;
    }

    const isMatch = await bcryptjs.compare(password, hod.password);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials. Incorrect password.',
      });
      return;
    }

    const token = generateToken({
      id: hod._id.toString(),
      role: 'hod',
      email: hod.email,
      name: hod.name,
      department: hod.department,
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: 'HOD logged in successfully.',
      token,
      user: {
        id: hod._id.toString(),
        name: hod.name,
        email: hod.email,
        department: hod.department,
        phone: hod.phone,
        officeRoom: hod.officeRoom,
        role: 'hod',
      },
    });
  } catch (error: any) {
    console.error('HOD login error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error during HOD login.',
    });
  }
};

export const loginWarden = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Please provide Warden Email and Password.',
      });
      return;
    }

    const warden = await Warden.findOne({ email: email.trim().toLowerCase() });
    if (!warden) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials. No Warden account found for this email.',
      });
      return;
    }

    const isMatch = await bcryptjs.compare(password, warden.password);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials. Incorrect password.',
      });
      return;
    }

    const token = generateToken({
      id: warden._id.toString(),
      role: 'warden',
      email: warden.email,
      name: warden.name,
      hostel: warden.hostel,
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: 'Warden logged in successfully.',
      token,
      user: {
        id: warden._id.toString(),
        name: warden.name,
        email: warden.email,
        hostel: warden.hostel,
        phone: warden.phone,
        block: warden.block,
        role: 'warden',
      },
    });
  } catch (error: any) {
    console.error('Warden login error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error during Warden login.',
    });
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    const { id, role } = req.user;

    if (role === 'student') {
      const student = await Student.findById(id).select('-password');
      if (!student) {
        res.status(404).json({ success: false, message: 'Student profile not found.' });
        return;
      }
      res.status(200).json({
        success: true,
        user: {
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
          role: 'student',
        },
      });
      return;
    }

    if (role === 'hod') {
      const hod = await HOD.findById(id).select('-password');
      if (!hod) {
        res.status(404).json({ success: false, message: 'HOD profile not found.' });
        return;
      }
      res.status(200).json({
        success: true,
        user: {
          id: hod._id.toString(),
          name: hod.name,
          email: hod.email,
          department: hod.department,
          phone: hod.phone,
          officeRoom: hod.officeRoom,
          role: 'hod',
        },
      });
      return;
    }

    if (role === 'warden') {
      const warden = await Warden.findById(id).select('-password');
      if (!warden) {
        res.status(404).json({ success: false, message: 'Warden profile not found.' });
        return;
      }
      res.status(200).json({
        success: true,
        user: {
          id: warden._id.toString(),
          name: warden.name,
          email: warden.email,
          hostel: warden.hostel,
          phone: warden.phone,
          block: warden.block,
          role: 'warden',
        },
      });
      return;
    }

    res.status(400).json({ success: false, message: 'Unknown role.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const logout = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  res.clearCookie('token');
  res.status(200).json({
    success: true,
    message: 'Logged out successfully.',
  });
};
