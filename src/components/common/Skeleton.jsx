/**
 * Skeleton loading placeholder.
 * aspect: 'poster' (2/3) | 'landscape' (16/9) | 'square' | 'text'
 */
export default function Skeleton({ aspect = 'poster', className = '', count = 1 }) {
  const aspectMap = {
    poster: 'aspect-[2/3]',
    landscape: 'aspect-video',
    square: 'aspect-square',
    text: 'h-4 rounded',
  }

  const items = Array.from({ length: count })

  return (
    <>
      {items.map((_, i) => (
        <div
          key={i}
          className={[
            'bg-white/5 rounded-lg animate-pulse',
            aspectMap[aspect] || aspectMap.poster,
            className,
          ].join(' ')}
          aria-hidden="true"
        />
      ))}
    </>
  )
}

/** Row of skeleton cards for content rows */
export function SkeletonRow({ count = 6, aspect = 'poster' }) {
  return (
    <div className="flex gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex-none w-36 md:w-44">
          <Skeleton aspect={aspect} />
          <div className="mt-2 space-y-1">
            <Skeleton aspect="text" className="w-3/4" />
            <Skeleton aspect="text" className="w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}
