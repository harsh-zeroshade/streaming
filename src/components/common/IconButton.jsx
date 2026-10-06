/**
 * Icon-only button with accessible label.
 */
export default function IconButton({
  icon: Icon,
  label,
  size = 'md',
  variant = 'ghost',
  active = false,
  className = '',
  onClick,
  ...rest
}) {
  const sizeMap = { sm: 'w-8 h-8', md: 'w-10 h-10', lg: 'w-12 h-12' }
  const iconSize = { sm: 14, md: 18, lg: 22 }
  const variantMap = {
    ghost: 'bg-transparent hover:bg-white/10 text-white/70 hover:text-white',
    solid: 'bg-white/10 hover:bg-white/20 text-white',
    filled: 'bg-white/20 hover:bg-white/30 text-white',
  }

  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={[
        'inline-flex items-center justify-center rounded-full',
        'transition-all duration-200 active:scale-90 cursor-pointer',
        sizeMap[size] || sizeMap.md,
        variantMap[variant] || variantMap.ghost,
        active ? 'text-violet-400' : '',
        className,
      ].join(' ')}
      {...rest}
    >
      <Icon size={iconSize[size] || 18} aria-hidden="true" />
    </button>
  )
}
