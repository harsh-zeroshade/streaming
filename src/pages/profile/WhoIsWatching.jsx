import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Pencil } from 'lucide-react'
import ProfileCard from '../../components/profile/ProfileCard'
import { api } from '../../services/apiService'

export default function WhoIsWatching() {
  const navigate = useNavigate()
  const [profiles,  setProfiles]  = useState([])
  const [loading,   setLoading]   = useState(true)
  const [editMode,  setEditMode]  = useState(false)
  const [deleting,  setDeleting]  = useState(null)

  // Load profiles from backend
  useEffect(() => {
    api.get('/profiles')
      .then(({ profiles }) => setProfiles(profiles || []))
      .catch(() => setProfiles([]))
      .finally(() => setLoading(false))
  }, [])

  const handleSelect = (profile) => {
    if (editMode) return
    // Store selected profile in sessionStorage so other pages can read it
    sessionStorage.setItem('nova_active_profile', JSON.stringify(profile))
    navigate('/')
  }

  const handleDelete = async (id) => {
    setDeleting(id)
    try {
      await api.delete(`/profiles/${id}`)
      setProfiles(prev => prev.filter(p => p._id !== id))
    } catch { /* ignore */ }
    finally { setDeleting(null) }
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 40, height: 40, border: '3px solid rgba(255,255,255,.15)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', paddingTop: 'var(--nav-h)' }}>

      {/* ── Title row ── */}
      <div style={{
        position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 'clamp(24px,4vw,48px) clamp(24px,5vw,64px) 0',
      }}>
        <h1 style={{ fontSize: 'clamp(22px,3vw,34px)', fontWeight: 700, color: '#fff', letterSpacing: '-.01em', textAlign: 'center' }}>
          {editMode ? 'Manage Profiles' : "Who's watching?"}
        </h1>
        <button
          onClick={() => setEditMode(e => !e)}
          style={{
            position: 'absolute', right: 'clamp(24px,5vw,64px)',
            display: 'flex', alignItems: 'center', gap: 7,
            fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,.70)',
            cursor: 'pointer', background: 'transparent',
            border: '1px solid rgba(255,255,255,.20)', borderRadius: 8, padding: '7px 16px',
            transition: 'color .18s, border-color .18s',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,.55)' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,.70)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,.20)' }}
        >
          <Pencil size={13} />
          {editMode ? 'Done' : 'Edit'}
        </button>
      </div>

      {/* ── Profile grid ── */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px clamp(24px,5vw,64px) clamp(40px,8vh,80px)',
      }}>
        <div style={{
          display: 'flex', flexWrap: 'wrap',
          gap: 'clamp(28px,4vw,52px)',
          justifyContent: 'center', alignItems: 'flex-start',
        }}>

          {profiles.map(profile => (
            <div key={profile._id} style={{ position: 'relative' }}>
              <ProfileCard
                profile={{ ...profile, id: profile._id }}
                editMode={editMode}
                onClick={() => handleSelect(profile)}
              />
              {editMode && (
                <button
                  onClick={() => handleDelete(profile._id)}
                  disabled={deleting === profile._id}
                  aria-label={`Remove ${profile.name}`}
                  style={{
                    position: 'absolute', top: -6, right: -6,
                    width: 22, height: 22, borderRadius: '50%',
                    background: deleting === profile._id ? '#666' : '#e50914',
                    color: '#fff', fontSize: 14, fontWeight: 700,
                    display: 'grid', placeItems: 'center',
                    cursor: 'pointer', border: '2px solid var(--bg)',
                  }}
                >×</button>
              )}
            </div>
          ))}

          {/* Add profile */}
          {profiles.length < 5 && (
            <button
              onClick={() => navigate('/profiles/create')}
              aria-label="Add profile"
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, cursor: 'pointer', background: 'none', border: 'none' }}
            >
              <div style={{
                width: 'clamp(90px,12vw,130px)', height: 'clamp(90px,12vw,130px)',
                borderRadius: '50%',
                background: 'rgba(255,255,255,.08)',
                border: '2px solid rgba(255,255,255,.18)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background .2s, border-color .2s, transform .2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,.15)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,.5)'; e.currentTarget.style.transform = 'scale(1.07)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,.18)'; e.currentTarget.style.transform = 'scale(1)' }}
              >
                <Plus size={32} color="rgba(255,255,255,.55)" />
              </div>
              <span style={{ fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,.55)' }}>Add</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
