import { useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { authService } from '../../services/authService'

export default function Navbar() {
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef(null)
  const navigate = useNavigate()
  const user = authService.getCurrentUser()

  const handleSignOut = () => { authService.signOut(); navigate('/signin') }

  return (
    <header>
      {/* Logo — exact reference .logo structure */}
      <Link to="/" className="logo" aria-label="NOVA home">
        <svg viewBox="0 0 54 54">
          <path d="M2 14 11 2l5 4-4 9zM18 4l8-3 3 6-7 6zM32 2l9 3 1 11-9-2zM47 8l6 3-3 8h-6zM2 20h44l6 6v26H2zM14 36a7 7 0 1 0 14 0 7 7 0 0 0-14 0zm24-6 8 12H30z" fillRule="evenodd" />
        </svg>
      </Link>

      {/* Nav — exact reference nav structure */}
      <nav aria-label="Main">
        <NavLink
          to="/"
          end
          className={({ isActive }) => isActive ? 'active' : ''}
          aria-label="Home"
        >
          {/* icon */}
          <svg className="ni" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 11 12 3l9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />
          </svg>
          <span className="nl">Home</span>
        </NavLink>

        <NavLink
          to="/movies"
          className={({ isActive }) => isActive ? 'active' : ''}
          aria-label="Movies"
        >
          <svg className="ni" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 9h16v11H4zM4 9l2.5-5h3L7 9M10 9l2.5-5h3L13 9M16 9l2.5-5H20v5" />
          </svg>
          <span className="nl">Movies</span>
        </NavLink>

        <NavLink
          to="/series"
          className={({ isActive }) => isActive ? 'active' : ''}
          aria-label="Shows"
        >
          <svg className="ni" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="7" width="18" height="13" rx="2" />
            <path d="m8 3 4 4 4-4" />
          </svg>
          <span className="nl">Shows</span>
        </NavLink>

        <NavLink
          to="/my-list"
          className={({ isActive }) => isActive ? 'active' : ''}
          aria-label="My List"
        >
          <svg className="ni" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 3h12v18l-6-4-6 4z" />
          </svg>
          <span className="nl">My List</span>
        </NavLink>

        <span className="sep" aria-hidden="true" />

        {/* Search icon */}
        <button
          className="icon"
          onClick={() => navigate('/search')}
          aria-label="Search"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
        </button>

        {/* Settings / profile dropdown */}
        <div ref={profileRef} style={{ position: 'relative', display: 'contents' }}>
          <button
            className="icon"
            style={{ position: 'relative' }}
            onClick={() => setProfileOpen(p => !p)}
            aria-label="Settings"
            aria-expanded={profileOpen}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3h0a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9v0a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
            </svg>
          </button>

          {profileOpen && (
            <>
              {/* Tap-outside backdrop */}
              <div
                style={{ position: 'fixed', inset: 0, zIndex: 58 }}
                onClick={() => setProfileOpen(false)}
                aria-hidden="true"
              />
              {/* Dropdown — CSS class handles desktop vs mobile positioning */}
              <div className="nav-dropdown">

                {/* User header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,.07)' }}>
                  {/* Avatar circle */}
                  <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'grid', placeItems: 'center', flexShrink: 0, fontSize: 16, fontWeight: 700, color: '#fff' }}>
                    {(user?.name || 'G')[0].toUpperCase()}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontWeight: 700, fontSize: 14, lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name || 'Guest'}</p>
                    {user?.email && <p style={{ fontSize: 11, color: 'rgba(255,255,255,.38)', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</p>}
                  </div>
                </div>

                {/* Menu items */}
                <div style={{ padding: '6px 6px 4px' }}>
                  {[
                    { to: '/profiles', label: 'Switch Profile',   icon: <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /> },
                    { to: '/account',  label: 'Account Settings', icon: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></> },
                    { to: '/plans',    label: 'Plans & Billing',  icon: <><rect x="1" y="4" width="22" height="16" rx="2"/><path d="M1 10h22"/></> },
                  ].map(({ to, label, icon }) => (
                    <Link key={to} to={to} onClick={() => setProfileOpen(false)}
                      style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,.72)', textDecoration: 'none', borderRadius: 10, transition: 'background .15s, color .15s' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,.07)'; e.currentTarget.style.color = '#fff' }}
                      onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.color = 'rgba(255,255,255,.72)' }}
                    >
                      <svg viewBox="0 0 24 24" style={{ width: 16, height: 16, fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', flexShrink: 0, opacity: .65 }}>{icon}</svg>
                      {label}
                    </Link>
                  ))}

                  {/* Divider + Sign Out */}
                  <div style={{ borderTop: '1px solid rgba(255,255,255,.06)', margin: '4px 0' }} />
                  <button onClick={handleSignOut}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '11px 12px', fontSize: 14, fontWeight: 600, color: '#f87171', borderRadius: 10, transition: 'background .15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(248,113,113,.1)'}
                    onMouseLeave={e => e.currentTarget.style.background = ''}
                  >
                    <svg viewBox="0 0 24 24" style={{ width: 16, height: 16, fill: 'none', stroke: '#f87171', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', flexShrink: 0 }}>
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
                    </svg>
                    Sign Out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
