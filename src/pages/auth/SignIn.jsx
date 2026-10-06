import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { authService } from '../../services/authService'

/* Shared input style */
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

export default function SignIn() {
  const navigate = useNavigate()
  const [form, setForm]   = useState({ email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.email || !form.password) { setError('Please fill in all fields.'); return }
    setLoading(true)
    try { await authService.signIn(form.email, form.password); navigate('/') }
    catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight: '100svh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px 16px', background: 'var(--bg)', position: 'relative' }}>
      {/* Faint background image */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0 }}>
        <img src="https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1400&q=60" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: .08 }} aria-hidden="true" />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(23,24,26,.85)' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 400 }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
          <span style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-.02em' }}>NOVA</span>
        </Link>

        {/* Card */}
        <div style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 24, padding: 'clamp(24px,5vw,40px)', backdropFilter: 'blur(20px)' }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>Sign In</h1>

          <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label htmlFor="email" style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,.55)', marginBottom: 6 }}>Email</label>
              <input id="email" name="email" type="email" value={form.email} onChange={handleChange}
                autoComplete="email" placeholder="you@example.com" required style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'rgba(255,255,255,.35)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,.10)'} />
            </div>

            <div>
              <label htmlFor="password" style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,.55)', marginBottom: 6 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input id="password" name="password" type={showPw ? 'text' : 'password'}
                  value={form.password} onChange={handleChange}
                  autoComplete="current-password" placeholder="••••••••" required
                  style={{ ...inputStyle, paddingRight: 44 }}
                  onFocus={e => e.target.style.borderColor = 'rgba(255,255,255,.35)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,.10)'} />
                <button type="button" onClick={() => setShowPw(p => !p)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,.35)', cursor: 'pointer' }}
                  aria-label={showPw ? 'Hide password' : 'Show password'}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <div style={{ textAlign: 'right', marginTop: 6 }}>
                <button type="button" style={{ fontSize: 12, color: 'rgba(255,255,255,.45)', cursor: 'pointer' }}>Forgot password?</button>
              </div>
            </div>

            {error && (
              <p style={{ fontSize: 13, color: '#f87171', background: 'rgba(248,113,113,.08)', border: '1px solid rgba(248,113,113,.20)', borderRadius: 10, padding: '10px 14px' }}>{error}</p>
            )}

            <button type="submit" disabled={loading}
              style={{ height: 48, borderRadius: 999, background: '#fff', color: '#111', fontWeight: 700, fontSize: 15, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? .7 : 1, transition: 'opacity .2s' }}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p style={{ marginTop: 24, textAlign: 'center', fontSize: 13, color: 'rgba(255,255,255,.4)' }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: 'rgba(255,255,255,.80)', fontWeight: 600 }}>Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
