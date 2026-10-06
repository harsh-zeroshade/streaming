import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, Settings } from 'lucide-react'
import { useState } from 'react'
import { formatSeconds } from '../../utils/formatDuration'

export default function PlayerControls({
  visible,
  playing,
  currentTime,
  duration,
  volume,
  muted,
  fullscreen,
  playbackRate,
  onTogglePlay,
  onSeek,
  onVolume,
  onMute,
  onFullscreen,
  onPlaybackRate,
}) {
  const [showSettings, setShowSettings] = useState(false)
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  const handleSeekClick = (e) => {
    e.stopPropagation()
    const rect = e.currentTarget.getBoundingClientRect()
    const pct = (e.clientX - rect.left) / rect.width
    onSeek(pct * duration)
  }

  return (
    <div
      className={[
        'absolute inset-0 flex flex-col justify-end transition-opacity duration-300',
        visible ? 'opacity-100' : 'opacity-0 pointer-events-none',
      ].join(' ')}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/90 to-transparent pointer-events-none" />

      <div className="relative px-4 md:px-6 pb-4 md:pb-5 space-y-2">
        {/* Progress bar */}
        <div
          className="group relative h-1 hover:h-2 bg-white/20 rounded-full cursor-pointer transition-all duration-150"
          onClick={handleSeekClick}
          role="slider"
          aria-label="Seek"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight') onSeek(Math.min(duration, currentTime + 10))
            if (e.key === 'ArrowLeft') onSeek(Math.max(0, currentTime - 10))
          }}
        >
          <div
            className="absolute left-0 top-0 h-full bg-violet-500 rounded-full"
            style={{ width: `${progress}%` }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity shadow"
            style={{ left: `${progress}%` }}
          />
        </div>

        {/* Controls row */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Play/Pause */}
          <button
            onClick={onTogglePlay}
            className="w-10 h-10 flex items-center justify-center text-white hover:text-white/80 transition-colors cursor-pointer"
            aria-label={playing ? 'Pause' : 'Play'}
          >
            {playing ? <Pause size={22} fill="white" /> : <Play size={22} fill="white" />}
          </button>

          {/* Skip buttons */}
          <button
            onClick={() => onSeek(Math.max(0, currentTime - 10))}
            className="hidden sm:flex items-center justify-center text-xs text-white/70 hover:text-white w-8 h-8 cursor-pointer"
            aria-label="Rewind 10 seconds"
          >
            ‹10
          </button>
          <button
            onClick={() => onSeek(Math.min(duration, currentTime + 10))}
            className="hidden sm:flex items-center justify-center text-xs text-white/70 hover:text-white w-8 h-8 cursor-pointer"
            aria-label="Skip 10 seconds"
          >
            10›
          </button>

          {/* Volume */}
          <div className="flex items-center gap-1">
            <button
              onClick={onMute}
              className="w-9 h-9 flex items-center justify-center text-white/80 hover:text-white cursor-pointer"
              aria-label={muted ? 'Unmute' : 'Mute'}
            >
              {muted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={muted ? 0 : volume}
              onChange={(e) => onVolume(parseFloat(e.target.value))}
              className="hidden sm:block w-20 accent-violet-500 cursor-pointer"
              aria-label="Volume"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Time */}
          <span className="text-xs text-white/60 font-mono ml-1">
            {formatSeconds(currentTime)} / {formatSeconds(duration)}
          </span>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Settings (playback speed) */}
          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); setShowSettings((s) => !s) }}
              className="w-9 h-9 flex items-center justify-center text-white/70 hover:text-white cursor-pointer"
              aria-label="Settings"
            >
              <Settings size={16} />
            </button>
            {showSettings && (
              <div
                className="absolute bottom-12 right-0 bg-neutral-900 border border-white/10 rounded-xl shadow-2xl p-3 min-w-36"
                onClick={(e) => e.stopPropagation()}
              >
                <p className="text-xs text-white/40 mb-2 font-medium">Playback Speed</p>
                {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => { onPlaybackRate(rate); setShowSettings(false) }}
                    className={[
                      'w-full text-left px-2 py-1.5 text-sm rounded-lg transition-colors cursor-pointer',
                      playbackRate === rate
                        ? 'text-violet-400 bg-violet-500/10'
                        : 'text-white/70 hover:text-white hover:bg-white/5',
                    ].join(' ')}
                  >
                    {rate === 1 ? 'Normal' : `${rate}×`}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Fullscreen */}
          <button
            onClick={onFullscreen}
            className="w-9 h-9 flex items-center justify-center text-white/70 hover:text-white cursor-pointer"
            aria-label={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {fullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
          </button>
        </div>
      </div>
    </div>
  )
}
