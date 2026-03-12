import { motion } from 'framer-motion';

export default function GlowCard({
  children,
  className = '',
  glowColor = 'rgba(57, 255, 20, 0.1)',
  animate = true,
  delay = 0,
  onClick,
  ...props
}) {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

  return (
    <motion.div
      variants={animate ? cardVariants : undefined}
      initial={animate ? 'hidden' : undefined}
      animate={animate ? 'visible' : undefined}
      whileHover={onClick ? { scale: 1.01, transition: { duration: 0.2 } } : undefined}
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl border border-dark-500/50 bg-dark-800 shadow-card ${onClick ? 'cursor-pointer' : ''} ${className}`}
      style={{
        background: `radial-gradient(ellipse at top left, ${glowColor} 0%, transparent 60%), #111111`,
      }}
      {...props}
    >
      {/* Corner accent */}
      <div className="absolute top-0 left-0 w-16 h-16 opacity-20"
        style={{
          background: `radial-gradient(circle at 0% 0%, ${glowColor.replace('0.1', '0.8')}, transparent)`,
        }}
      />
      {children}
    </motion.div>
  );
}
