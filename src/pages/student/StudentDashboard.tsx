import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { studentService } from '../../services/studentService.ts';
import { StatusBadge } from '../../components/common/StatusBadge.tsx';
import { LeaveDetailsModal } from '../../components/common/LeaveDetailsModal.tsx';
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  PlusCircle,
  ArrowRight,
  RefreshCw,
  Building,
  Home,
  UserCheck,
  Calendar,
  Eye,
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');
  const [selectedLeave, setSelectedLeave] = useState<any>(null);

  const fetchDashboard = async () => {
    try {
      setIsLoading(true);
      const res = await studentService.getDashboard();
      if (res.success) {
        setDashboardData(res.data);
      }
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (isLoading && !dashboardData) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const { student, stats, recentLeaves = [] } = dashboardData || {};

  const filteredLeaves = recentLeaves.filter((l: any) => {
    if (filter === 'All') return true;
    return l.overallStatus === filter;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Profile Bar */}
      <div className="bg-gradient-to-r from-[#003366] to-[#1565C0] rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-white/15 text-blue-100 text-xs font-semibold backdrop-blur-xs mb-2">
              Student Clearance Portal
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {student?.name}!
            </h1>
            <p className="text-xs sm:text-sm text-blue-100 mt-1">
              Track your departmental clearance, hostel permissions, and leave gate passes in real-time.
            </p>

            {/* Student metadata pills */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-4 text-xs">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-xs">
                <UserCheck className="w-3.5 h-3.5 text-blue-200" />
                <span className="font-mono">{student?.registerNumber}</span>
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-xs">
                <Building className="w-3.5 h-3.5 text-blue-200" />
                <span>{student?.department}</span>
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-xs">
                <Home className="w-3.5 h-3.5 text-blue-200" />
                <span>
                  {student?.hostel} (Room {student?.roomNumber})
                </span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/student/apply"
              className="px-5 py-3 rounded-2xl bg-white text-[#003366] font-bold text-xs sm:text-sm hover:bg-blue-50 shadow-md transition-all flex items-center gap-2 group cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-[#003366] group-hover:rotate-90 transition-transform" />
              <span>Apply for Leave</span>
            </Link>
            <button
              onClick={fetchDashboard}
              className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="Refresh Stats"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Applications */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">
              Total Applications
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {stats?.total || 0}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-[#1565C0] dark:text-blue-400 flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-amber-600 dark:text-amber-400 block mb-1">
              Pending Clearances
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400">
              {stats?.pending || 0}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Approved */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 block mb-1">
              Approved Leaves
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {stats?.approved || 0}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>

        {/* Rejected */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-rose-600 dark:text-rose-400 block mb-1">
              Rejected Requests
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-rose-600 dark:text-rose-400">
              {stats?.rejected || 0}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <XCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Recent Applications Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Recent Leave Applications
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Overview of your latest clearance submissions and approvals
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl self-start sm:self-auto">
            {(['All', 'Pending', 'Approved', 'Rejected'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  filter === tab
                    ? 'bg-white dark:bg-slate-900 text-[#003366] dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          {filteredLeaves.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                No leave records found
              </h4>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                {filter === 'All'
                  ? 'You have not submitted any leave applications yet.'
                  : `You currently have no ${filter.toLowerCase()} leave applications.`}
              </p>
              {filter === 'All' && (
                <Link
                  to="/student/apply"
                  className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#003366] hover:bg-[#1565C0] transition-colors"
                >
                  <PlusCircle className="w-4 h-4" />
                  Apply for Leave Now
                </Link>
              )}
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">Application ID</th>
                  <th className="py-3 px-4">Leave Type</th>
                  <th className="py-3 px-4">Dates & Duration</th>
                  <th className="py-3 px-4">HOD Status</th>
                  <th className="py-3 px-4">Warden Status</th>
                  <th className="py-3 px-4">Overall Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredLeaves.map((item: any) => (
                  <tr
                    key={item._id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-900 dark:text-blue-400">
                      {item.applicationId}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-800 dark:text-slate-200">
                      {item.leaveType}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-800 dark:text-slate-200 font-medium">
                        {item.fromDate} to {item.toDate}
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {item.numberOfDays} {item.numberOfDays === 1 ? 'day' : 'days'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={item.hodStatus} size="sm" />
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={item.wardenStatus} size="sm" />
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={item.overallStatus} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => setSelectedLeave(item)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors cursor-pointer"
                        title="View Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Details</span>
                      </button>
                      <Link
                        to={`/student/track/${item.applicationId}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100 transition-colors"
                        title="Live Approval Track"
                      >
                        <span>Track</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {recentLeaves.length > 0 && (
          <div className="p-4 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-200 dark:border-slate-800 text-center">
            <Link
              to="/student/leaves"
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
            >
              <span>View All Applications in History</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>

      {/* Leave Details Modal */}
      <LeaveDetailsModal
        isOpen={!!selectedLeave}
        onClose={() => setSelectedLeave(null)}
        leave={selectedLeave}
      />
    </div>
  );
};
