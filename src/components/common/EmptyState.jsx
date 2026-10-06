import { Film } from 'lucide-react'
import Button from './Button'

export default function EmptyState({
  icon: Icon = Film,
  title = 'Nothing here yet',
  description = '',
  actionLabel,
  onAction,
  className = '',
}) {
  return (
    <div className={`flex flex-col items-center justify-center py-24 px-6 text-center ${className}`}>
      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-5">
        <Icon size={28} className="text-white/30" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-semibold text-white/80 mb-2">{title}</h3>
      {description && <p className="text-sm text-white/40 max-w-xs mb-6">{description}</p>}
      {actionLabel && onAction && (
        <Button onClick={onAction} size="sm">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
