import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from '../../context/AuthContext.tsx';
import { authService } from '../../services/authService.ts';
import {
  GraduationCap,
  Building,
  Home,
  Lock,
  Mail,
  AlertCircle,
  KeyRound,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isExpired = new URLSearchParams(location.search).get('expired') === 'true';

  const demoAccounts = {
    student: {
      label: 'Student (Rahul Verma - CSE)',
      id: '2023CSE042',
      pass: 'password123',
    },
    hod: {
      label: 'HOD (Dr. Robert Vance - CSE)',
      id: 'hod.cse@campus.edu',
      pass: 'password123',
    },
    warden: {
      label: 'Warden (Mr. Michael Turner - Kaveri Hostel)',
      id: 'warden.kaveri@campus.edu',
      pass: 'password123',
    },
  };

  const handleQuickFill = (role: UserRole) => {
    setSelectedRole(role);
    setIdentifier(demoAccounts[role].id);
    setPassword(demoAccounts[role].pass);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!identifier || !password) {
      setError('Please provide your login credentials.');
      return;
    }

    try {
      setIsLoading(true);
      let res;
      if (selectedRole === 'student') {
        res = await authService.loginStudent(identifier, password);
      } else if (selectedRole === 'hod') {
        res = await authService.loginHOD(identifier, password);
      } else {
        res = await authService.loginWarden(identifier, password);
      }

      if (res.success && res.token && res.user) {
        login(res.token, res.user);
        if (selectedRole === 'student') {
          navigate('/student/dashboard');
        } else if (selectedRole === 'hod') {
          navigate('/hod/dashboard');
        } else {
          navigate('/warden/dashboard');
        }
      } else {
        setError(res.message || 'Login failed.');
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || err.message || 'Authentication failed. Please verify credentials.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#003366] text-white shadow-lg mb-3">
          <GraduationCap className="w-8 h-8 text-blue-200" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#003366] dark:text-blue-400">
          Student Leave Management System
        </h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Digital Clearance, Department Approvals & Hostel Gate Pass Portal
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-900 py-8 px-6 sm:px-10 shadow-xl rounded-3xl border border-slate-200 dark:border-slate-800">
          {/* Role Selection Tabs */}
          <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => {
                setSelectedRole('student');
                setError('');
              }}
              className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedRole === 'student'
                  ? 'bg-white dark:bg-slate-900 text-[#003366] dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-4 h-4 shrink-0" />
              <span>Student</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedRole('hod');
                setError('');
              }}
              className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedRole === 'hod'
                  ? 'bg-white dark:bg-slate-900 text-[#003366] dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Building className="w-4 h-4 shrink-0" />
              <span>HOD</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedRole('warden');
                setError('');
              }}
              className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedRole === 'warden'
                  ? 'bg-white dark:bg-slate-900 text-[#003366] dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Home className="w-4 h-4 shrink-0" />
              <span>Warden</span>
            </button>
          </div>

          {isExpired && (
            <div className="mb-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-xs flex items-center gap-2 border border-amber-200 dark:border-amber-800">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Your session has expired. Please log in again.</span>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 text-xs flex items-center gap-2 border border-rose-200 dark:border-rose-800">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Demo Fill Shortcut */}
          <div className="mb-5 p-3 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/70 dark:border-blue-900/50">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-blue-900 dark:text-blue-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                Demo Credentials:
              </span>
              <button
                type="button"
                onClick={() => handleQuickFill(selectedRole)}
                className="text-[11px] font-bold text-blue-700 dark:text-blue-400 hover:underline cursor-pointer"
              >
                1-Click Autofill
              </button>
            </div>
            <div className="text-[11px] text-slate-600 dark:text-slate-300 font-mono">
              {selectedRole === 'student' && 'ID: 2023CSE042 | Pass: password123'}
              {selectedRole === 'hod' && 'Email: hod.cse@campus.edu | Pass: password123'}
              {selectedRole === 'warden' && 'Email: warden.kaveri@campus.edu | Pass: password123'}
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                {selectedRole === 'student' ? 'Register Number or Email' : 'Institutional Email Address'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  {selectedRole === 'student' ? (
                    <KeyRound className="w-4 h-4" />
                  ) : (
                    <Mail className="w-4 h-4" />
                  )}
                </div>
                <input
                  type={selectedRole === 'student' ? 'text' : 'email'}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={
                    selectedRole === 'student'
                      ? 'e.g. 2023CSE042 or rahul.cse@student.edu'
                      : selectedRole === 'hod'
                      ? 'hod.cse@campus.edu'
                      : 'warden.kaveri@campus.edu'
                  }
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl text-white font-semibold text-sm bg-[#003366] hover:bg-[#1565C0] shadow-md shadow-blue-900/20 transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In as {selectedRole.toUpperCase()}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Universal Registration Link for all roles */}
          <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800 text-center">
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                Register as Student, HOD, or Warden
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
