import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { avatarOptions } from '../../data/profiles'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { defaultProfiles } from '../../data/profiles'

const inputStyle = {
  width: '100%',
  background: 'rgba(255,255,255,.06)',
  border: '1px solid rgba(255,255,255,.10)',
  borderRadius: 14,
  padding: '12px 16px',
  color: '#fff',
  fontSize: 14,
  outline: 'none',
  transition: 'border-color .2s',
}

export default function CreateProfile() {
  const navigate = useNavigate()
  const [profiles, setProfiles] = useLocalStorage('nova_profiles', defaultProfiles)
  const [name, setName] = useState('')
  const [avatar, setAvatar] = useState(avatarOptions[0])
  const [isKids, setIsKids] = useState(false)

  const handleCreate = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    setProfiles(p => [...p, { id: `profile-${Date.now()}`, name: name.trim(), avatar, color: '#2f9e5b', isKids, language: 'English' }])
    navigate('/profiles')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--nav-h) 16px 40px' }}>
      <div style={{ width: '100%', maxWidth: 460 }}>
        <h1 style={{ fontSize: 'clamp(20px,3vw,28px)', fontWeight: 700, textAlign: 'center', marginBottom: 28 }}>Create Profile</h1>

        <form onSubmit={handleCreate} style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 24, padding: 'clamp(20px,4vw,36px)', display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* Avatar grid */}
          <div>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,.55)', marginBottom: 12 }}>Choose an avatar</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {avatarOptions.map(url => (
                <button key={url} type="button" onClick={() => setAvatar(url)}
                  aria-pressed={avatar === url} aria-label="Select avatar"
                  style={{
                    width: 56, height: 56, borderRadius: 10, overflow: 'hidden', cursor: 'pointer',
                    outline: avatar === url ? '2px solid #fff' : '2px solid transparent',
                    outlineOffset: 2,
                    transform: avatar === url ? 'scale(1.10)' : 'scale(1)',
                    transition: 'outline .15s, transform .15s',
                    padding: 0, border: 'none',
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
              onFocus={e => e.target.style.borderColor = 'rgba(255,255,255,.35)'}
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

          {/* Actions */}
          <div style={{ display: 'flex', gap: 12 }}>
            <button type="button" onClick={() => navigate('/profiles')}
              style={{ flex: 1, height: 46, borderRadius: 999, background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.10)', color: 'rgba(255,255,255,.70)', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
              Cancel
            </button>
            <button type="submit" disabled={!name.trim()}
              style={{ flex: 1, height: 46, borderRadius: 999, background: '#fff', color: '#111', fontWeight: 700, fontSize: 14, border: 'none', cursor: name.trim() ? 'pointer' : 'not-allowed', opacity: name.trim() ? 1 : .5 }}>
              Create Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
