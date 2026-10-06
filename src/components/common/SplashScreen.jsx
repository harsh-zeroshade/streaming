import { useState, useEffect, useRef, useCallback } from 'react'

/**
 * Full-screen preloading animation.
 * - Desktop (≥ 640px): /preanimation.mp4
 * - Mobile  (< 640px): /mobpreanimation.mp4
 *
 * Dismisses on: video end · video error · click/tap · 8 s timeout
 * Plays once per browser session (sessionStorage flag).
 */
export default function SplashScreen({ onDone }) {
  const [phase, setPhase] = useState('visible') // 'visible' | 'fading' | 'done'
  const videoRef  = useRef(null)
  const dismissed = useRef(false)

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640
  const src = isMobile ? '/mobpreanimation.mp4' : '/preanimation.mp4'

  const dismiss = useCallback(() => {
    if (dismissed.current) return
    dismissed.current = true
    setPhase('fading')
    setTimeout(() => {
      setPhase('done')
      sessionStorage.setItem('nova_splash_shown', '1')
      onDone?.()
    }, 500)
  }, [onDone])

  useEffect(() => {
    // Safety timeout
    const t = setTimeout(dismiss, 8000)

    const v = videoRef.current
    if (v) {
      v.play().catch(() => {
        // Autoplay blocked — dismiss immediately so app isn't stuck
        dismiss()
      })
    }

    return () => clearTimeout(t)
  }, [dismiss])

  if (phase === 'done') return null

  return (
    <div
      onClick={dismiss}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: '#000',
        cursor: 'pointer',
        opacity: phase === 'fading' ? 0 : 1,
        transition: 'opacity .5s ease',
        pointerEvents: phase === 'fading' ? 'none' : 'auto',
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Intro animation — click to skip"
    >
      <video
        ref={videoRef}
        src={src}
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={dismiss}
        onError={dismiss}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
      <p style={{
        position: 'absolute', bottom: 24, right: 24,
        fontSize: 11, color: 'rgba(255,255,255,.3)',
        letterSpacing: '.08em', textTransform: 'uppercase',
        pointerEvents: 'none', userSelect: 'none',
      }}>
        tap to skip
      </p>
    </div>
  )
}
