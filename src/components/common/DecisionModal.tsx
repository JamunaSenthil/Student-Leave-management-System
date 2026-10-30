import React, { useState } from 'react';
import { CheckCircle2, XCircle, AlertCircle, X } from 'lucide-react';

interface DecisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (decision: 'Approved' | 'Rejected', reason: string) => Promise<void>;
  leaveData: any;
  userRole: 'hod' | 'warden';
}

export const DecisionModal: React.FC<DecisionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  leaveData,
  userRole,
}) => {
  const [decision, setDecision] = useState<'Approved' | 'Rejected'>('Approved');
  const [reason, setReason] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  if (!isOpen || !leaveData) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (decision === 'Rejected' && (!reason || reason.trim() === '')) {
      setError('Please provide a specific reason for rejecting this leave request.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(decision, reason);
      setReason('');
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to submit decision.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const roleTitle = userRole === 'hod' ? 'Head of Department' : 'Hostel Warden';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Official Review Decision
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {roleTitle} Authorization Panel
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 text-xs rounded-xl bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Context Summary */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Application:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">
                {leaveData.applicationId}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Student:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {leaveData.studentDetails?.name} ({leaveData.studentDetails?.registerNumber})
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Duration:</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">
                {leaveData.fromDate} to {leaveData.toDate} ({leaveData.numberOfDays} days)
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Leave Type:</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">
                {leaveData.leaveType}
              </span>
            </div>
            <div className="pt-1 text-slate-600 dark:text-slate-300">
              <span className="text-slate-500 dark:text-slate-400">Reason: </span>
              "{leaveData.reason}"
            </div>
          </div>

          {/* Decision Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Select Decision *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDecision('Approved')}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 font-medium text-sm transition-all cursor-pointer ${
                  decision === 'Approved'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-500 dark:text-emerald-300 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Approve Leave
              </button>

              <button
                type="button"
                onClick={() => setDecision('Rejected')}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 font-medium text-sm transition-all cursor-pointer ${
                  decision === 'Rejected'
                    ? 'border-rose-600 bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:border-rose-500 dark:text-rose-300 ring-2 ring-rose-500/20'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                Reject Leave
              </button>
            </div>
          </div>

          {/* Reason / Remarks */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              {decision === 'Rejected' ? 'Rejection Reason (Required) *' : 'Approval Remarks (Optional)'}
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              placeholder={
                decision === 'Rejected'
                  ? 'Specify why this leave request is being denied (e.g., upcoming exams, incomplete attendance)...'
                  : 'Add any optional instructions (e.g., submit assignments, report back before 8 PM)...'
              }
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 ${
                decision === 'Rejected'
                  ? 'border-rose-300 dark:border-rose-800 focus:ring-rose-500/20'
                  : 'border-slate-300 dark:border-slate-700 focus:ring-blue-500/20'
              }`}
              required={decision === 'Rejected'}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-5 py-2 text-sm font-semibold text-white rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2 ${
                decision === 'Approved'
                  ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/25'
                  : 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/25'
              }`}
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : decision === 'Approved' ? (
                'Confirm Approval'
              ) : (
                'Confirm Rejection'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
