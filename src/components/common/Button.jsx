/**
 * Reusable Button component with multiple variants.
 * variant: 'primary' | 'secondary' | 'ghost' | 'danger'
 * size: 'sm' | 'md' | 'lg'
 */
const variants = {
  primary: 'bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-900/40',
  secondary: 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border border-white/10',
  ghost: 'bg-transparent hover:bg-white/10 text-white',
  danger: 'bg-red-600 hover:bg-red-500 text-white',
  play: 'bg-white hover:bg-white/90 text-black font-semibold',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-5 py-2.5 text-sm gap-2',
  lg: 'px-7 py-3.5 text-base gap-2.5',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconRight: IconRight,
  disabled = false,
  className = '',
  onClick,
  type = 'button',
  ...rest
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={[
        'inline-flex items-center justify-center rounded-lg font-medium',
        'transition-all duration-200 active:scale-95 cursor-pointer',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant] || variants.primary,
        sizes[size] || sizes.md,
        className,
      ].join(' ')}
      {...rest}
    >
      {Icon && <Icon size={size === 'lg' ? 20 : size === 'sm' ? 14 : 16} aria-hidden="true" />}
      {children}
      {IconRight && <IconRight size={size === 'lg' ? 20 : size === 'sm' ? 14 : 16} aria-hidden="true" />}
    </button>
  )
}
