import { useState, useEffect } from 'react'
import { User, CreditCard, Monitor, Globe, Tv, Shield, ChevronRight, Check, LogOut } from 'lucide-react'
import { authService } from '../../services/authService'
import { api } from '../../services/apiService'
import { useNavigate } from 'react-router-dom'

const SECTIONS = [
  { id: 'account',    label: 'Account',             icon: User },
  { id: 'membership', label: 'Membership & Billing', icon: CreditCard },
  { id: 'playback',   label: 'Playback Settings',    icon: Monitor },
  { id: 'language',   label: 'Language',              icon: Globe },
  { id: 'devices',    label: 'Devices',               icon: Tv },
  { id: 'security',   label: 'Security',              icon: Shield },
]

const PLAN_LABELS = {
  'plan-basic':    { name: 'Basic',    price: '$6.99',  quality: '1080p HD', screens: '1 Screen' },
  'plan-standard': { name: 'Standard', price: '$13.99', quality: '1080p HD', screens: '2 Screens' },
  'plan-premium':  { name: 'Premium',  price: '$19.99', quality: '4K Ultra HD', screens: '4 Screens' },
}

function Toggle({ value, onChange, label, desc }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 0', borderBottom: '1px solid rgba(255,255,255,.06)', gap: 16 }}>
      <div>
        <p style={{ fontSize: 15, fontWeight: 500, color: '#fff', marginBottom: desc ? 3 : 0 }}>{label}</p>
        {desc && <p style={{ fontSize: 13, color: 'rgba(255,255,255,.40)' }}>{desc}</p>}
      </div>
      <button onClick={() => onChange(!value)} role="switch" aria-checked={value} aria-label={label}
        style={{ width: 52, height: 28, borderRadius: 99, background: value ? '#2f9e5b' : 'rgba(255,255,255,.15)', position: 'relative', border: 'none', cursor: 'pointer', transition: 'background .25s', flexShrink: 0 }}>
        <span style={{ position: 'absolute', top: 4, left: value ? 28 : 4, width: 20, height: 20, borderRadius: '50%', background: '#fff', transition: 'left .25s', boxShadow: '0 1px 4px rgba(0,0,0,.3)' }} />
      </button>
    </div>
  )
}

function Btn({ children, danger, onClick, disabled }) {
  const [hov, setHov] = useState(false)
  return (
    <button onClick={onClick} disabled={disabled} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        height: 44, padding: '0 24px', borderRadius: 999,
        fontSize: 14, fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? .5 : 1,
        background: danger ? (hov ? 'rgba(248,113,113,.18)' : 'rgba(248,113,113,.10)') : (hov ? 'rgba(255,255,255,.12)' : 'rgba(255,255,255,.07)'),
        color: danger ? '#f87171' : 'rgba(255,255,255,.85)',
        border: `1px solid ${danger ? 'rgba(248,113,113,.28)' : 'rgba(255,255,255,.12)'}`,
        transition: 'background .15s',
      }}>
      {children}
    </button>
  )
}

const sh = { fontSize: 'clamp(18px,2vw,24px)', fontWeight: 700, marginBottom: 24, paddingBottom: 18, borderBottom: '1px solid rgba(255,255,255,.08)' }

const inputStyle = {
  width: '100%', background: 'rgba(255,255,255,.06)',
  border: '1px solid rgba(255,255,255,.10)', borderRadius: 12,
  padding: '10px 14px', color: '#fff', fontSize: 14, outline: 'none',
}

export default function AccountSettings() {
  const navigate = useNavigate()
  const [user, setUser]     = useState(authService.getCurrentUser())
  const [active, setActive] = useState('account')
  const [prefs, setPrefs]   = useState({ autoplay: true, hd: true, subtitles: false, dataUsage: false })
  const set = k => v => setPrefs(p => ({ ...p, [k]: v }))

  // Editing state
  const [editingName, setEditingName] = useState(false)
  const [nameInput,   setNameInput]   = useState('')
  const [saving,      setSaving]      = useState(false)
  const [saveMsg,     setSaveMsg]     = useState('')

  // Refresh user from backend on mount
  useEffect(() => {
    authService.refreshUser().then(u => { if (u) setUser(authService.getCurrentUser()) })
  }, [])

  const planInfo = PLAN_LABELS[user?.plan] || PLAN_LABELS['plan-basic']

  const handleSaveName = async () => {
    if (!nameInput.trim()) return
    setSaving(true)
    try {
      // Update via backend
      await api.post('/auth/update-profile', { name: nameInput.trim() })
      const stored = authService.getCurrentUser()
      const updated = { ...stored, name: nameInput.trim() }
      localStorage.setItem('nova_auth', JSON.stringify(updated))
      setUser(updated)
      setSaveMsg('Name updated!')
      setEditingName(false)
      setTimeout(() => setSaveMsg(''), 3000)
    } catch {
      // Graceful: update locally even if backend endpoint doesn't exist yet
      const stored = authService.getCurrentUser()
      const updated = { ...stored, name: nameInput.trim() }
      localStorage.setItem('nova_auth', JSON.stringify(updated))
      setUser(updated)
      setEditingName(false)
      setSaveMsg('Name updated locally.')
      setTimeout(() => setSaveMsg(''), 3000)
    } finally {
      setSaving(false)
    }
  }

  const content = () => {
    switch (active) {
      case 'account': return (
        <div>
          <h2 style={sh}>Account</h2>

          {saveMsg && (
            <div style={{ background: 'rgba(47,158,91,.10)', border: '1px solid rgba(47,158,91,.25)', borderRadius: 10, padding: '10px 16px', fontSize: 13, color: '#4ade80', marginBottom: 20 }}>
              {saveMsg}
            </div>
          )}

          {/* Avatar + user info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '20px 0 24px', borderBottom: '1px solid rgba(255,255,255,.08)', marginBottom: 8 }}>
            <div style={{ width: 68, height: 68, borderRadius: '50%', background: 'linear-gradient(135deg,#2f9e5b,#1a5c35)', display: 'grid', placeItems: 'center', fontSize: 26, fontWeight: 700, flexShrink: 0, color: '#fff' }}>
              {(user?.name || 'G')[0].toUpperCase()}
            </div>
            <div>
              <p style={{ fontSize: 20, fontWeight: 700, marginBottom: 2 }}>{user?.name || 'Guest'}</p>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,.45)' }}>{user?.email || 'Not signed in'}</p>
            </div>
          </div>

          {/* Editable name row */}
          <div style={{ padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,.40)', width: 120, flexShrink: 0 }}>Full Name</span>
              {editingName ? (
                <div style={{ flex: 1, display: 'flex', gap: 8 }}>
                  <input value={nameInput} onChange={e => setNameInput(e.target.value)}
                    style={{ ...inputStyle, flex: 1 }} autoFocus
                    onFocus={e => e.target.style.borderColor = 'rgba(255,255,255,.35)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,.10)'}
                    onKeyDown={e => { if (e.key === 'Enter') handleSaveName(); if (e.key === 'Escape') setEditingName(false) }}
                  />
                  <Btn onClick={handleSaveName} disabled={saving}>{saving ? 'Saving…' : 'Save'}</Btn>
                  <Btn onClick={() => setEditingName(false)}>Cancel</Btn>
                </div>
              ) : (
                <>
                  <span style={{ flex: 1, fontSize: 15, color: 'rgba(255,255,255,.88)', fontWeight: 500 }}>{user?.name || '—'}</span>
                  <button onClick={() => { setNameInput(user?.name || ''); setEditingName(true) }}
                    style={{ fontSize: 13, color: '#2f9e5b', fontWeight: 600, cursor: 'pointer', padding: '4px 12px', borderRadius: 8, background: 'rgba(47,158,91,.10)', border: '1px solid rgba(47,158,91,.20)' }}>
                    Edit
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Static rows */}
          {[
            ['Email', user?.email || '—'],
            ['Member Since', user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently'],
            ['Current Plan', planInfo.name],
          ].map(([label, value]) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,.06)', gap: 12 }}>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,.40)', width: 120, flexShrink: 0 }}>{label}</span>
              <span style={{ flex: 1, fontSize: 15, color: 'rgba(255,255,255,.88)', fontWeight: 500 }}>{value}</span>
              {label === 'Current Plan' && (
                <button onClick={() => setActive('membership')}
                  style={{ fontSize: 13, color: '#2f9e5b', fontWeight: 600, cursor: 'pointer', padding: '4px 12px', borderRadius: 8, background: 'rgba(47,158,91,.10)', border: '1px solid rgba(47,158,91,.20)' }}>
                  Change
                </button>
              )}
            </div>
          ))}

          <div style={{ marginTop: 24, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Btn onClick={() => navigate('/profiles')}>Manage Profiles</Btn>
            <Btn danger onClick={() => { authService.signOut(); navigate('/signin') }}>
              <LogOut size={15} /> Sign Out
            </Btn>
          </div>
        </div>
      )

      case 'membership': return (
        <div>
          <h2 style={sh}>Membership & Billing</h2>
          <div style={{ background: 'rgba(47,158,91,.08)', border: '1px solid rgba(47,158,91,.22)', borderRadius: 18, padding: '24px 28px', marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
              <span style={{ width: 32, height: 32, borderRadius: '50%', background: '#2f9e5b', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                <Check size={16} style={{ color: '#fff', strokeWidth: 3 }} />
              </span>
              <div>
                <p style={{ fontSize: 18, fontWeight: 700 }}>{planInfo.name} Plan</p>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,.50)', marginTop: 2 }}>{planInfo.price} / month</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 24, marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(47,158,91,.18)', flexWrap: 'wrap' }}>
              {[[planInfo.quality, 'Video Quality'], [planInfo.screens, 'Simultaneous'], ['Mobile Downloads', 'Offline']].map(([v, k]) => (
                <div key={k}><p style={{ fontSize: 16, fontWeight: 700 }}>{v}</p><p style={{ fontSize: 12, color: 'rgba(255,255,255,.40)' }}>{k}</p></div>
              ))}
            </div>
          </div>
          <div style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 14, padding: '18px 22px', marginBottom: 24 }}>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,.40)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.06em' }}>Payment Method</p>
            <p style={{ fontSize: 15, fontWeight: 600, color: 'rgba(255,255,255,.50)' }}>No payment method on file</p>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Btn onClick={() => navigate('/plans')}>Change Plan</Btn>
            <Btn>Update Payment</Btn>
            <Btn danger>Cancel Subscription</Btn>
          </div>
        </div>
      )

      case 'playback': return (
        <div>
          <h2 style={sh}>Playback Settings</h2>
          <Toggle label="Autoplay next episode"  desc="Automatically play the next episode in a series" value={prefs.autoplay}  onChange={set('autoplay')} />
          <Toggle label="HD video quality"        desc="Use HD when available (uses more data)"           value={prefs.hd}        onChange={set('hd')} />
          <Toggle label="Subtitles by default"    desc="Show subtitles when available"                    value={prefs.subtitles} onChange={set('subtitles')} />
          <Toggle label="Reduce data usage"       desc="Lower quality to save bandwidth"                  value={prefs.dataUsage} onChange={set('dataUsage')} />
        </div>
      )

      case 'language': return (
        <div>
          <h2 style={sh}>Language</h2>
          {[['App Language', 'Change the interface language'], ['Subtitle Language', 'Default language for subtitles'], ['Audio Default', 'Preferred audio track language']].map(([label, desc]) => (
            <div key={label} style={{ padding: '18px 0', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 500 }}>{label}</p>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,.40)', marginTop: 2 }}>{desc}</p>
                </div>
                <select style={{ background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.10)', borderRadius: 10, padding: '8px 14px', fontSize: 14, color: '#fff', cursor: 'pointer', outline: 'none' }}>
                  {['English', 'French', 'German', 'Spanish', 'Japanese'].map(l => <option key={l} style={{ background: '#17181a' }}>{l}</option>)}
                </select>
              </div>
            </div>
          ))}
        </div>
      )

      case 'devices': return (
        <div>
          <h2 style={sh}>Active Devices</h2>
          {[
            { name: 'This Browser', note: 'Current device · Active now', current: true },
            { name: 'NOVA TV App',  note: 'Smart TV · Last seen recently', current: false },
            { name: 'NOVA Mobile',  note: 'Mobile device · Last seen recently', current: false },
          ].map(d => (
            <div key={d.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 0', borderBottom: '1px solid rgba(255,255,255,.06)', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(255,255,255,.06)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                  <Tv size={18} style={{ color: 'rgba(255,255,255,.60)' }} />
                </div>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 500, marginBottom: 2 }}>{d.name}</p>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,.38)' }}>{d.note}</p>
                </div>
              </div>
              {d.current
                ? <span style={{ fontSize: 11, fontWeight: 600, color: '#2f9e5b', background: 'rgba(47,158,91,.12)', border: '1px solid rgba(47,158,91,.25)', borderRadius: 6, padding: '3px 10px' }}>Current</span>
                : <button onClick={() => { authService.signOut(); navigate('/signin') }} style={{ fontSize: 13, color: '#f87171', fontWeight: 600, cursor: 'pointer', padding: '4px 12px', borderRadius: 8, background: 'rgba(248,113,113,.08)', border: '1px solid rgba(248,113,113,.18)' }}>Sign out</button>}
            </div>
          ))}
          <div style={{ marginTop: 20 }}>
            <Btn danger onClick={() => { authService.signOut(); navigate('/signin') }}>Sign Out All Devices</Btn>
          </div>
        </div>
      )

      case 'security': return (
        <div>
          <h2 style={sh}>Security</h2>
          <ChangePasswordForm />
          <div style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 16, overflow: 'hidden', marginTop: 28 }}>
            <div style={{ padding: '18px 22px', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
              <p style={{ fontSize: 15, fontWeight: 600 }}>Recent Sign-in Activity</p>
            </div>
            {[
              { when: 'Just now',        where: 'Browser · NOVA Web', loc: 'Your location' },
              { when: 'Earlier today',   where: 'NOVA App',           loc: 'Your location' },
            ].map((a, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 22px', borderBottom: i < 1 ? '1px solid rgba(255,255,255,.05)' : 'none', gap: 12 }}>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 500 }}>{a.where}</p>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,.38)', marginTop: 2 }}>{a.loc}</p>
                </div>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,.38)', flexShrink: 0 }}>{a.when}</span>
              </div>
            ))}
          </div>
        </div>
      )

      default: return null
    }
  }

  return (
    <div className="page-top" style={{ paddingBottom: 140 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 var(--pad)' }}>
        <h1 style={{ fontSize: 'clamp(24px,4vw,48px)', fontWeight: 800, letterSpacing: '-.02em', marginBottom: 'clamp(24px,3vw,44px)' }}>
          Account Settings
        </h1>
        <div className="acct-layout">
          <nav aria-label="Account sections" className="acct-sidebar">
            {SECTIONS.map(({ id, label, icon: Icon }) => {
              const on = active === id
              return (
                <button key={id} onClick={() => setActive(id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '12px 14px', borderRadius: 12,
                    fontSize: 14, fontWeight: on ? 600 : 400,
                    cursor: 'pointer', transition: 'all .15s',
                    textAlign: 'left', width: '100%',
                    background: on ? 'rgba(255,255,255,.10)' : 'transparent',
                    color: on ? '#fff' : 'rgba(255,255,255,.50)',
                    border: on ? '1px solid rgba(255,255,255,.12)' : '1px solid transparent',
                  }}
                  onMouseEnter={e => { if (!on) { e.currentTarget.style.background = 'rgba(255,255,255,.05)'; e.currentTarget.style.color = '#fff' } }}
                  onMouseLeave={e => { if (!on) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,.50)' } }}
                >
                  <Icon size={16} style={{ flexShrink: 0, opacity: on ? 1 : 0.6 }} />
                  <span style={{ flex: 1 }}>{label}</span>
                  {on && <ChevronRight size={14} style={{ opacity: 0.4, flexShrink: 0 }} />}
                </button>
              )
            })}
          </nav>
          <div className="acct-content">
            {content()}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Change Password sub-form ── */
function ChangePasswordForm() {
  const [open,    setOpen]    = useState(false)
  const [form,    setForm]    = useState({ current: '', next: '', confirm: '' })
  const [msg,     setMsg]     = useState('')
  const [error,   setError]   = useState('')
  const [saving,  setSaving]  = useState(false)

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setError(''); setMsg('')
    if (form.next !== form.confirm) { setError('New passwords do not match.'); return }
    if (form.next.length < 6) { setError('Password must be at least 6 characters.'); return }
    setSaving(true)
    try {
      await api.post('/auth/change-password', { currentPassword: form.current, newPassword: form.next })
      setMsg('Password changed successfully.')
      setForm({ current: '', next: '', confirm: '' })
      setOpen(false)
    } catch (err) {
      setError(err.message || 'Failed to change password.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      {!open ? (
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button onClick={() => setOpen(true)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, height: 44, padding: '0 24px', borderRadius: 999, fontSize: 14, fontWeight: 600, cursor: 'pointer', background: 'rgba(255,255,255,.07)', color: 'rgba(255,255,255,.85)', border: '1px solid rgba(255,255,255,.12)' }}>
            Change Password
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 18, padding: 24, display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 400 }}>
          <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Change Password</p>
          {[['current', 'Current Password'], ['next', 'New Password'], ['confirm', 'Confirm New Password']].map(([name, label]) => (
            <div key={name}>
              <label style={{ display: 'block', fontSize: 12, color: 'rgba(255,255,255,.45)', marginBottom: 5 }}>{label}</label>
              <input type="password" name={name} value={form[name]} onChange={handleChange} required
                style={{ width: '100%', background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.10)', borderRadius: 10, padding: '9px 13px', color: '#fff', fontSize: 14, outline: 'none' }} />
            </div>
          ))}
          {error && <p style={{ fontSize: 13, color: '#f87171', background: 'rgba(248,113,113,.08)', border: '1px solid rgba(248,113,113,.18)', borderRadius: 8, padding: '8px 12px' }}>{error}</p>}
          {msg   && <p style={{ fontSize: 13, color: '#4ade80', background: 'rgba(74,222,128,.08)', border: '1px solid rgba(74,222,128,.18)', borderRadius: 8, padding: '8px 12px' }}>{msg}</p>}
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="submit" disabled={saving}
              style={{ flex: 1, height: 42, borderRadius: 999, background: '#fff', color: '#111', fontWeight: 700, fontSize: 14, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? .7 : 1 }}>
              {saving ? 'Saving…' : 'Update Password'}
            </button>
            <button type="button" onClick={() => setOpen(false)}
              style={{ height: 42, padding: '0 18px', borderRadius: 999, background: 'rgba(255,255,255,.07)', color: 'rgba(255,255,255,.7)', fontSize: 14, fontWeight: 600, cursor: 'pointer', border: '1px solid rgba(255,255,255,.10)' }}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
