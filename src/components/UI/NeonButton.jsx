import { motion } from 'framer-motion';

export default function NeonButton({
  children,
  onClick,
  variant = 'primary', // 'primary' | 'ghost' | 'danger' | 'outline'
  size = 'md',         // 'sm' | 'md' | 'lg'
  disabled = false,
  className = '',
  icon,
  type = 'button',
  fullWidth = false,
  ...props
}) {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base',
  };

  const variantClasses = {
    primary: 'bg-neon text-dark-900 font-bold hover:bg-neon-bright hover:shadow-neon',
    ghost: 'bg-transparent border border-dark-500 text-white hover:border-neon/50 hover:text-neon hover:bg-neon/5',
    danger: 'bg-transparent border border-accent-red/40 text-accent-red hover:bg-accent-red/10 hover:border-accent-red',
    outline: 'bg-transparent border border-neon/40 text-neon hover:bg-neon/10 hover:border-neon',
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.03 }}
      whileTap={disabled ? {} : { scale: 0.97 }}
      transition={{ duration: 0.15 }}
      className={`
        inline-flex items-center justify-center gap-2 rounded-xl font-semibold
        transition-all duration-200 select-none
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </motion.button>
  );
}
