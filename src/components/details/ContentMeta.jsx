/** Reference .d2 dl — key/value grid for movie/series details */
export default function ContentMeta({ item }) {
  if (!item) return null

  const rows = [
    { label: 'Director',  value: item.director },
    { label: 'Writers',   value: item.writers?.join(', ') },
    { label: 'Language',  value: item.language },
    { label: 'Country',   value: item.country },
    { label: 'Maturity',  value: item.maturity },
    { label: 'Released',  value: item.year },
  ].filter(r => r.value)

  return (
    <dl>
      {rows.map(row => (
        <div key={row.label} style={{
          display: 'grid',
          gridTemplateColumns: '92px 1fr',
          gap: 10,
          fontSize: 13.5,
          marginBottom: 14,
        }}>
          <dt style={{ color: 'var(--muted)' }}>{row.label}:</dt>
          <dd style={{ fontWeight: 600, color: '#fff' }}>{row.value}</dd>
        </div>
      ))}
    </dl>
  )
}
