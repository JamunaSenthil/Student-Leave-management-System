import React from 'react';
import {
  X,
  Calendar,
  MapPin,
  Phone,
  User,
  Building,
  Home,
  Clock,
  FileText,
  AlertTriangle,
  History,
  CheckCircle,
  Printer,
} from 'lucide-react';
import { StatusBadge } from './StatusBadge.tsx';
import { LeavePrintSlipModal } from './LeavePrintSlipModal.tsx';

interface LeaveDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  leave: any;
  onOpenDecision?: (leave: any) => void;
  canReview?: boolean;
}

export const LeaveDetailsModal: React.FC<LeaveDetailsModalProps> = ({
  isOpen,
  onClose,
  leave,
  onOpenDecision,
  canReview = false,
}) => {
  const [showPrintModal, setShowPrintModal] = React.useState(false);

  if (!isOpen || !leave) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-blue-900 dark:text-blue-400">
                {leave.applicationId}
              </span>
              <StatusBadge status={leave.overallStatus} />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Applied on {new Date(leave.appliedAt).toLocaleDateString()} at{' '}
              {new Date(leave.appliedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Student Profile Card */}
          <div className="bg-blue-50/40 dark:bg-blue-950/20 rounded-xl p-4 border border-blue-100 dark:border-blue-900/40">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 dark:text-blue-300 mb-3 flex items-center gap-1.5">
              <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Applicant Profile
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-slate-500 dark:text-slate-400 block">Student Name:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {leave.studentDetails?.name}
                </span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block">Register Number:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">
                  {leave.studentDetails?.registerNumber}
                </span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block">Department:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {leave.studentDetails?.department}
                </span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block">Year & Section:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {leave.studentDetails?.year} ({leave.studentDetails?.section})
                </span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block">Hostel & Room:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {leave.studentDetails?.hostel} (Rm {leave.studentDetails?.roomNumber})
                </span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block">Student Contact:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {leave.studentDetails?.phone}
                </span>
              </div>
            </div>
          </div>

          {/* Leave Schedule & Reason */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-600 dark:text-slate-300" />
              Leave Particulars
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
              <div>
                <span className="text-slate-500 dark:text-slate-400 block mb-1">Leave Category:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                  {leave.leaveType}
                </span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block mb-1">Total Duration:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                  {leave.numberOfDays} {leave.numberOfDays === 1 ? 'Day' : 'Days'} ({leave.fromDate} to{' '}
                  {leave.toDate})
                </span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-slate-500 dark:text-slate-400 block mb-1">Reason for Leave:</span>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700">
                  {leave.reason}
                </p>
              </div>
              <div className="sm:col-span-2">
                <span className="text-slate-500 dark:text-slate-400 block mb-1">
                  Destination / Travel Address:
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  {leave.destination}
                </p>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block mb-1">Parent Contact:</span>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  {leave.parentContact}
                </p>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block mb-1">
                  Emergency Contact:
                </span>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  {leave.emergencyContact || 'Not specified'}
                </p>
              </div>
            </div>
          </div>

          {/* Department & Hostel Approvals Status */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-slate-600 dark:text-slate-300" />
              Two-Tier Approval Status
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* HOD Status Card */}
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    HOD Review
                  </span>
                  <StatusBadge status={leave.hodStatus} size="sm" />
                </div>
                {leave.hodRejectionReason ? (
                  <p className="text-xs text-rose-600 dark:text-rose-400 italic">
                    Reason: {leave.hodRejectionReason}
                  </p>
                ) : (
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {leave.hodStatus === 'Pending'
                      ? 'Awaiting departmental review'
                      : 'Cleared by Head of Department'}
                  </p>
                )}
              </div>

              {/* Warden Status Card */}
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Home className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    Hostel Warden Review
                  </span>
                  <StatusBadge status={leave.wardenStatus} size="sm" />
                </div>
                {leave.wardenRejectionReason ? (
                  <p className="text-xs text-rose-600 dark:text-rose-400 italic">
                    Reason: {leave.wardenRejectionReason}
                  </p>
                ) : (
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {leave.wardenStatus === 'Pending'
                      ? 'Awaiting hostel residential clearance'
                      : 'Cleared by Hostel Warden'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Audit History Log */}
          {leave.approvalHistory && leave.approvalHistory.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                <History className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                Audit Trail & History
              </h4>
              <div className="space-y-2">
                {leave.approvalHistory.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-start justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs"
                  >
                    <div>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {item.approverName} ({item.approverRole.toUpperCase()})
                      </span>
                      <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                        {item.remarks || item.action}
                      </p>
                    </div>
                    <div className="text-right">
                      <StatusBadge status={item.action} size="sm" />
                      <span className="block text-[10px] text-slate-400 mt-1">
                        {new Date(item.timestamp).toLocaleString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => setShowPrintModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-blue-600" />
              <span>Download / Print Form</span>
            </button>
          </div>

          {canReview && onOpenDecision && (
            <button
              onClick={() => {
                onClose();
                onOpenDecision(leave);
              }}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
            >
              Take Action / Review
            </button>
          )}
        </div>
      </div>

      {/* Official Leave Print Slip Modal */}
      <LeavePrintSlipModal
        isOpen={showPrintModal}
        onClose={() => setShowPrintModal(false)}
        leave={leave}
      />
    </div>
  );
};
