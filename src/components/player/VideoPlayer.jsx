import { useRef, useState, useEffect, useCallback } from 'react'
import PlayerControls from './PlayerControls'
import { watchProgressService } from '../../services/watchProgressService'

export default function VideoPlayer({ src, contentId, durationMinutes, onEnded, autoPlay = false, meta = {} }) {
  const videoRef = useRef(null)
  const containerRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [muted, setMuted] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [buffering, setBuffering] = useState(false)
  const hideTimer = useRef(null)

  // Restore saved progress on mount
  useEffect(() => {
    const saved = watchProgressService.getProgress(contentId)
    if (saved?.progressSeconds && videoRef.current) {
      videoRef.current.currentTime = saved.progressSeconds
    }
  }, [contentId])

  // Save progress every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (videoRef.current && !videoRef.current.paused) {
        watchProgressService.saveProgress(
          contentId,
          videoRef.current.currentTime,
          durationMinutes,
          meta
        )
      }
    }, 5000)
    return () => clearInterval(interval)
  }, [contentId, durationMinutes, meta])

  const resetHideTimer = useCallback(() => {
    setShowControls(true)
    clearTimeout(hideTimer.current)
    hideTimer.current = setTimeout(() => {
      if (!videoRef.current?.paused) setShowControls(false)
    }, 3000)
  }, [])

  useEffect(() => {
    return () => clearTimeout(hideTimer.current)
  }, [])

  const togglePlay = () => {
    const v = videoRef.current
    if (!v) return
    if (v.paused) { v.play(); setPlaying(true) }
    else { v.pause(); setPlaying(false); setShowControls(true) }
  }

  const handleSeek = (seconds) => {
    if (videoRef.current) videoRef.current.currentTime = seconds
  }

  const handleVolume = (val) => {
    setVolume(val)
    if (videoRef.current) videoRef.current.volume = val
    if (val === 0) setMuted(true)
    else setMuted(false)
  }

  const handleMute = () => {
    const v = videoRef.current
    if (!v) return
    v.muted = !muted
    setMuted(!muted)
  }

  const handlePlaybackRate = (rate) => {
    if (videoRef.current) videoRef.current.playbackRate = rate
    setPlaybackRate(rate)
  }

  const handleFullscreen = () => {
    const el = containerRef.current
    if (!el) return
    if (!document.fullscreenElement) {
      el.requestFullscreen?.()
      setFullscreen(true)
    } else {
      document.exitFullscreen?.()
      setFullscreen(false)
    }
  }

  useEffect(() => {
    const onFsChange = () => setFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', onFsChange)
    return () => document.removeEventListener('fullscreenchange', onFsChange)
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return
      switch (e.key) {
        case ' ': case 'k': e.preventDefault(); togglePlay(); break
        case 'f': handleFullscreen(); break
        case 'm': handleMute(); break
        case 'ArrowRight': handleSeek(Math.min(duration, currentTime + 10)); break
        case 'ArrowLeft': handleSeek(Math.max(0, currentTime - 10)); break
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  })

  useEffect(() => {
    if (autoPlay && videoRef.current) {
      videoRef.current.play().then(() => setPlaying(true)).catch(() => {})
    }
  }, [autoPlay])

  return (
    <div
      ref={containerRef}
      className={[
        'relative w-full bg-black select-none',
        fullscreen ? 'h-screen' : 'aspect-video',
      ].join(' ')}
      onMouseMove={resetHideTimer}
      onMouseLeave={() => { if (playing) setShowControls(false) }}
      onClick={togglePlay}
    >
      {/* Video element */}
      <video
        ref={videoRef}
        src={src}
        className="player-video"
        preload="metadata"
        playsInline
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime || 0)}
        onDurationChange={() => setDuration(videoRef.current?.duration || 0)}
        onEnded={() => {
          setPlaying(false)
          setShowControls(true)
          watchProgressService.saveProgress(contentId, videoRef.current?.duration || 0, durationMinutes, meta)
          onEnded?.()
        }}
        onWaiting={() => setBuffering(true)}
        onCanPlay={() => setBuffering(false)}
        aria-label="Video player"
      />

      {/* Buffering spinner */}
      {buffering && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-12 h-12 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      )}

      {/* Controls overlay */}
      <PlayerControls
        visible={showControls}
        playing={playing}
        currentTime={currentTime}
        duration={duration}
        volume={muted ? 0 : volume}
        muted={muted}
        fullscreen={fullscreen}
        playbackRate={playbackRate}
        onTogglePlay={togglePlay}
        onSeek={handleSeek}
        onVolume={handleVolume}
        onMute={handleMute}
        onFullscreen={handleFullscreen}
        onPlaybackRate={handlePlaybackRate}
      />
    </div>
  )
}
