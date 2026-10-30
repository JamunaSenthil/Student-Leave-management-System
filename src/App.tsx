import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { ThemeProvider } from './context/ThemeContext.tsx';
import { NotificationProvider } from './context/NotificationContext.tsx';
import { AppLayout } from './components/layout/AppLayout.tsx';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage.tsx';
import { RegisterPage } from './pages/auth/RegisterPage.tsx';

// Student Pages
import { StudentDashboard } from './pages/student/StudentDashboard.tsx';
import { ApplyLeavePage } from './pages/student/ApplyLeavePage.tsx';
import { MyLeavesPage } from './pages/student/MyLeavesPage.tsx';
import { TrackLeavePage } from './pages/student/TrackLeavePage.tsx';
import { StudentProfilePage } from './pages/student/StudentProfilePage.tsx';

// HOD Pages
import { HODDashboard } from './pages/hod/HODDashboard.tsx';
import { HODLeavesPage } from './pages/hod/HODLeavesPage.tsx';
import { HODStudentsPage } from './pages/hod/HODStudentsPage.tsx';
import { HODHistoryPage } from './pages/hod/HODHistoryPage.tsx';

// Warden Pages
import { WardenDashboard } from './pages/warden/WardenDashboard.tsx';
import { WardenLeavesPage } from './pages/warden/WardenLeavesPage.tsx';
import { WardenStudentsPage } from './pages/warden/WardenStudentsPage.tsx';
import { WardenHistoryPage } from './pages/warden/WardenHistoryPage.tsx';

const RootRedirect: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === 'student') return <Navigate to="/student/dashboard" replace />;
  if (user.role === 'hod') return <Navigate to="/hod/dashboard" replace />;
  if (user.role === 'warden') return <Navigate to="/warden/dashboard" replace />;

  return <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <BrowserRouter>
            <Routes>
              {/* Root Dispatcher */}
              <Route path="/" element={<RootRedirect />} />

              {/* Public Authentication Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Student Portal Routes */}
              <Route element={<AppLayout allowedRoles={['student']} />}>
                <Route path="/student/dashboard" element={<StudentDashboard />} />
                <Route path="/student/apply" element={<ApplyLeavePage />} />
                <Route path="/student/leaves" element={<MyLeavesPage />} />
                <Route path="/student/track" element={<TrackLeavePage />} />
                <Route path="/student/track/:id" element={<TrackLeavePage />} />
                <Route path="/student/profile" element={<StudentProfilePage />} />
              </Route>

              {/* HOD Portal Routes */}
              <Route element={<AppLayout allowedRoles={['hod']} />}>
                <Route path="/hod/dashboard" element={<HODDashboard />} />
                <Route path="/hod/leaves" element={<HODLeavesPage />} />
                <Route path="/hod/students" element={<HODStudentsPage />} />
                <Route path="/hod/history" element={<HODHistoryPage />} />
              </Route>

              {/* Warden Portal Routes */}
              <Route element={<AppLayout allowedRoles={['warden']} />}>
                <Route path="/warden/dashboard" element={<WardenDashboard />} />
                <Route path="/warden/leaves" element={<WardenLeavesPage />} />
                <Route path="/warden/students" element={<WardenStudentsPage />} />
                <Route path="/warden/history" element={<WardenHistoryPage />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<RootRedirect />} />
            </Routes>
          </BrowserRouter>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
