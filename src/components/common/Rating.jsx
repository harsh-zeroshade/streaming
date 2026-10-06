import { Star } from 'lucide-react'
import { ratingColor } from '../../utils/formatRating'

export default function Rating({ value, showNumber = true, size = 'sm' }) {
  if (!value) return null
  const colorClass = ratingColor(value)
  const iconSize = size === 'lg' ? 16 : 12

  return (
    <span className={`inline-flex items-center gap-1 font-semibold ${colorClass}`}>
      <Star size={iconSize} fill="currentColor" aria-hidden="true" />
      {showNumber && <span className={size === 'lg' ? 'text-base' : 'text-xs'}>{value}</span>}
    </span>
  )
}
