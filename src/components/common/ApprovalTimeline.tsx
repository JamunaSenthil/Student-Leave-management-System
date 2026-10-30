import React from 'react';
import { CheckCircle2, Clock, XCircle, Send, ShieldCheck, Building2, Award } from 'lucide-react';
import { StatusBadge } from './StatusBadge.tsx';

interface TimelineStep {
  step: number;
  title: string;
  description: string;
  status: 'Completed' | 'Pending' | 'Approved' | 'Rejected' | string;
  timestamp?: string | Date;
  remarks?: string;
}

interface ApprovalTimelineProps {
  timeline: TimelineStep[];
  currentOverallStatus: 'Pending' | 'Approved' | 'Rejected' | string;
}

export const ApprovalTimeline: React.FC<ApprovalTimelineProps> = ({
  timeline,
  currentOverallStatus,
}) => {
  const getStepIcon = (index: number, status: string) => {
    const s = status.toLowerCase();
    if (s === 'approved' || s === 'completed') {
      return <CheckCircle2 className="w-5 h-5 text-white" />;
    }
    if (s === 'rejected') {
      return <XCircle className="w-5 h-5 text-white" />;
    }
    if (index === 0) return <Send className="w-4 h-4 text-white" />;
    if (index === 1) return <Building2 className="w-4 h-4 text-white" />;
    if (index === 2) return <ShieldCheck className="w-4 h-4 text-white" />;
    return <Award className="w-4 h-4 text-white" />;
  };

  const getStepBackground = (status: string) => {
    const s = status.toLowerCase();
    if (s === 'approved' || s === 'completed') {
      return 'bg-emerald-600 border-emerald-600 shadow-emerald-200 dark:shadow-emerald-950';
    }
    if (s === 'rejected') {
      return 'bg-rose-600 border-rose-600 shadow-rose-200 dark:shadow-rose-950';
    }
    return 'bg-amber-500 border-amber-500 shadow-amber-200 dark:shadow-amber-950 animate-pulse';
  };

  return (
    <div className="w-full py-4">
      <div className="relative">
        {/* Continuous connector line */}
        <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-slate-200 dark:bg-slate-700 md:hidden" />
        
        {/* Desktop horizontal timeline */}
        <div className="hidden md:grid md:grid-cols-4 gap-4 relative">
          <div className="absolute top-5 left-12 right-12 h-1 bg-slate-200 dark:bg-slate-700 -z-0" />
          
          {timeline.map((item, idx) => {
            const isApproved = item.status === 'Approved' || item.status === 'Completed';
            const isRejected = item.status === 'Rejected';
            const isPending = item.status === 'Pending';

            return (
              <div key={item.step} className="flex flex-col items-center text-center relative z-10 px-2">
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center border-2 shadow-md transition-all ${getStepBackground(
                    item.status
                  )}`}
                >
                  {getStepIcon(idx, item.status)}
                </div>

                <div className="mt-3 w-full">
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Stage {item.step}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                    {item.title}
                  </h4>
                  <div className="mt-1">
                    <StatusBadge status={item.status} size="sm" />
                  </div>
                  <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 line-clamp-3">
                    {item.description}
                  </p>
                  {item.timestamp && (
                    <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
                      {new Date(item.timestamp).toLocaleString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  )}
                  {item.remarks && (
                    <div className="mt-2 p-1.5 rounded bg-slate-100 dark:bg-slate-800 text-[11px] italic text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      "{item.remarks}"
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile vertical timeline */}
        <div className="md:hidden space-y-6 relative">
          {timeline.map((item, idx) => (
            <div key={item.step} className="flex items-start gap-4 relative z-10">
              <div
                className={`w-10 h-10 rounded-full shrink-0 flex items-center justify-center border-2 shadow-sm ${getStepBackground(
                  item.status
                )}`}
              >
                {getStepIcon(idx, item.status)}
              </div>
              <div className="flex-1 bg-white dark:bg-slate-800/80 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
                    Stage {item.step}: {item.title}
                  </span>
                  <StatusBadge status={item.status} size="sm" />
                </div>
                <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-300">
                  {item.description}
                </p>
                {item.timestamp && (
                  <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
                    {new Date(item.timestamp).toLocaleString()}
                  </p>
                )}
                {item.remarks && (
                  <div className="mt-2 p-2 rounded bg-slate-50 dark:bg-slate-900 text-xs italic text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
                    Remarks: "{item.remarks}"
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
