import React, { useState } from 'react';
import { X, Printer, Download, CheckCircle2, FileText, ArrowDownToLine } from 'lucide-react';

interface LeavePrintSlipModalProps {
  isOpen: boolean;
  onClose: () => void;
  leave: any;
}

export const LeavePrintSlipModal: React.FC<LeavePrintSlipModalProps> = ({
  isOpen,
  onClose,
  leave,
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen || !leave) return null;

  // Build the complete, self-contained standalone HTML document
  const generateSlipHtml = () => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Leave_Slip_${leave.applicationId}</title>
  <style>
    @page { size: A4; margin: 15mm; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #111827; background: #ffffff; margin: 0; padding: 20px; font-size: 13px; line-height: 1.5; }
    .header { text-align: center; border-bottom: 2px solid #003366; padding-bottom: 12px; margin-bottom: 15px; }
    .college-name { font-size: 18px; font-weight: 800; color: #003366; text-transform: uppercase; letter-spacing: 0.5px; }
    .college-sub { font-size: 11px; font-weight: 600; color: #4b5563; text-transform: uppercase; letter-spacing: 1px; margin-top: 3px; }
    .badge-title { display: inline-block; margin-top: 10px; padding: 4px 16px; background: #f0f4f8; border: 1px solid #003366; font-weight: 700; font-size: 12px; text-transform: uppercase; color: #003366; border-radius: 4px; }
    .ref-row { display: flex; justify-content: space-between; padding-bottom: 8px; margin-bottom: 12px; border-bottom: 1px solid #e5e7eb; font-size: 12px; }
    .ref-val { font-weight: 700; color: #003366; font-family: monospace; }
    .section-title { font-weight: 700; font-size: 11px; text-transform: uppercase; background: #f3f4f6; padding: 6px 10px; margin: 14px 0 8px 0; border-left: 4px solid #003366; letter-spacing: 0.5px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 10px; font-size: 12px; }
    th, td { border: 1px solid #d1d5db; padding: 7px 10px; text-align: left; }
    th { background: #f9fafb; font-weight: 600; width: 22%; color: #374151; }
    td { color: #111827; }
    .sign-grid { display: flex; gap: 15px; margin-top: 10px; }
    .sign-box { flex: 1; border: 1px solid #d1d5db; border-radius: 4px; padding: 10px; background: #fafafa; }
    .sign-title { font-weight: 700; font-size: 11px; text-transform: uppercase; color: #1f2937; margin-bottom: 4px; }
    .sign-line { border-bottom: 1px dashed #9ca3af; margin-top: 35px; margin-bottom: 5px; }
    .sign-footer { font-size: 10px; text-align: center; color: #6b7280; }
    .gate-grid { display: flex; gap: 10px; margin-top: 6px; }
    .gate-cell { flex: 1; border: 1px dashed #9ca3af; padding: 10px; height: 50px; display: flex; flex-direction: column; justify-content: space-between; text-align: center; font-size: 10px; }
    .footer-note { margin-top: 20px; padding-top: 8px; border-top: 1px solid #e5e7eb; display: flex; justify-content: space-between; font-size: 10px; color: #9ca3af; }
    @media print {
      body { padding: 0; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="college-name">CAMPUS INSTITUTE OF HIGHER EDUCATION</div>
    <div class="college-sub">Office of Student Affairs & Residential Hostels</div>
    <div class="badge-title">OFFICIAL STUDENT LEAVE APPLICATION & OUTPASS SLIP</div>
  </div>

  <div class="ref-row">
    <div>APPLICATION REF: <span class="ref-val">${leave.applicationId}</span></div>
    <div>DATE: <strong>${new Date(leave.appliedAt).toLocaleDateString()}</strong></div>
    <div>STATUS: <strong>${leave.overallStatus.toUpperCase()}</strong></div>
  </div>

  <div class="section-title">1. Student Identification</div>
  <table>
    <tr>
      <th>Student Name</th>
      <td><strong>${leave.studentDetails?.name || ''}</strong></td>
      <th>Register No</th>
      <td><span class="ref-val">${leave.studentDetails?.registerNumber || ''}</span></td>
    </tr>
    <tr>
      <th>Department</th>
      <td>${leave.studentDetails?.department || ''}</td>
      <th>Year & Section</th>
      <td>${leave.studentDetails?.year || ''} (Sec ${leave.studentDetails?.section || ''})</td>
    </tr>
    <tr>
      <th>Hostel Name</th>
      <td>${leave.studentDetails?.hostel || ''}</td>
      <th>Room Number</th>
      <td><strong>${leave.studentDetails?.roomNumber || ''}</strong></td>
    </tr>
    <tr>
      <th>Contact Phone</th>
      <td>${leave.studentDetails?.phone || ''}</td>
      <th>Official Email</th>
      <td>${leave.studentDetails?.email || ''}</td>
    </tr>
  </table>

  <div class="section-title">2. Leave Schedule & Travel Destination</div>
  <table>
    <tr>
      <th>Leave Category</th>
      <td><strong>${leave.leaveType}</strong></td>
      <th>Duration</th>
      <td><strong>${leave.numberOfDays} Day(s)</strong></td>
    </tr>
    <tr>
      <th>Departure Date</th>
      <td><strong>${leave.fromDate}</strong></td>
      <th>Mandatory Return</th>
      <td><strong>${leave.toDate} (by 8:00 PM)</strong></td>
    </tr>
    <tr>
      <th>Reason for Leave</th>
      <td colspan="3"><em>${leave.reason}</em></td>
    </tr>
    <tr>
      <th>Travel Destination</th>
      <td colspan="3">${leave.destination}</td>
    </tr>
    <tr>
      <th>Parent / Guardian Contact</th>
      <td><strong>${leave.parentContact}</strong></td>
      <th>Emergency Phone</th>
      <td>${leave.emergencyContact || 'N/A'}</td>
    </tr>
  </table>

  <div class="section-title">3. Institutional Clearances & Endorsements</div>
  <div class="sign-grid">
    <div class="sign-box">
      <div class="sign-title">Head of Department (HOD)</div>
      <div>Clearance: <strong>${leave.hodStatus}</strong></div>
      ${leave.hodRejectionReason ? `<div style="color:#b91c1c; font-size:10px;">Reason: ${leave.hodRejectionReason}</div>` : ''}
      <div class="sign-line"></div>
      <div class="sign-footer">Authorized Signature & Department Stamp</div>
    </div>
    <div class="sign-box">
      <div class="sign-title">Hostel Warden</div>
      <div>Clearance: <strong>${leave.wardenStatus}</strong></div>
      ${leave.wardenRejectionReason ? `<div style="color:#b91c1c; font-size:10px;">Reason: ${leave.wardenRejectionReason}</div>` : ''}
      <div class="sign-line"></div>
      <div class="sign-footer">Authorized Signature & Hostel Stamp</div>
    </div>
  </div>

  <div class="section-title">4. Main Security Checkpoint (For Gate Exit / Entry)</div>
  <div class="gate-grid">
    <div class="gate-cell">
      <span>Out-Date & Time</span>
      <span style="color:#9ca3af;">Sign: _____________</span>
    </div>
    <div class="gate-cell">
      <span>In-Date & Time</span>
      <span style="color:#9ca3af;">Sign: _____________</span>
    </div>
    <div class="gate-cell">
      <span>Campus Gate Seal</span>
      <span style="color:#9ca3af;">[ SECURITY STAMP ]</span>
    </div>
  </div>

  <div class="footer-note">
    <span>System Generated Official Clearance Document</span>
    <span>Application ID: ${leave.applicationId}</span>
  </div>

  <script>
    window.onload = function() {
      // Auto-focus print if opened directly
      setTimeout(function() { window.print(); }, 200);
    };
  </script>
</body>
</html>`;
  };

  // 1. Direct File Download (Guaranteed to work without iframe blocks)
  const handleDownloadFile = () => {
    const htmlContent = generateSlipHtml();
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Leave_Application_${leave.applicationId}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  // 2. Hidden IFrame Print
  const handlePrint = () => {
    try {
      const htmlContent = generateSlipHtml();
      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      document.body.appendChild(iframe);

      const iframeDoc = iframe.contentWindow?.document;
      if (iframeDoc) {
        iframeDoc.open();
        iframeDoc.write(htmlContent);
        iframeDoc.close();

        setTimeout(() => {
          try {
            iframe.contentWindow?.focus();
            iframe.contentWindow?.print();
          } catch (e) {
            // If iframe printing is blocked by browser sandbox, fallback to direct download
            handleDownloadFile();
          } finally {
            setTimeout(() => {
              if (document.body.contains(iframe)) {
                document.body.removeChild(iframe);
              }
            }, 2000);
          }
        }, 300);
      } else {
        handleDownloadFile();
      }
    } catch (err) {
      handleDownloadFile();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white text-slate-900 rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 bg-slate-100 border-b border-slate-200 gap-3">
          <div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#003366]" />
              <span className="font-bold text-xs uppercase tracking-wider text-[#003366]">
                Official Leave Form & Outpass Slip
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Ref: <span className="font-mono font-bold text-slate-800">{leave.applicationId}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Primary Download File button */}
            <button
              onClick={handleDownloadFile}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors cursor-pointer"
              title="Download standalone file to your computer"
            >
              <ArrowDownToLine className="w-3.5 h-3.5" />
              <span>Download File (.html)</span>
            </button>

            {/* Print button */}
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#003366] hover:bg-[#1565C0] rounded-xl shadow-xs transition-colors cursor-pointer"
              title="Open Print Dialog"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {downloadSuccess && (
          <div className="px-6 py-2.5 bg-emerald-50 text-emerald-800 text-xs flex items-center gap-2 border-b border-emerald-200">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>Document file downloaded successfully! Double-click to open & print anytime.</span>
          </div>
        )}

        {/* Live Slip Preview */}
        <div className="p-6 sm:p-8 space-y-5 bg-white text-black text-xs font-sans max-h-[70vh] overflow-y-auto">
          {/* Header */}
          <div className="text-center pb-3 border-b-2 border-slate-900">
            <div className="font-serif text-base sm:text-lg font-black uppercase tracking-wide text-slate-900">
              CAMPUS INSTITUTE OF HIGHER EDUCATION
            </div>
            <div className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest mt-0.5">
              Office of Student Affairs & Residential Hostels
            </div>
            <div className="mt-2 inline-block px-3 py-1 border border-slate-900 font-bold uppercase tracking-wider text-[11px] bg-slate-50">
              OFFICIAL STUDENT LEAVE APPLICATION & OUTPASS SLIP
            </div>
          </div>

          {/* Reference Info */}
          <div className="flex justify-between items-center text-xs border-b border-slate-200 pb-2">
            <div>
              <span className="text-slate-500">REF NO: </span>
              <span className="font-mono font-bold text-slate-900">{leave.applicationId}</span>
            </div>
            <div>
              <span className="text-slate-500">DATE: </span>
              <span className="font-semibold text-slate-900">
                {new Date(leave.appliedAt).toLocaleDateString()}
              </span>
            </div>
            <div>
              <span className="text-slate-500">STATUS: </span>
              <span className="font-bold uppercase px-2 py-0.5 rounded border border-slate-400 text-[11px]">
                {leave.overallStatus}
              </span>
            </div>
          </div>

          {/* Table 1: Student Information */}
          <div>
            <div className="font-bold uppercase text-[10px] bg-slate-100 p-1.5 mb-1.5 border-l-4 border-[#003366]">
              1. Student Identification
            </div>
            <table className="w-full border-collapse border border-slate-300 text-xs">
              <tbody>
                <tr>
                  <td className="border border-slate-300 p-2 font-semibold bg-slate-50 w-1/4">Name</td>
                  <td className="border border-slate-300 p-2 font-bold w-1/4">{leave.studentDetails?.name}</td>
                  <td className="border border-slate-300 p-2 font-semibold bg-slate-50 w-1/4">Register No</td>
                  <td className="border border-slate-300 p-2 font-mono font-bold w-1/4">{leave.studentDetails?.registerNumber}</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 p-2 font-semibold bg-slate-50">Department</td>
                  <td className="border border-slate-300 p-2">{leave.studentDetails?.department}</td>
                  <td className="border border-slate-300 p-2 font-semibold bg-slate-50">Year & Section</td>
                  <td className="border border-slate-300 p-2">{leave.studentDetails?.year} ({leave.studentDetails?.section})</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 p-2 font-semibold bg-slate-50">Hostel & Room</td>
                  <td className="border border-slate-300 p-2">{leave.studentDetails?.hostel} (Room {leave.studentDetails?.roomNumber})</td>
                  <td className="border border-slate-300 p-2 font-semibold bg-slate-50">Student Phone</td>
                  <td className="border border-slate-300 p-2 font-mono">{leave.studentDetails?.phone}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Table 2: Leave Schedule */}
          <div>
            <div className="font-bold uppercase text-[10px] bg-slate-100 p-1.5 mb-1.5 border-l-4 border-[#003366]">
              2. Leave Schedule & Destination
            </div>
            <table className="w-full border-collapse border border-slate-300 text-xs">
              <tbody>
                <tr>
                  <td className="border border-slate-300 p-2 font-semibold bg-slate-50 w-1/4">Leave Category</td>
                  <td className="border border-slate-300 p-2 font-bold w-1/4">{leave.leaveType}</td>
                  <td className="border border-slate-300 p-2 font-semibold bg-slate-50 w-1/4">Duration</td>
                  <td className="border border-slate-300 p-2 font-bold w-1/4">{leave.numberOfDays} Days</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 p-2 font-semibold bg-slate-50">Departure Date</td>
                  <td className="border border-slate-300 p-2 font-bold">{leave.fromDate}</td>
                  <td className="border border-slate-300 p-2 font-semibold bg-slate-50">Return Date</td>
                  <td className="border border-slate-300 p-2 font-bold">{leave.toDate} (by 8 PM)</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 p-2 font-semibold bg-slate-50">Reason</td>
                  <td colSpan={3} className="border border-slate-300 p-2 italic">{leave.reason}</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 p-2 font-semibold bg-slate-50">Destination Address</td>
                  <td colSpan={3} className="border border-slate-300 p-2">{leave.destination}</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 p-2 font-semibold bg-slate-50">Parent Contact</td>
                  <td className="border border-slate-300 p-2 font-mono font-bold">{leave.parentContact}</td>
                  <td className="border border-slate-300 p-2 font-semibold bg-slate-50">Emergency Contact</td>
                  <td className="border border-slate-300 p-2 font-mono">{leave.emergencyContact || 'N/A'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Endorsements */}
          <div>
            <div className="font-bold uppercase text-[10px] bg-slate-100 p-1.5 mb-1.5 border-l-4 border-[#003366]">
              3. Approvals & Endorsements
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="border border-slate-300 p-2.5 rounded bg-slate-50/50">
                <div className="font-bold uppercase text-[10px] text-slate-800">Head of Department (HOD)</div>
                <div className="text-[11px] mt-0.5">Clearance: <strong>{leave.hodStatus}</strong></div>
                {leave.hodRejectionReason && (
                  <div className="text-[10px] text-rose-700 italic">Reason: {leave.hodRejectionReason}</div>
                )}
                <div className="pt-6 border-b border-dashed border-slate-400 mt-2"></div>
                <div className="text-[9px] text-center text-slate-500 mt-1">Authorized HOD Signature</div>
              </div>

              <div className="border border-slate-300 p-2.5 rounded bg-slate-50/50">
                <div className="font-bold uppercase text-[10px] text-slate-800">Hostel Warden</div>
                <div className="text-[11px] mt-0.5">Clearance: <strong>{leave.wardenStatus}</strong></div>
                {leave.wardenRejectionReason && (
                  <div className="text-[10px] text-rose-700 italic">Reason: {leave.wardenRejectionReason}</div>
                )}
                <div className="pt-6 border-b border-dashed border-slate-400 mt-2"></div>
                <div className="text-[9px] text-center text-slate-500 mt-1">Authorized Warden Signature</div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Bar */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-slate-50 border-t border-slate-200">
          <span className="text-xs text-slate-500">
            Tip: If printing doesn't open in your browser, click <strong>Download File</strong>.
          </span>
          <div className="flex gap-2">
            <button
              onClick={handleDownloadFile}
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download File</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#003366] hover:bg-[#1565C0] rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Form</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
