import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CreditCard,
  BarChart3,
  Target,
  Settings,
  X,
  LogOut,
  User
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/transactions', label: 'Transactions', icon: CreditCard },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/budget', label: 'Budget', icon: Target },
  { to: '/settings', label: 'Settings', icon: Settings }
];

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-navy-900 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:static lg:z-auto flex flex-col`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gold-500 rounded-lg flex items-center justify-center">
              <span className="text-navy-900 font-black text-lg">F</span>
            </div>
            <span className="text-xl font-bold tracking-tight">FinTrack</span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 hover:bg-navy-800 rounded"
          >
            <X size={20} />
          </button>
        </div>

        {/* User info */}
        {user && (
          <div className="mx-3 mb-4 px-4 py-3 bg-navy-800 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gold-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <User size={18} className="text-gold-400" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                <p className="text-xs text-navy-400 truncate">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-3">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 mb-1 rounded-lg transition-all ${
                  isActive
                    ? 'bg-gold-500 text-navy-900 font-semibold shadow-lg'
                    : 'text-navy-200 hover:bg-navy-800 hover:text-white'
                }`
              }
            >
              <Icon size={20} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout + Footer */}
        <div className="p-3 border-t border-navy-800">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-navy-300 hover:bg-red-500/10 hover:text-red-400 transition"
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
          <p className="text-xs text-navy-500 text-center mt-3">
            FinTrack v1.0.0
          </p>
        </div>
      </aside>
    </>
  );
}
