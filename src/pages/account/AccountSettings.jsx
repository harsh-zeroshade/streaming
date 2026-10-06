import { useState } from 'react'
import { User, CreditCard, Monitor, Globe, Tv, Shield, ChevronRight, Check, LogOut } from 'lucide-react'
import { authService } from '../../services/authService'
import { useNavigate } from 'react-router-dom'

const SECTIONS = [
  { id: 'account',    label: 'Account',             icon: User },
  { id: 'membership', label: 'Membership & Billing', icon: CreditCard },
  { id: 'playback',   label: 'Playback Settings',    icon: Monitor },
  { id: 'language',   label: 'Language',              icon: Globe },
  { id: 'devices',    label: 'Devices',               icon: Tv },
  { id: 'security',   label: 'Security',              icon: Shield },
]

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

function InfoRow({ label, value, action, onAction }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,.06)', gap: 12 }}>
      <span style={{ fontSize: 13, color: 'rgba(255,255,255,.40)', width: 120, flexShrink: 0 }}>{label}</span>
      <span style={{ flex: 1, fontSize: 15, color: 'rgba(255,255,255,.88)', fontWeight: 500 }}>{value}</span>
      {action && (
        <button onClick={onAction}
          style={{ fontSize: 13, color: '#2f9e5b', fontWeight: 600, cursor: 'pointer', flexShrink: 0, padding: '4px 12px', borderRadius: 8, background: 'rgba(47,158,91,.10)', border: '1px solid rgba(47,158,91,.20)', transition: 'background .15s' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(47,158,91,.20)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(47,158,91,.10)'}
        >{action}</button>
      )}
    </div>
  )
}

function Btn({ children, danger, onClick }) {
  const [hov, setHov] = useState(false)
  return (
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        height: 44, padding: '0 24px', borderRadius: 999,
        fontSize: 14, fontWeight: 600, cursor: 'pointer',
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

export default function AccountSettings() {
  const user = authService.getCurrentUser()
  const navigate = useNavigate()
  const [active, setActive] = useState('account')
  const [prefs, setPrefs] = useState({ autoplay: true, hd: true, subtitles: false, dataUsage: false })
  const set = k => v => setPrefs(p => ({ ...p, [k]: v }))

  const content = () => {
    switch (active) {
      case 'account': return (
        <div>
          <h2 style={sh}>Account</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '20px 0 24px', borderBottom: '1px solid rgba(255,255,255,.08)', marginBottom: 8 }}>
            <div style={{ width: 68, height: 68, borderRadius: '50%', background: 'linear-gradient(135deg,#2f9e5b,#1a5c35)', display: 'grid', placeItems: 'center', fontSize: 26, fontWeight: 700, flexShrink: 0 }}>
              {(user?.name || 'G')[0].toUpperCase()}
            </div>
            <div>
              <p style={{ fontSize: 20, fontWeight: 700, marginBottom: 2 }}>{user?.name || 'Guest'}</p>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,.45)' }}>{user?.email || 'No email'}</p>
            </div>
          </div>
          <InfoRow label="Full Name"    value={user?.name || 'Guest'}  action="Edit" />
          <InfoRow label="Email"        value={user?.email || '—'} />
          <InfoRow label="Member Since" value="September 2026" />
          <InfoRow label="Current Plan" value="Standard"               action="Change" />
          <div style={{ marginTop: 24, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Btn>Edit Profile</Btn>
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
                <p style={{ fontSize: 18, fontWeight: 700 }}>Standard Plan</p>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,.50)', marginTop: 2 }}>$13.99 / month · Renews October 30, 2026</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 24, marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(47,158,91,.18)', flexWrap: 'wrap' }}>
              {[['1080p HD','Video Quality'],['2 Screens','Simultaneous'],['Mobile Downloads','Offline']].map(([v,k]) => (
                <div key={k}><p style={{ fontSize: 16, fontWeight: 700 }}>{v}</p><p style={{ fontSize: 12, color: 'rgba(255,255,255,.40)' }}>{k}</p></div>
              ))}
            </div>
          </div>
          <div style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 14, padding: '18px 22px', marginBottom: 24 }}>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,.40)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.06em' }}>Payment Method</p>
            <p style={{ fontSize: 15, fontWeight: 600 }}>Visa •••• 4242</p>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Btn>Change Plan</Btn><Btn>Update Payment</Btn><Btn danger>Cancel Subscription</Btn>
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
          {[['App Language','Change the interface language'],['Subtitle Language','Default language for subtitles'],['Audio Default','Preferred audio track language']].map(([label,desc]) => (
            <div key={label} style={{ padding: '18px 0', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 500 }}>{label}</p>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,.40)', marginTop: 2 }}>{desc}</p>
                </div>
                <select style={{ background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.10)', borderRadius: 10, padding: '8px 14px', fontSize: 14, color: '#fff', cursor: 'pointer', outline: 'none' }}>
                  {['English','French','German','Spanish','Japanese'].map(l => <option key={l} style={{ background: '#17181a' }}>{l}</option>)}
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
            { name: 'Chrome on Windows', note: 'This device · Active now', current: true },
            { name: 'NOVA TV App',        note: 'Smart TV · 2 days ago',   current: false },
            { name: 'NOVA Mobile',        note: 'iPhone · 5 days ago',     current: false },
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
                : <button style={{ fontSize: 13, color: '#f87171', fontWeight: 600, cursor: 'pointer', padding: '4px 12px', borderRadius: 8, background: 'rgba(248,113,113,.08)', border: '1px solid rgba(248,113,113,.18)' }}>Sign out</button>}
            </div>
          ))}
          <div style={{ marginTop: 20 }}><Btn danger>Sign Out All Devices</Btn></div>
        </div>
      )

      case 'security': return (
        <div>
          <h2 style={sh}>Security</h2>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 32 }}>
            <Btn>Change Password</Btn><Btn>Enable Two-Factor Auth</Btn>
          </div>
          <div style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 16, overflow: 'hidden' }}>
            <div style={{ padding: '18px 22px', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
              <p style={{ fontSize: 15, fontWeight: 600 }}>Recent Sign-in Activity</p>
            </div>
            {[
              { when: 'Today, 12:38 PM',        where: 'Windows · Chrome',    loc: 'New York, USA' },
              { when: 'Yesterday, 8:14 PM',      where: 'iPhone · Safari',     loc: 'New York, USA' },
              { when: '3 days ago, 3:02 PM',     where: 'Smart TV · NOVA App', loc: 'New York, USA' },
            ].map((a, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 22px', borderBottom: i < 2 ? '1px solid rgba(255,255,255,.05)' : 'none', gap: 12 }}>
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
    <div style={{ minHeight: '100vh', paddingTop: 'clamp(80px,10vw,120px)', paddingBottom: 140 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 var(--pad)' }}>

        <h1 style={{ fontSize: 'clamp(24px,4vw,48px)', fontWeight: 800, letterSpacing: '-.02em', marginBottom: 'clamp(24px,3vw,44px)' }}>
          Account Settings
        </h1>

        {/* Responsive layout — uses CSS classes defined in index.css */}
        <div className="acct-layout">

          {/* Sidebar nav */}
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

          {/* Content */}
          <div className="acct-content">
            {content()}
          </div>

        </div>
      </div>
    </div>
  )
}
