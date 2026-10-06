/**
 * Return a star count (0–5) from a 0–10 rating string/number.
 */
export const ratingToStars = (rating) => {
  const n = parseFloat(rating)
  if (isNaN(n)) return 0
  return Math.round(n / 2)
}

/**
 * Return a badge color class based on rating value.
 */
export const ratingColor = (rating) => {
  const n = parseFloat(rating)
  if (n >= 8.5) return 'text-emerald-400'
  if (n >= 7.0) return 'text-yellow-400'
  return 'text-red-400'
}
