/**
 * Progress bar used for continue-watching cards and the video player.
 * progress: 0–100
 */
export default function ProgressBar({ progress = 0, className = '', height = 'h-1' }) {
  const pct = Math.min(100, Math.max(0, progress))
  return (
    <div className={`w-full bg-white/15 rounded-full overflow-hidden ${height} ${className}`}>
      <div
        className="h-full bg-violet-500 rounded-full transition-all duration-300"
        style={{ width: `${pct}%` }}
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${pct}% watched`}
      />
    </div>
  )
}
