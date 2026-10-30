import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { leaveService } from '../../services/leaveService.ts';
import { StatusBadge } from '../../components/common/StatusBadge.tsx';
import { ApprovalTimeline } from '../../components/common/ApprovalTimeline.tsx';
import { LeavePrintSlipModal } from '../../components/common/LeavePrintSlipModal.tsx';
import {
  Search,
  CheckCircle2,
  AlertCircle,
  FileText,
  Printer,
  ShieldCheck,
  Building,
  Home,
  User,
  MapPin,
  Calendar,
  Phone,
  RefreshCw,
  Download,
} from 'lucide-react';

export const TrackLeavePage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const isNewlyApplied = new URLSearchParams(location.search).get('applied') === 'true';

  const [inputAppId, setInputAppId] = useState(id || '');
  const [trackData, setTrackData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPrintModal, setShowPrintModal] = useState(false);

  const fetchTrackDetails = async (appId: string) => {
    if (!appId || !appId.trim()) return;
    try {
      setIsLoading(true);
      setError('');
      const res = await leaveService.trackLeave(appId.trim());
      if (res.success && res.data) {
        setTrackData(res.data);
      } else {
        setError(res.message || 'Unable to retrieve tracking records.');
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || err.message || 'Leave application not found or unauthorized.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      setInputAppId(id);
      fetchTrackDetails(id);
    }
  }, [id]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputAppId.trim()) {
      navigate(`/student/track/${inputAppId.trim()}`);
      fetchTrackDetails(inputAppId.trim());
    }
  };

  const leave = trackData?.leave;
  const timeline = trackData?.timeline || [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Leave Clearance Status & Live Tracking
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Monitor multi-tier department and hostel review progress in real-time.
        </p>
      </div>

      {/* Newly applied alert */}
      {isNewlyApplied && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div>
              <span className="font-bold block">Application Submitted Successfully!</span>
              Your leave request is now logged and awaiting official departmental verification.
            </div>
          </div>
        </div>
      )}

      {/* Search Bar for tracking */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={inputAppId}
              onChange={(e) => setInputAppId(e.target.value)}
              placeholder="Enter Application ID (e.g. LV-2026-001)..."
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 uppercase font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#003366] hover:bg-[#1565C0] shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <span>Track Progress</span>
            )}
          </button>
        </form>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Detailed Tracking View */}
      {leave && (
        <div className="space-y-6">
          {/* Main Status & Application Summary Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800 gap-4">
              <div>
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block">
                  Application Identifier
                </span>
                <span className="text-xl sm:text-2xl font-extrabold text-[#003366] dark:text-blue-400 font-mono">
                  {leave.applicationId}
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Applied on {new Date(leave.appliedAt).toLocaleDateString()}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setShowPrintModal(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors shadow-xs cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Download / Print Form</span>
                </button>

                <div className="text-right">
                  <span className="text-[11px] text-slate-400 block mb-1">Final Decision</span>
                  <StatusBadge status={leave.overallStatus} size="lg" />
                </div>
              </div>
            </div>

            {/* Visual Approval Timeline */}
            <div className="py-6 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                Clearance Workflow Pipeline
              </h3>
              <ApprovalTimeline timeline={timeline} currentOverallStatus={leave.overallStatus} />
            </div>

            {/* Leave Details Grid */}
            <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                <span className="text-slate-500 dark:text-slate-400 block mb-1">Leave Category</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                  {leave.leaveType}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                <span className="text-slate-500 dark:text-slate-400 block mb-1">Schedule</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                  {leave.fromDate} to {leave.toDate}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                <span className="text-slate-500 dark:text-slate-400 block mb-1">Duration</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                  {leave.numberOfDays} {leave.numberOfDays === 1 ? 'Day' : 'Days'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                <span className="text-slate-500 dark:text-slate-400 block mb-1">Hostel Room</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                  {leave.studentDetails?.roomNumber} ({leave.studentDetails?.hostel})
                </span>
              </div>
            </div>

            {/* Reason & Destination */}
            <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
              <div>
                <span className="text-slate-500 dark:text-slate-400 font-semibold">Reason: </span>
                <span className="text-slate-800 dark:text-slate-200">{leave.reason}</span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 font-semibold">Travel Destination: </span>
                <span className="text-slate-800 dark:text-slate-200">{leave.destination}</span>
              </div>
              <div className="flex gap-4">
                <span>
                  <span className="text-slate-500 dark:text-slate-400 font-semibold">Parent Contact: </span>
                  <span className="text-slate-800 dark:text-slate-200 font-mono">{leave.parentContact}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Authorized Gate Pass (Shown if fully approved) */}
          {leave.overallStatus === 'Approved' && (
            <div className="bg-gradient-to-br from-emerald-900 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-700/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <ShieldCheck className="w-48 h-48" />
              </div>

              <div className="relative z-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-700/40 pb-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base tracking-tight text-white">
                        Official Campus Gate Pass
                      </h3>
                      <p className="text-xs text-emerald-200 font-mono">
                        PASS NO: GP-{leave.applicationId.replace('LV-', '')}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors self-start sm:self-auto cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print / Save Pass</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-emerald-300/80 block">Student Name</span>
                    <span className="font-bold text-white text-sm">
                      {leave.studentDetails?.name}
                    </span>
                  </div>
                  <div>
                    <span className="text-emerald-300/80 block">Register Number</span>
                    <span className="font-bold text-white font-mono text-sm">
                      {leave.studentDetails?.registerNumber}
                    </span>
                  </div>
                  <div>
                    <span className="text-emerald-300/80 block">Valid Departure</span>
                    <span className="font-bold text-white text-sm">{leave.fromDate}</span>
                  </div>
                  <div>
                    <span className="text-emerald-300/80 block">Mandatory Return</span>
                    <span className="font-bold text-white text-sm">{leave.toDate} (by 8 PM)</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-emerald-800/60 flex items-center justify-between text-[11px] text-emerald-300">
                  <span>Authorized by Head of Dept & Hostel Warden</span>
                  <span className="font-mono">Security Check: VERIFIED</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Official Leave Print Slip Modal */}
      <LeavePrintSlipModal
        isOpen={showPrintModal}
        onClose={() => setShowPrintModal(false)}
        leave={leave}
      />
    </div>
  );
};
