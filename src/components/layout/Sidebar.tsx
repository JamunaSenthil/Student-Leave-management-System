import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.tsx';
import {
  LayoutDashboard,
  FilePlus2,
  ListOrdered,
  Search,
  User,
  CheckSquare,
  Users,
  History,
  Building,
  Home,
  Shield,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  if (!user) return null;

  const role = user.role;

  const studentLinks = [
    { to: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/student/apply', label: 'Apply for Leave', icon: FilePlus2 },
    { to: '/student/leaves', label: 'My Applications', icon: ListOrdered },
    { to: '/student/track', label: 'Track Leave', icon: Search },
    { to: '/student/profile', label: 'My Profile', icon: User },
  ];

  const hodLinks = [
    { to: '/hod/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/hod/leaves', label: 'Department Leaves', icon: CheckSquare },
    { to: '/hod/students', label: 'Department Students', icon: Users },
    { to: '/hod/history', label: 'Approval History', icon: History },
  ];

  const wardenLinks = [
    { to: '/warden/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/warden/leaves', label: 'Hostel Leaves', icon: CheckSquare },
    { to: '/warden/students', label: 'Hostel Students', icon: Users },
    { to: '/warden/history', label: 'Approval History', icon: History },
  ];

  const links =
    role === 'student' ? studentLinks : role === 'hod' ? hodLinks : wardenLinks;

  const getSubHeader = () => {
    if (role === 'hod') {
      return (
        <div className="px-4 py-3 mx-3 mb-2 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/50">
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-900 dark:text-purple-300">
            <Building className="w-4 h-4 shrink-0 text-purple-600" />
            <span className="truncate">{user.department}</span>
          </div>
          <span className="text-[10px] text-purple-700/70 dark:text-purple-400 block mt-0.5">
            Department Jurisdiction
          </span>
        </div>
      );
    }
    if (role === 'warden') {
      return (
        <div className="px-4 py-3 mx-3 mb-2 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/50">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-900 dark:text-amber-300">
            <Home className="w-4 h-4 shrink-0 text-amber-600" />
            <span className="truncate">{user.hostel}</span>
          </div>
          <span className="text-[10px] text-amber-700/70 dark:text-amber-400 block mt-0.5">
            Hostel Residential Block
          </span>
        </div>
      );
    }
    return (
      <div className="px-4 py-3 mx-3 mb-2 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50">
        <div className="text-xs font-semibold text-blue-900 dark:text-blue-300 truncate">
          {user.registerNumber}
        </div>
        <span className="text-[10px] text-blue-700/70 dark:text-blue-400 block truncate mt-0.5">
          {user.department}
        </span>
      </div>
    );
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed md:sticky top-16 left-0 z-30 h-[calc(100vh-4rem)] w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col py-4 transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {getSubHeader()}

        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => {
                  if (window.innerWidth < 768) onClose();
                }}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#1565C0] text-white shadow-sm font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* System security footnote */}
        <div className="px-4 pt-3 mt-auto border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <Shield className="w-3.5 h-3.5 text-emerald-500" />
            <span>256-bit JWT Secured</span>
          </div>
        </div>
      </aside>
    </>
  );
};
