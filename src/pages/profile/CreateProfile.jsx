import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../services/apiService'

const COLORS = ['#6366f1','#a855f7','#ec4899','#f59e0b','#10b981','#3b82f6','#ef4444','#f97316']
const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
  'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&q=80',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80',
  'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=200&q=80',
]

const inputStyle = {
  width: '100%', background: 'rgba(255,255,255,.06)',
  border: '1px solid rgba(255,255,255,.10)', borderRadius: 14,
  padding: '12px 16px', color: '#fff', fontSize: 14, outline: 'none',
  transition: 'border-color .2s',
}

export default function CreateProfile() {
  const navigate = useNavigate()
  const [name,    setName]    = useState('')
  const [avatar,  setAvatar]  = useState(null)       // null = use gradient
  const [color,   setColor]   = useState(COLORS[0])
  const [isKids,  setIsKids]  = useState(false)
  const [saving,  setSaving]  = useState(false)
  const [error,   setError]   = useState('')

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!name.trim()) return
    setSaving(true)
    setError('')
    try {
      await api.post('/profiles', { name: name.trim(), avatar, color, isKids, language: 'English' })
      navigate('/profiles', { replace: true })
    } catch (err) {
      setError(err.message || 'Failed to create profile.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', paddingTop: 'var(--nav-h)', paddingBottom: 40 }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px' }}>
        <div style={{ width: '100%', maxWidth: 480 }}>
          <h1 style={{ fontSize: 'clamp(20px,3vw,28px)', fontWeight: 700, textAlign: 'center', marginBottom: 28 }}>
            Create Profile
          </h1>

          <form onSubmit={handleCreate} style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 24, padding: 'clamp(20px,4vw,36px)', display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* Avatar preview */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{
                width: 88, height: 88, borderRadius: '50%', overflow: 'hidden',
                background: avatar ? 'transparent' : `linear-gradient(135deg, ${color}, ${color}aa)`,
                border: '3px solid rgba(255,255,255,.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 32, fontWeight: 700, color: '#fff',
              }}>
                {avatar
                  ? <img src={avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : (name?.[0]?.toUpperCase() || '?')
                }
              </div>
            </div>

            {/* Color picker (when no avatar) */}
            {!avatar && (
              <div>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,.55)', marginBottom: 10 }}>Avatar color</p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {COLORS.map(c => (
                    <button key={c} type="button" onClick={() => setColor(c)}
                      style={{
                        width: 28, height: 28, borderRadius: '50%', background: c,
                        border: color === c ? '2px solid #fff' : '2px solid transparent',
                        cursor: 'pointer', transition: 'transform .15s',
                        transform: color === c ? 'scale(1.2)' : 'scale(1)',
                      }} />
                  ))}
                </div>
              </div>
            )}

            {/* Avatar photos */}
            <div>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,.55)', marginBottom: 10 }}>Or choose a photo</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {/* None option */}
                <button key="none" type="button" onClick={() => setAvatar(null)}
                  style={{
                    width: 52, height: 52, borderRadius: 10,
                    background: 'rgba(255,255,255,.08)',
                    border: avatar === null ? '2px solid #fff' : '2px solid rgba(255,255,255,.12)',
                    cursor: 'pointer', fontSize: 18, color: 'rgba(255,255,255,.5)',
                    display: 'grid', placeItems: 'center', transition: 'border-color .15s',
                  }}>
                  A
                </button>
                {AVATAR_OPTIONS.map(url => (
                  <button key={url} type="button" onClick={() => setAvatar(url)}
                    style={{
                      width: 52, height: 52, borderRadius: 10, overflow: 'hidden',
                      border: avatar === url ? '2px solid #fff' : '2px solid transparent',
                      cursor: 'pointer', padding: 0,
                      transform: avatar === url ? 'scale(1.08)' : 'scale(1)',
                      transition: 'transform .15s, border-color .15s',
                    }}>
                    <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  </button>
                ))}
              </div>
            </div>

            {/* Name */}
            <div>
              <label htmlFor="pname" style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,.55)', marginBottom: 6 }}>Profile Name</label>
              <input id="pname" type="text" value={name} onChange={e => setName(e.target.value)}
                placeholder="Enter a name" maxLength={20} required style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'rgba(255,255,255,.4)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,.10)'} />
            </div>

            {/* Kids toggle */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <div>
                <p style={{ fontSize: 14, fontWeight: 500 }}>Kids Profile</p>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,.40)', marginTop: 2 }}>Only age-appropriate content</p>
              </div>
              <button type="button" role="switch" aria-checked={isKids} onClick={() => setIsKids(k => !k)}
                style={{ width: 44, height: 24, borderRadius: 99, background: isKids ? '#2f9e5b' : 'rgba(255,255,255,.15)', position: 'relative', border: 'none', cursor: 'pointer', flexShrink: 0, transition: 'background .2s' }}>
                <span style={{ position: 'absolute', top: 3, left: isKids ? 23 : 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left .2s' }} />
              </button>
            </div>

            {error && (
              <p style={{ fontSize: 13, color: '#f87171', background: 'rgba(248,113,113,.08)', border: '1px solid rgba(248,113,113,.18)', borderRadius: 10, padding: '10px 14px' }}>{error}</p>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: 12 }}>
              <button type="button" onClick={() => navigate('/profiles')}
                style={{ flex: 1, height: 46, borderRadius: 999, background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.10)', color: 'rgba(255,255,255,.70)', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
                Cancel
              </button>
              <button type="submit" disabled={!name.trim() || saving}
                style={{ flex: 1, height: 46, borderRadius: 999, background: '#fff', color: '#111', fontWeight: 700, fontSize: 14, border: 'none', cursor: name.trim() && !saving ? 'pointer' : 'not-allowed', opacity: name.trim() && !saving ? 1 : .5 }}>
                {saving ? 'Creating…' : 'Create Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
