import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  UtensilsCrossed,
  BarChart3,
  Target,
  Zap,
  Menu,
  X,
} from 'lucide-react';
import { formatTime } from '../../utils/dateUtils';

const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/meals', label: 'Meals', icon: UtensilsCrossed },
  { path: '/statistics', label: 'Statistics', icon: BarChart3 },
  { path: '/goals', label: 'Goals', icon: Target },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [time, setTime] = useState(formatTime());
  const location = useLocation();

  useEffect(() => {
    const interval = setInterval(() => setTime(formatTime()), 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-full w-64 bg-dark-900 border-r border-dark-500/30 z-40">
        {/* Logo */}
        <div className="p-6 border-b border-dark-500/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neon/10 border border-neon/30 flex items-center justify-center shadow-neon-sm">
              <Zap size={20} className="text-neon" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">NutriCore</h1>
              <p className="text-xs text-dark-100">Calorie Tracker</p>
            </div>
          </div>
        </div>

        {/* Clock */}
        <div className="px-6 py-4 border-b border-dark-500/30">
          <p className="text-xs text-dark-100 uppercase tracking-widest mb-0.5">System Time</p>
          <p className="text-2xl font-bold text-neon font-mono">{time}</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.path} to={item.path} end={item.path === '/'}>
              {({ isActive }) => (
                <motion.div
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.15 }}
                  className={`
                    relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                    ${isActive
                      ? 'bg-neon/10 text-neon border border-neon/20'
                      : 'text-dark-100 hover:text-white hover:bg-dark-700'
                    }
                  `}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-neon rounded-r-full"
                      style={{ boxShadow: '0 0 8px #39FF14' }}
                    />
                  )}
                  <item.icon size={18} className={isActive ? 'text-neon' : ''} />
                  <span className="font-medium text-sm">{item.label}</span>
                </motion.div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-6 border-t border-dark-500/30">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-neon rounded-full animate-pulse" style={{ boxShadow: '0 0 6px #39FF14' }} />
            <span className="text-xs text-dark-100">System Online</span>
          </div>
          <p className="text-xs text-dark-300 mt-1">v1.0.0 — NutriCore</p>
        </div>
      </aside>

      {/* Mobile header — paddingTop clears the device status bar / Telegram safe area */}
      <header
        className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-dark-900/95 backdrop-blur-md border-b border-dark-500/30"
        style={{ paddingTop: 'var(--safe-top)' }}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-neon/10 border border-neon/30 flex items-center justify-center">
              <Zap size={16} className="text-neon" />
            </div>
            <span className="text-base font-bold text-white">NutriCore</span>
          </div>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="w-9 h-9 rounded-lg bg-dark-700 border border-dark-500 flex items-center justify-center text-white"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="border-t border-dark-500/30 overflow-hidden"
            >
              <nav className="p-3 space-y-1">
                {NAV_ITEMS.map((item) => (
                  <NavLink key={item.path} to={item.path} end={item.path === '/'}>
                    {({ isActive }) => (
                      <div
                        className={`
                          flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                          ${isActive
                            ? 'bg-neon/10 text-neon border border-neon/20'
                            : 'text-dark-100 hover:text-white hover:bg-dark-700'
                          }
                        `}
                      >
                        <item.icon size={18} />
                        <span className="font-medium text-sm">{item.label}</span>
                      </div>
                    )}
                  </NavLink>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
