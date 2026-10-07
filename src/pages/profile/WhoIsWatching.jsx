import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Pencil } from 'lucide-react'
import ProfileCard from '../../components/profile/ProfileCard'
import { defaultProfiles } from '../../data/profiles'
import { useLocalStorage } from '../../hooks/useLocalStorage'

export default function WhoIsWatching() {
  const navigate = useNavigate()
  const [profiles, setProfiles] = useLocalStorage('nova_profiles', defaultProfiles)
  const [editMode, setEditMode] = useState(false)

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      paddingTop: 'var(--nav-h)',
      paddingBottom: 40,
    }}>
      {/* Inner wrapper fills remaining height and centers content */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
      }}>
      <div style={{ textAlign: 'center', width: '100%', maxWidth: 700 }}>

        <h1 style={{ fontSize: 'clamp(22px,4vw,40px)', fontWeight: 700, marginBottom: 'clamp(28px,5vw,48px)' }}>
          {editMode ? 'Manage Profiles' : "Who's watching?"}
        </h1>

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 'clamp(16px,3vw,32px)', marginBottom: 'clamp(28px,5vw,48px)' }}>
          {profiles.map((profile) => (
            <ProfileCard key={profile.id} profile={profile} onClick={() => { if (!editMode) navigate('/') }} />
          ))}

          {profiles.length < 5 && (
            <button
              onClick={() => navigate('/profiles/create')}
              aria-label="Add new profile"
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, cursor: 'pointer', background: 'none', border: 'none' }}
            >
              <div style={{
                width: 'clamp(100px,13vw,140px)', height: 'clamp(100px,13vw,140px)',
                borderRadius: 16, border: '2px dashed rgba(255,255,255,.20)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'border-color .2s',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,.50)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,.20)'}
              >
                <Plus size={32} style={{ color: 'rgba(255,255,255,.35)' }} />
              </div>
              <span style={{ fontSize: 14, color: 'rgba(255,255,255,.50)', fontWeight: 500 }}>Add Profile</span>
            </button>
          )}
        </div>

        <button
          onClick={() => setEditMode(e => !e)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            fontSize: 13, color: 'rgba(255,255,255,.50)',
            border: '1px solid rgba(255,255,255,.18)', borderRadius: 12,
            padding: '10px 20px', cursor: 'pointer',
            transition: 'all .15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,.45)' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,.50)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,.18)' }}
        >
          <Pencil size={14} />
          {editMode ? 'Done' : 'Manage Profiles'}
        </button>
      </div>
      </div>
    </div>
  )
}
