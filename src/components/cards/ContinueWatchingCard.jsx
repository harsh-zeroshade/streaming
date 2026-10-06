import { useNavigate } from 'react-router-dom'
import { Play, X } from 'lucide-react'
import { motion } from 'framer-motion'
import ProgressBar from '../common/ProgressBar'
import { useContinueWatching } from '../../hooks/useContinueWatching'

export default function ContinueWatchingCard({ item }) {
  const navigate = useNavigate()
  const { removeFromHistory } = useContinueWatching()

  if (!item) return null

  const watchPath = `/watch/${item.type}/${item.id}`

  return (
    <motion.div
      style={{ position: 'relative', flexShrink: 0, width: 'clamp(200px,18vw,280px)', cursor: 'pointer' }}
      whileHover={{ y: -6, scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 340, damping: 26 }}
    >
      {/* Remove button */}
      <motion.button
        onClick={e => { e.stopPropagation(); removeFromHistory(item.id) }}
        aria-label={`Remove ${item.title}`}
        initial={{ opacity: 0, scale: 0.8 }}
        whileHover={{ opacity: 1, scale: 1 }}
        style={{
          position: 'absolute', top: 8, right: 8, zIndex: 10,
          width: 28, height: 28, borderRadius: '50%',
          background: 'rgba(0,0,0,.70)', border: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
        }}
      >
        <X size={12} style={{ color: '#fff' }} />
      </motion.button>

      {/* Thumbnail */}
      <motion.div
        onClick={() => navigate(watchPath)}
        role="button"
        tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && navigate(watchPath)}
        aria-label={`Continue watching ${item.title}`}
        style={{
          position: 'relative', aspectRatio: '16/9',
          overflow: 'hidden', borderRadius: 14,
          background: '#222',
          boxShadow: '0 12px 30px rgba(0,0,0,.35)',
        }}
        whileHover={{ boxShadow: '0 20px 44px rgba(0,0,0,.55)' }}
        transition={{ duration: 0.2 }}
      >
        {item.backdrop ? (
          <img src={item.backdrop} alt={item.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            loading="lazy" />
        ) : (
          <div style={{ width: '100%', height: '100%', background: '#333' }} />
        )}

        {/* Dark overlay on hover */}
        <motion.div
          style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.20)' }}
          whileHover={{ background: 'rgba(0,0,0,.42)' }}
          transition={{ duration: 0.18 }}
        />

        {/* Play button */}
        <motion.div
          style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.18 }}
        >
          <motion.div
            style={{
              width: 48, height: 48, borderRadius: '50%',
              background: 'rgba(255,255,255,.92)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 20px rgba(0,0,0,.4)',
            }}
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            <Play size={18} fill="#111" style={{ color: '#111', marginLeft: 2 }} />
          </motion.div>
        </motion.div>

        {/* Progress bar */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 6px 6px' }}>
          <ProgressBar progress={item.progress} height="h-1" />
        </div>
      </motion.div>

      {/* Label */}
      <div style={{ marginTop: 10 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,.88)',
          overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' }}>
          {item.title}
        </p>
        {item.season && item.episode && (
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,.40)', marginTop: 2 }}>
            S{item.season} E{item.episode}
          </p>
        )}
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,.30)', marginTop: 2 }}>
          {item.progress}% watched
        </p>
      </div>
    </motion.div>
  )
}
