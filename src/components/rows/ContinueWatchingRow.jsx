import { useRef } from 'react'
import ContinueWatchingCard from '../cards/ContinueWatchingCard'

export default function ContinueWatchingRow({ items = [] }) {
  const scrollRef = useRef(null)
  if (!items.length) return null

  return (
    <section aria-label="Continue Watching" style={{ paddingBottom: 'clamp(36px,6vw,90px)' }}>
      <div
        className="flex items-center justify-between"
        style={{ padding: '0 var(--pad)', marginBottom: 'clamp(14px,1.6vw,28px)' }}
      >
        <h2 style={{ fontSize: 'clamp(20px,1.7vw,28px)', fontWeight: 700, letterSpacing: '-.01em' }}>
          Continue Watching
        </h2>
      </div>
      <div
        ref={scrollRef}
        className="scroll-row flex"
        style={{ gap: 'clamp(12px,1.4vw,20px)', padding: '6px var(--pad) 14px', scrollPaddingLeft: 'var(--pad)' }}
      >
        {items.map((item) => (
          <ContinueWatchingCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  )
}
