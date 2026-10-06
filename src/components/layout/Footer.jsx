import { Link } from 'react-router-dom'

const NAV_COLS = [
  {
    heading: 'Browse',
    links: [
      { label: 'Home',          to: '/'            },
      { label: 'Movies',        to: '/movies'       },
      { label: 'TV Shows',      to: '/series'       },
      { label: 'New & Popular', to: '/new-popular'  },
      { label: 'My List',       to: '/my-list'      },
    ],
  },
  {
    heading: 'Account',
    links: [
      { label: 'Sign In',  to: '/login'    },
      { label: 'Sign Up',  to: '/register' },
      { label: 'Account',  to: '/account'  },
      { label: 'Plans',    to: '/plans'    },
    ],
  },
  {
    heading: 'Support',
    links: [
      { label: 'Help Center',       to: '/help' },
      { label: 'Contact Us',        to: '/help' },
      { label: 'Privacy',           to: '/help' },
      { label: 'Terms',             to: '/help' },
      { label: 'Cookie Preferences',to: '/help' },
    ],
  },
]

const PLATFORMS = ['Smart TV', 'iOS', 'Android', 'Web', 'Chromecast']

const SOCIAL = [
  {
    label: 'YouTube',
    icon: <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 18, height: 18 }}><path d="M21.8 8s-.2-1.4-.8-2c-.8-.8-1.7-.8-2-.9C16.8 5 12 5 12 5s-4.8 0-7 .1c-.4.1-1.3.1-2 .9-.6.6-.8 2-.8 2S2 9.6 2 11.2v1.5c0 1.6.2 3.2.2 3.2s.2 1.4.8 2c.8.8 1.8.8 2.3.8C6.8 19 12 19 12 19s4.8 0 7-.1c.4-.1 1.3-.1 2-.9.6-.6.8-2 .8-2s.2-1.6.2-3.2v-1.5C22 9.6 21.8 8 21.8 8zM9.7 14.5V9l5.4 2.8-5.4 2.7z"/></svg>,
  },
  {
    label: 'Instagram',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 18, height: 18 }}><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>,
  },
  {
    label: 'Twitter / X',
    icon: <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 18, height: 18 }}><path d="M18.3 5h2.7l-5.9 6.7 6.9 9.3h-5.4l-4.2-5.6-4.9 5.6H5l6.3-7.2L4.7 5h5.5l3.9 5.1L18.3 5zm-1 14h1.5L7.4 6.5H5.8L17.3 19z"/></svg>,
  },
  {
    label: 'Facebook',
    icon: <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 18, height: 18 }}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>,
  },
]

export default function Footer() {
  return (
    <footer className="ft-root">

      {/* ── Main grid: brand left, nav columns right ── */}
      <div className="ft-inner ft-top">

        {/* Brand block */}
        <div className="ft-brand">
          <Link to="/" className="ft-logo">NOVA</Link>
          <p className="ft-tagline">
            Premium streaming for cinematic stories.<br />
            Watch on all your screens, anytime.
          </p>
          {/* Social icons */}
          <div className="ft-social">
            {SOCIAL.map(({ label, icon }) => (
              <button key={label} aria-label={label} className="ft-soc-btn">
                {icon}
              </button>
            ))}
          </div>
        </div>

        {/* Nav columns */}
        <div className="ft-nav">
          {NAV_COLS.map(col => (
            <div key={col.heading} className="ft-col">
              <p className="ft-col-head">{col.heading}</p>
              <ul className="ft-col-links">
                {col.links.map(link => (
                  <li key={link.label}>
                    <Link to={link.to} className="ft-link">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ── Platform chips ── */}
      <div className="ft-inner ft-platforms">
        <span className="ft-platform-label">Available on</span>
        {PLATFORMS.map(p => (
          <span key={p} className="ft-chip">{p}</span>
        ))}
      </div>

      {/* ── Bottom bar ── */}
      <div className="ft-inner ft-bottom">
        <p className="ft-disclaimer">
          NOVA does not host, store, or distribute any media files. All content is sourced from licensed third-party providers.
        </p>
        <p className="ft-copy">© {new Date().getFullYear()} NOVA Entertainment</p>
      </div>

    </footer>
  )
}
