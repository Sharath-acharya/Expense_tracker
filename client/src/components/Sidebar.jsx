import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, List, BarChart2, TrendingUp, LogOut, X, Menu } from 'lucide-react';
import useStore from '../store/useStore';
import toast from 'react-hot-toast';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Overview' },
  { to: '/transactions', icon: List, label: 'Transactions' },
  { to: '/analytics', icon: BarChart2, label: 'Analytics' },
];

export default function Sidebar({ open, setOpen }) {
  const { user, logout } = useStore();

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-white/5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-violet-600 flex items-center justify-center neon-blue">
          <TrendingUp size={18} className="text-white" />
        </div>
        <span className="font-bold text-lg gradient-text">SpendWise</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-gradient-to-r from-sky-500/20 to-violet-600/20 text-sky-400 border border-sky-500/20'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={18} className={isActive ? 'text-sky-400' : 'text-white/40 group-hover:text-white/70'} />
                {label}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-sky-400"
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="px-3 pb-6 border-t border-white/5 pt-4">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/3 mb-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <p className="text-xs text-white/30 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(true)}
        className="fixed top-4 left-4 z-50 md:hidden glass p-2 rounded-xl"
      >
        <Menu size={20} className="text-white" />
      </button>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-64 glass border-r border-white/5 flex-col z-40">
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/60 z-40 md:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-full w-64 glass border-r border-white/5 z-50 md:hidden flex flex-col"
            >
              <button
                onClick={() => setOpen(false)}
                className="absolute top-4 right-4 text-white/40 hover:text-white"
              >
                <X size={20} />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
