import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { wardenService } from '../../services/wardenService.ts';
import { StatusBadge } from '../../components/common/StatusBadge.tsx';
import { LeaveDetailsModal } from '../../components/common/LeaveDetailsModal.tsx';
import { DecisionModal } from '../../components/common/DecisionModal.tsx';
import {
  Home,
  Users,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  RefreshCw,
  Eye,
  CheckSquare,
  ShieldCheck,
} from 'lucide-react';

export const WardenDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLeave, setSelectedLeave] = useState<any>(null);
  const [decisionLeave, setDecisionLeave] = useState<any>(null);

  const fetchDashboard = async () => {
    try {
      setIsLoading(true);
      const res = await wardenService.getDashboard();
      if (res.success) {
        setDashboardData(res.data);
      }
    } catch (err) {
      console.error('Failed to load Warden dashboard:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleDecisionSubmit = async (decision: 'Approved' | 'Rejected', reason: string) => {
    if (!decisionLeave) return;
    await wardenService.decideLeave(decisionLeave._id || decisionLeave.applicationId, decision, reason);
    setDecisionLeave(null);
    fetchDashboard();
  };

  if (isLoading && !dashboardData) {
    return (
      <div className="py-20 flex justify-center">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const { warden, stats, recentRequests = [] } = dashboardData || {};

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#003366] to-[#E65100] rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-white/15 text-amber-100 text-xs font-semibold backdrop-blur-xs mb-2">
              Residential Warden Clearance Portal
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {warden?.name}
            </h1>
            <p className="text-xs sm:text-sm text-amber-100 mt-1">
              Hostel Warden • {warden?.hostel}
            </p>
            <div className="mt-2 text-xs text-amber-200">
              Assigned: {warden?.block || 'Main Residential Wing'}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/warden/leaves?status=Pending"
              className="px-5 py-3 rounded-2xl bg-white text-[#E65100] font-bold text-xs sm:text-sm hover:bg-amber-50 shadow-md transition-all flex items-center gap-2 group cursor-pointer"
            >
              <CheckSquare className="w-4 h-4 text-[#E65100]" />
              <span>Pending Reviews ({stats?.pendingApprovals || 0})</span>
            </Link>
            <button
              onClick={fetchDashboard}
              className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Hostel Students */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">
              Hostel Residents
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {stats?.totalStudents || 0}
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Home className="w-5 h-5" />
          </div>
        </div>

        {/* Total Leaves */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">
              Total Requests
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {stats?.totalLeaves || 0}
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        {/* Pending Warden */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-amber-600 dark:text-amber-400 block mb-1">
              Pending Clearance
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400">
              {stats?.pendingApprovals || 0}
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* Approved by Warden */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 block mb-1">
              Gate Passes Issued
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {stats?.approvedRequests || 0}
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        {/* Rejected by Warden */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-rose-600 dark:text-rose-400 block mb-1">
              Denied Passes
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-rose-600 dark:text-rose-400">
              {stats?.rejectedRequests || 0}
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <XCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Recent Requests Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Hostel Resident Leave Requests
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Submissions from students residing in {warden?.hostel}
            </p>
          </div>

          <Link
            to="/warden/leaves"
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          {recentRequests.length === 0 ? (
            <div className="py-16 text-center text-xs text-slate-400">
              No leave requests currently logged in your assigned hostel.
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">Application ID</th>
                  <th className="py-3 px-4">Student & Room</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Dates</th>
                  <th className="py-3 px-4">HOD Status</th>
                  <th className="py-3 px-4">Warden Status</th>
                  <th className="py-3 px-4">Overall Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentRequests.map((leave: any) => (
                  <tr
                    key={leave._id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-900 dark:text-blue-400">
                      {leave.applicationId}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 dark:text-slate-100">
                        {leave.studentDetails?.name}
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">
                        Room {leave.studentDetails?.roomNumber} • {leave.studentDetails?.registerNumber}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-800 dark:text-slate-200">
                      {leave.leaveType}
                    </td>
                    <td className="py-3.5 px-4">
                      <div>
                        {leave.fromDate} to {leave.toDate}
                      </div>
                      <span className="text-[11px] text-slate-400">{leave.numberOfDays} days</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={leave.hodStatus} size="sm" />
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={leave.wardenStatus} size="sm" />
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={leave.overallStatus} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => setSelectedLeave(leave)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Details</span>
                      </button>

                      {leave.wardenStatus === 'Pending' && (
                        <button
                          onClick={() => setDecisionLeave(leave)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100 transition-colors font-semibold cursor-pointer"
                        >
                          <CheckSquare className="w-3.5 h-3.5" />
                          <span>Review</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Leave Details Modal */}
      <LeaveDetailsModal
        isOpen={!!selectedLeave}
        onClose={() => setSelectedLeave(null)}
        leave={selectedLeave}
        canReview={selectedLeave?.wardenStatus === 'Pending'}
        onOpenDecision={(l) => setDecisionLeave(l)}
      />

      {/* Decision Modal */}
      <DecisionModal
        isOpen={!!decisionLeave}
        onClose={() => setDecisionLeave(null)}
        onSubmit={handleDecisionSubmit}
        leaveData={decisionLeave}
        userRole="warden"
      />
    </div>
  );
};
