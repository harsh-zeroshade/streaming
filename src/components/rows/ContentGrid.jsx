import ContentCard from '../cards/ContentCard'
import EmptyState from '../common/EmptyState'
import { Film } from 'lucide-react'

/**
 * Responsive grid of content cards.
 * layout: 'poster' | 'landscape'
 */
export default function ContentGrid({ items = [], layout = 'poster', emptyTitle, emptyDescription }) {
  if (!items.length) {
    return (
      <EmptyState
        icon={Film}
        title={emptyTitle || 'No titles found'}
        description={emptyDescription || 'Try adjusting your filters or check back later.'}
      />
    )
  }

  const gridCols =
    layout === 'poster'
      ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'
      : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'

  return (
    <div className={`grid gap-4 ${gridCols}`}>
      {items.map((item) => (
        <ContentCard key={item.id} item={item} layout={layout} />
      ))}
    </div>
  )
}
