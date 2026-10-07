import { useState } from 'react'
import { Pencil } from 'lucide-react'

/* Gradient backgrounds used when no avatar image is set */
const GRADIENTS = [
  'linear-gradient(135deg, #4f8ef7, #7c3aed)',
  'linear-gradient(135deg, #a855f7, #ec4899)',
  'linear-gradient(135deg, #f59e0b, #ef4444)',
  'linear-gradient(135deg, #10b981, #06b6d4)',
  'linear-gradient(135deg, #6366f1, #8b5cf6)',
  'linear-gradient(135deg, #f97316, #eab308)',
]

const gradientFor = (id = '') => {
  const idx = id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % GRADIENTS.length
  return GRADIENTS[idx]
}

export default function ProfileCard({ profile, onClick, editMode = false, onDelete }) {
  const [hovered, setHovered] = useState(false)
  const size = 'clamp(90px, 12vw, 130px)'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <button
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-label={editMode ? `Edit ${profile.name}` : `Select ${profile.name}`}
        style={{
          width: size, height: size,
          borderRadius: '50%',
          overflow: 'hidden',
          border: `3px solid ${hovered ? '#fff' : 'transparent'}`,
          transition: 'border-color .2s, transform .2s, box-shadow .2s',
          transform: hovered ? 'scale(1.07)' : 'scale(1)',
          boxShadow: hovered ? '0 8px 32px rgba(0,0,0,.5)' : '0 4px 16px rgba(0,0,0,.35)',
          cursor: 'pointer',
          padding: 0,
          position: 'relative',
          flexShrink: 0,
          background: gradientFor(profile.id),
        }}
      >
        {profile.avatar ? (
          <img
            src={profile.avatar}
            alt={profile.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            onError={e => { e.target.style.display = 'none' }}
          />
        ) : (
          /* Gradient + initial letter fallback */
          <div style={{
            width: '100%', height: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 'clamp(28px,4vw,42px)', fontWeight: 700, color: '#fff',
            userSelect: 'none',
          }}>
            {profile.name?.[0]?.toUpperCase() || '?'}
          </div>
        )}

        {/* Kids badge overlay */}
        {profile.isKids && !editMode && (
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,.7), transparent)',
            paddingBottom: 8, paddingTop: 20,
            display: 'flex', justifyContent: 'center',
          }}>
            <span style={{
              fontSize: 11, fontWeight: 800, letterSpacing: '.05em',
              color: '#fff', textTransform: 'uppercase',
              background: 'rgba(245,158,11,.9)', borderRadius: 4,
              padding: '2px 7px',
            }}>Kids</span>
          </div>
        )}

        {/* Edit mode pencil overlay */}
        {editMode && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(0,0,0,.55)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Pencil size={24} color="#fff" />
          </div>
        )}
      </button>

      <span style={{
        fontSize: 14, fontWeight: 500,
        color: hovered ? '#fff' : 'rgba(255,255,255,.65)',
        transition: 'color .2s',
        textAlign: 'center',
      }}>
        {profile.name}
      </span>
    </div>
  )
}
