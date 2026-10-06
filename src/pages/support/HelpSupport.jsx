import { useState } from 'react'
import SearchBar from '../../components/search/SearchBar'
import HelpCategory from '../../components/support/HelpCategory'
import FAQItem from '../../components/support/FAQItem'
import { faqs, helpCategories } from '../../data/faqs'

export default function HelpSupport() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState(null)

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = !searchQuery ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !activeCategory || faq.category.toLowerCase() === activeCategory.toLowerCase()
    return matchesSearch && matchesCategory
  })

  return (
    <div style={{ minHeight: '100vh', paddingTop: 'clamp(80px,10vw,120px)', paddingBottom: 120 }}>
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 var(--pad)' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(28px,4vw,48px)' }}>
          <h1 style={{ fontSize: 'clamp(24px,4vw,42px)', fontWeight: 800, letterSpacing: '-.02em', marginBottom: 10 }}>Help &amp; Support</h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,.4)', marginBottom: 24 }}>How can we help you today?</p>
          <div style={{ maxWidth: 520, margin: '0 auto' }}>
            <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search help articles…" />
          </div>
        </div>

        {/* Categories */}
        <section style={{ marginBottom: 'clamp(28px,4vw,48px)' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Browse by Topic</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 10 }}>
            {helpCategories.map(cat => (
              <HelpCategory key={cat.id} category={cat}
                onClick={() => setActiveCategory(activeCategory === cat.name ? null : cat.name)} />
            ))}
          </div>
          {activeCategory && (
            <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,.40)' }}>
                Filtering: <span style={{ color: '#fff', fontWeight: 600 }}>{activeCategory}</span>
              </span>
              <button onClick={() => setActiveCategory(null)}
                style={{ fontSize: 12, color: 'rgba(255,255,255,.35)', cursor: 'pointer', textDecoration: 'underline' }}>
                Clear
              </button>
            </div>
          )}
        </section>

        {/* FAQ */}
        <section style={{ marginBottom: 'clamp(28px,4vw,48px)' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>
            Frequently Asked Questions
            {filteredFaqs.length !== faqs.length && (
              <span style={{ fontSize: 13, fontWeight: 400, color: 'rgba(255,255,255,.35)', marginLeft: 8 }}>({filteredFaqs.length} results)</span>
            )}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filteredFaqs.length > 0
              ? filteredFaqs.map(faq => <FAQItem key={faq.id} question={faq.question} answer={faq.answer} />)
              : <p style={{ fontSize: 14, color: 'rgba(255,255,255,.30)', padding: '32px 0', textAlign: 'center' }}>No articles match your search.</p>
            }
          </div>
        </section>

        {/* Contact */}
        <section style={{
          background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)',
          borderRadius: 20, padding: 'clamp(24px,4vw,40px)', textAlign: 'center',
        }}>
          <h2 style={{ fontSize: 'clamp(17px,2vw,22px)', fontWeight: 700, marginBottom: 8 }}>Still need help?</h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,.40)', marginBottom: 24 }}>Our support team is available 24/7.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12 }}>
            {[
              { label: 'Contact Support', primary: true },
              { label: 'Community Forum', primary: false },
            ].map(({ label, primary }) => (
              <button key={label}
                style={{
                  height: 44, padding: '0 24px', borderRadius: 999,
                  background: primary ? '#fff' : 'rgba(255,255,255,.07)',
                  color: primary ? '#111' : 'rgba(255,255,255,.80)',
                  fontWeight: 600, fontSize: 14, border: primary ? 'none' : '1px solid rgba(255,255,255,.10)',
                  cursor: 'pointer', transition: 'opacity .2s',
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '.85'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >{label}</button>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}
