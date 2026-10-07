import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { authService } from '../../services/authService'

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

export default function SignUp() {
  const navigate = useNavigate()
  const [form, setForm]     = useState({ name: '', email: '', password: '', consent: false })
  const [showPw, setShowPw] = useState(false)
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.name || !form.email || !form.password) { setError('All fields are required.'); return }
    if (!form.consent) { setError('Please agree to the terms to continue.'); return }
    setLoading(true)
    try { await authService.signUp(form.name, form.email, form.password); navigate('/plans', { replace: true }) }
    catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0 }}>
        <img src="https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=1400&q=60" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: .08 }} aria-hidden="true" />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(23,24,26,.85)' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
        <Link to="/" style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
          <span style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-.02em' }}>NOVA</span>
        </Link>

        <div style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 24, padding: 'clamp(24px,5vw,40px)', backdropFilter: 'blur(20px)' }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Create Account</h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,.40)', marginBottom: 24 }}>Start your free 30-day trial.</p>

          <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { id: 'name',     label: 'Full Name', type: 'text',     ac: 'name',          ph: 'Your name' },
              { id: 'email',    label: 'Email',     type: 'email',    ac: 'email',         ph: 'you@example.com' },
            ].map(({ id, label, type, ac, ph }) => (
              <div key={id}>
                <label htmlFor={id} style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,.55)', marginBottom: 6 }}>{label}</label>
                <input id={id} name={id} type={type} value={form[id]} onChange={handleChange}
                  autoComplete={ac} placeholder={ph} required style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'rgba(255,255,255,.35)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,.10)'} />
              </div>
            ))}

            <div>
              <label htmlFor="password" style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,.55)', marginBottom: 6 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input id="password" name="password" type={showPw ? 'text' : 'password'}
                  value={form.password} onChange={handleChange}
                  autoComplete="new-password" placeholder="Create a password" required
                  style={{ ...inputStyle, paddingRight: 44 }}
                  onFocus={e => e.target.style.borderColor = 'rgba(255,255,255,.35)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,.10)'} />
                <button type="button" onClick={() => setShowPw(p => !p)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,.35)', cursor: 'pointer' }}
                  aria-label={showPw ? 'Hide password' : 'Show password'}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
              <input name="consent" type="checkbox" checked={form.consent} onChange={handleChange}
                style={{ marginTop: 2, width: 16, height: 16, accentColor: '#fff', flexShrink: 0, cursor: 'pointer' }} />
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,.40)', lineHeight: 1.5 }}>
                I agree to NOVA's <span style={{ color: 'rgba(255,255,255,.70)' }}>Terms of Service</span> and <span style={{ color: 'rgba(255,255,255,.70)' }}>Privacy Policy</span>.
              </span>
            </label>

            {error && (
              <p style={{ fontSize: 13, color: '#f87171', background: 'rgba(248,113,113,.08)', border: '1px solid rgba(248,113,113,.20)', borderRadius: 10, padding: '10px 14px' }}>{error}</p>
            )}

            <button type="submit" disabled={loading}
              style={{ height: 48, borderRadius: 999, background: '#fff', color: '#111', fontWeight: 700, fontSize: 15, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? .7 : 1 }}>
              {loading ? 'Creating…' : 'Create Account'}
            </button>
          </form>

          <p style={{ marginTop: 24, textAlign: 'center', fontSize: 13, color: 'rgba(255,255,255,.4)' }}>
            Already have an account?{' '}
            <Link to="/signin" style={{ color: 'rgba(255,255,255,.80)', fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>
        </div>
      </div>
    </div>
  )
}
