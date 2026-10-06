import { useState } from 'react'

/** Reference .d2-trailer — fixed aspect-ratio container with play overlay */
export default function TrailerSection({ item }) {
  const [playing, setPlaying] = useState(false)

  if (!item?.trailer) return null

  // Build an autoplay URL so the video starts immediately when the user clicks play.
  // item.trailer is a YouTube embed URL like https://www.youtube.com/embed/abc123
  const autoplayUrl = (() => {
    try {
      const url = new URL(item.trailer)
      url.searchParams.set('autoplay', '1')
      url.searchParams.set('rel', '0')
      return url.toString()
    } catch {
      return item.trailer
    }
  })()

  return (
    <div
      className="d2-trailer"
      onClick={!playing ? () => setPlaying(true) : undefined}
      role={!playing ? 'button' : undefined}
      aria-label={!playing ? `Play ${item.title} trailer` : undefined}
    >
      {playing ? (
        /* YouTube embed URL must be loaded in an <iframe>, not a <video> tag */
        <iframe
          src={autoplayUrl}
          title={`${item.title} trailer`}
          allowFullScreen
          allow="autoplay; fullscreen; picture-in-picture"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
        />
      ) : (
        /* Thumbnail placeholder shown before play is clicked */
        <>
          {item.backdrop || item.poster ? (
            <img
              src={item.backdrop || item.poster}
              alt={`${item.title} trailer thumbnail`}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : null}

          {/* Play button overlay — reference .d2-tp */}
          <button className="d2-tp" aria-label="Play trailer">
            <svg viewBox="0 0 24 24"><path d="M7 4v16l13-8z" /></svg>
          </button>

          {/* Bottom bar — reference .d2-bar */}
          <div className="d2-bar">
            <span>Trailer</span>
            <i />
            <svg viewBox="0 0 24 24" style={{ fontSize: 15 }}>
              <path d="M11 5 6 9H3v6h3l5 4zM15.5 8.5a5 5 0 0 1 0 7" />
            </svg>
            <svg viewBox="0 0 24 24" style={{ fontSize: 15 }}>
              <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
            </svg>
          </div>
        </>
      )}
    </div>
  )
}
