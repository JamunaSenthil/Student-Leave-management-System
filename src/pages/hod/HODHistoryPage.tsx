import React, { useState, useEffect } from 'react';
import { hodService } from '../../services/hodService.ts';
import { StatusBadge } from '../../components/common/StatusBadge.tsx';
import { LeaveDetailsModal } from '../../components/common/LeaveDetailsModal.tsx';
import { History, Eye, FileText, CheckCircle2, XCircle } from 'lucide-react';

export const HODHistoryPage: React.FC = () => {
  const [historyLeaves, setHistoryLeaves] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLeave, setSelectedLeave] = useState<any>(null);

  const fetchHistory = async () => {
    try {
      setIsLoading(true);
      // Fetch leaves that are not Pending (i.e. Approved or Rejected)
      const res = await hodService.getDepartmentLeaves({ limit: 50 });
      if (res.success) {
        const decided = res.data.filter((l: any) => l.hodStatus !== 'Pending');
        setHistoryLeaves(decided);
      }
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <History className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          <span>Department Clearance Audit History</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Historical log of all leave applications reviewed, approved, and rejected by the Head of Department.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="py-20 flex justify-center">
            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : historyLeaves.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-400">
            No clearance decision history recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">Application ID</th>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Decision</th>
                  <th className="py-3 px-4">Remarks / Rejection Reason</th>
                  <th className="py-3 px-4">Overall Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {historyLeaves.map((leave) => {
                  const hodAudit = leave.approvalHistory
                    ?.slice()
                    .reverse()
                    .find((h: any) => h.approverRole === 'hod');

                  return (
                    <tr
                      key={leave._id}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-900 dark:text-blue-400">
                        {leave.applicationId}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-slate-100">
                        {leave.studentDetails?.name} ({leave.studentDetails?.registerNumber})
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                        {leave.leaveType}
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={leave.hodStatus} size="sm" />
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 max-w-xs truncate">
                        {leave.hodRejectionReason || hodAudit?.remarks || 'Approved by HOD'}
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={leave.overallStatus} size="sm" />
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedLeave(leave)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Details</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <LeaveDetailsModal
        isOpen={!!selectedLeave}
        onClose={() => setSelectedLeave(null)}
        leave={selectedLeave}
      />
    </div>
  );
};
