import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Layout/Navbar';
import Dashboard from './pages/Dashboard';
import MealTracker from './pages/MealTracker';
import Statistics from './pages/Statistics';
import Goals from './pages/Goals';
import { useTelegram } from './hooks/useTelegram';

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  enter: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  exit: {
    opacity: 0,
    y: -16,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="enter"
        exit="exit"
        className="min-h-screen"
      >
        <Routes location={location}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/meals" element={<MealTracker />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/goals" element={<Goals />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  // Initialise Telegram Mini App (expand, ready, safe-area CSS vars)
  useTelegram();

  return (
    <BrowserRouter>
      <div className="animated-bg min-h-screen grid-scan">
        {/* Subtle scanlines */}
        <div
          className="fixed inset-0 pointer-events-none z-10 opacity-20"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)',
          }}
        />

        {/* Sidebar */}
        <Navbar />

        {/* Main content area */}
        <main className="lg:ml-64 min-h-screen">
          <div className="with-header-safe px-4 sm:px-6 lg:px-8 py-8 max-w-5xl mx-auto">
            <AnimatedRoutes />
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}
