import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import { connectDB } from './src/server/config/db.ts';
import { seedInitialDatabase } from './src/server/utils/seedData.ts';

import authRoutes from './src/server/routes/authRoutes.ts';
import studentRoutes from './src/server/routes/studentRoutes.ts';
import leaveRoutes from './src/server/routes/leaveRoutes.ts';
import hodRoutes from './src/server/routes/hodRoutes.ts';
import wardenRoutes from './src/server/routes/wardenRoutes.ts';
import notificationRoutes from './src/server/routes/notificationRoutes.ts';

import { Student } from './src/server/models/Student.ts';
import { HOD } from './src/server/models/HOD.ts';
import { Warden } from './src/server/models/Warden.ts';
import { Leave } from './src/server/models/Leave.ts';
import { Notification } from './src/server/models/Notification.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Security and middleware
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// REST API routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/hod', hodRoutes);
app.use('/api/warden', wardenRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    system: 'CampusLeave - Student Leave Management System',
    timestamp: new Date().toISOString(),
  });
});

// Demo database reset endpoint (safe for development demo)
app.post('/api/seed/reset', async (req, res) => {
  try {
    await Student.deleteMany({});
    await HOD.deleteMany({});
    await Warden.deleteMany({});
    await Leave.deleteMany({});
    await Notification.deleteMany({});
    await seedInitialDatabase();
    res.json({ success: true, message: 'Database reset and re-seeded with demo records.' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Start Server & mount Vite
async function startServer() {
  try {
    await connectDB();
    await seedInitialDatabase();

    const isProduction = process.env.NODE_ENV === 'production';

    if (!isProduction) {
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
      console.log('Vite development middleware mounted successfully.');
    } else {
      const distPath = path.resolve(__dirname, 'dist');
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
      console.log('Production static build handler mounted.');
    }

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`=======================================================`);
      console.log(` Student Leave Management System Running on Port ${PORT}`);
      console.log(` Mode: ${isProduction ? 'Production' : 'Development'}`);
      console.log(` Base URL: http://0.0.0.0:${PORT}`);
      console.log(`=======================================================`);
    });
  } catch (error) {
    console.error('Failed to initialize server:', error);
    process.exit(1);
  }
}

startServer();
