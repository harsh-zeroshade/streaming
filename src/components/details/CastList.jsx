/** Reference .d2-cast + .chips — cast label + chip grid */
export default function CastList({ cast = [] }) {
  if (!cast.length) return null
  return (
    <div style={{ marginTop: 22 }}>
      <p style={{
        fontSize: 12, letterSpacing: '.10em', fontWeight: 700,
        color: 'var(--muted)', marginBottom: 10, textTransform: 'uppercase',
      }}>Cast</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {cast.map(name => (
          <span key={name} style={{
            border: '1px solid rgba(255,255,255,.15)',
            background: 'rgba(255,255,255,.05)',
            borderRadius: 6, padding: '7px 12px',
            fontSize: 13, color: 'rgba(255,255,255,.80)',
          }}>
            {name}
          </span>
        ))}
      </div>
    </div>
  )
}
