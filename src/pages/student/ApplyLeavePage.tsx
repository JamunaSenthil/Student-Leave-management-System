import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { leaveService, ApplyLeavePayload } from '../../services/leaveService.ts';
import { useAuth } from '../../context/AuthContext.tsx';
import {
  FilePlus2,
  Calendar,
  MapPin,
  Phone,
  FileText,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Info,
  Building,
  Home,
  Upload,
} from 'lucide-react';

const LEAVE_TYPES = ['Home leave', 'Medical leave', 'Personal leave', 'Other'] as const;

export const ApplyLeavePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const [formData, setFormData] = useState<ApplyLeavePayload>({
    leaveType: 'Home leave',
    fromDate: today,
    toDate: tomorrow,
    reason: '',
    destination: '',
    parentContact: '',
    emergencyContact: '',
    supportingDocument: '',
  });

  const [daysCount, setDaysCount] = useState<number>(2);
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Auto calculate duration in days
  useEffect(() => {
    if (formData.fromDate && formData.toDate) {
      const start = new Date(formData.fromDate);
      const end = new Date(formData.toDate);
      if (start <= end) {
        const diffTime = end.getTime() - start.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        setDaysCount(diffDays);
      } else {
        setDaysCount(0);
      }
    }
  }, [formData.fromDate, formData.toDate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must not exceed 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          supportingDocument: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validations
    if (!formData.fromDate || !formData.toDate) {
      setError('Please specify both From Date and To Date.');
      return;
    }

    if (new Date(formData.fromDate) > new Date(formData.toDate)) {
      setError('From Date cannot be later than To Date.');
      return;
    }

    if (!formData.reason.trim() || formData.reason.trim().length < 10) {
      setError('Please provide a descriptive reason for leave (minimum 10 characters).');
      return;
    }

    if (!formData.destination.trim()) {
      setError('Destination or travel address is mandatory.');
      return;
    }

    if (!formData.parentContact.trim()) {
      setError('Parent or guardian contact number is mandatory.');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await leaveService.applyLeave(formData);
      if (res.success && res.data) {
        navigate(`/student/track/${res.data.applicationId}?applied=true`);
      } else {
        setError(res.message || 'Submission failed.');
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || err.message || 'Error occurred while submitting leave request.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
          <FilePlus2 className="w-6 h-6 text-[#1565C0] dark:text-blue-400" />
          Apply for Student Outpass / Leave
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Complete the form below. Once submitted, your application will route directly to your Head of Department ({user?.department}) and Hostel Warden ({user?.hostel}).
        </p>
      </div>

      {/* Info notice banner */}
      <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40 text-xs text-blue-900 dark:text-blue-200 flex items-start gap-3">
        <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold block mb-0.5">Clearance Policy Guideline</span>
          Approval requires dual authorization: Department clearance by your HOD followed by residential gate clearance by your Hostel Warden.
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-300 flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6">
        {/* Row 1: Leave Type & Duration Indicator */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Leave Category *
            </label>
            <select
              name="leaveType"
              value={formData.leaveType}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {LEAVE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Calculated Duration
            </label>
            <div className="px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-blue-900 dark:text-blue-300 flex items-center justify-between">
              <span>{daysCount > 0 ? `${daysCount} ${daysCount === 1 ? 'Day' : 'Days'}` : 'Invalid Dates'}</span>
              <Calendar className="w-4 h-4 text-slate-400" />
            </div>
          </div>
        </div>

        {/* Row 2: Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              From Date (Leaving Campus) *
            </label>
            <input
              type="date"
              name="fromDate"
              value={formData.fromDate}
              onChange={handleChange}
              min={today}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              To Date (Returning to Hostel) *
            </label>
            <input
              type="date"
              name="toDate"
              value={formData.toDate}
              onChange={handleChange}
              min={formData.fromDate || today}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>

        {/* Row 3: Reason */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Detailed Reason for Leave *
          </label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            rows={3}
            placeholder="Explain clearly the purpose of leave (e.g., attending sister's marriage, doctor appointment, academic competition)..."
            required
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        {/* Row 4: Destination */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Destination / Travel Address *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <MapPin className="w-4 h-4" />
            </div>
            <input
              type="text"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              placeholder="e.g. 45 Green Avenue, Indiranagar, Bengaluru, Karnataka"
              required
              className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>

        {/* Row 5: Contacts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Parent / Guardian Contact Number *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Phone className="w-4 h-4" />
              </div>
              <input
                type="tel"
                name="parentContact"
                value={formData.parentContact}
                onChange={handleChange}
                placeholder="+91 9845012345"
                required
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Emergency Contact (Optional)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Phone className="w-4 h-4" />
              </div>
              <input
                type="tel"
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleChange}
                placeholder="+91 9845012346"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>
        </div>

        {/* Row 6: Supporting document */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Supporting Document / Medical Certificate (Optional)
          </label>
          <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-4 text-center hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
            <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
            <div className="text-xs text-slate-600 dark:text-slate-300">
              <label className="text-blue-600 dark:text-blue-400 font-semibold cursor-pointer hover:underline">
                <span>Upload a document or photo</span>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  accept=".pdf,image/*"
                  className="sr-only"
                />
              </label>
              <span className="text-slate-400 ml-1">or drag and drop</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">PDF, PNG, JPG up to 5MB</p>
            {formData.supportingDocument && (
              <span className="inline-block mt-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                Document attached successfully!
              </span>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/student/dashboard')}
            className="px-5 py-2.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || daysCount <= 0}
            className="px-6 py-2.5 rounded-xl text-white font-semibold text-xs bg-[#003366] hover:bg-[#1565C0] shadow-md shadow-blue-900/20 transition-all cursor-pointer flex items-center gap-2"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Submit Leave Application</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
