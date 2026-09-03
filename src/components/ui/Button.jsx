import { motion } from 'framer-motion'

const variants = {
  primary:
    'bg-ink-950 text-paper-50 hover:bg-ink-800 shadow-soft [box-shadow:0_16px_40px_-20px_rgba(16,24,20,0.55)]',
  light: 'bg-paper-50 text-ink-900 border border-ink-900/10 hover:border-ink-900/25 hover:bg-paper-100',
  moss: 'bg-moss-600 text-paper-50 hover:bg-moss-500 shadow-soft',
  ghost: 'text-ink-700 hover:bg-ink-900/5 hover:text-ink-950',
  whatsapp: 'bg-[#25D366] text-white hover:bg-[#1fb958] shadow-soft',
}

const sizes = {
  sm: 'h-10 px-4 text-sm',
  md: 'h-12 px-6 text-sm',
  lg: 'h-14 px-8 text-base',
  icon: 'h-11 w-11 p-0 justify-center',
}

/**
 * Modular Button with motion + variants.
 */
function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  fullWidth = false,
  icon,
  iconLeft,
  whileTap,
  whileHover,
  ...rest
}) {
  return (
    <motion.button
      whileHover={whileHover ?? { y: -2 }}
      whileTap={whileTap ?? { scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-wide transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-moss-400 focus-visible:ring-offset-2 ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...rest}
    >
      {iconLeft}
      {children}
      {icon}
    </motion.button>
  )
}

export default Button
