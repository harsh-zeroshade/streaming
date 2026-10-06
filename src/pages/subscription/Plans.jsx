import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PlanCard from '../../components/subscription/PlanCard'
import FAQItem from '../../components/support/FAQItem'
import { plans } from '../../data/plans'
import { api } from '../../services/apiService'
import { authService } from '../../services/authService'

const planFaqs = [
  { question: 'Can I switch plans at any time?', answer: 'Yes. Plan changes take effect at the start of your next billing cycle.' },
  { question: 'Is there a free trial?', answer: 'New accounts enjoy a 30-day free trial. No credit card required to start.' },
  { question: 'What happens if I cancel?', answer: 'You keep access until the end of your current billing period. No charges after that.' },
  { question: 'Can I download content?', answer: 'Standard and Premium subscribers can download content on mobile devices for offline viewing.' },
]

export default function Plans() {
  const navigate = useNavigate()
  const user = authService.getCurrentUser()
  const [selected, setSelected] = useState(user?.plan || 'plan-standard')
  const [saving, setSaving] = useState(false)

  const handleContinue = async () => {
    setSaving(true)
    try {
      if (authService.isSignedIn()) {
        await api.post('/auth/update-plan', { plan: selected })
        const stored = authService.getCurrentUser()
        localStorage.setItem('nova_auth', JSON.stringify({ ...stored, plan: selected }))
      }
    } catch { /* proceed even if endpoint doesn't respond */ }
    finally { setSaving(false) }
    navigate('/')
  }

  return (
    <div className="page-top" style={{ paddingBottom: 'clamp(60px,8vw,120px)' }}>
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 var(--pad)' }}>

        <div style={{ textAlign: 'center', marginBottom: 'clamp(32px,5vw,56px)' }}>
          <h1 style={{ fontSize: 'clamp(26px,4vw,44px)', fontWeight: 800, letterSpacing: '-.02em', marginBottom: 12 }}>
            Choose your plan
          </h1>
          <p style={{ fontSize: 'clamp(14px,1.2vw,16px)', color: 'rgba(255,255,255,.45)', maxWidth: 400, margin: '0 auto' }}>
            All plans include access to NOVA's full library. Upgrade or cancel at any time.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 'clamp(12px,2vw,20px)',
          marginBottom: 'clamp(24px,4vw,48px)',
        }}>
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} selected={selected === plan.id} onSelect={(p) => setSelected(p.id)} />
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'clamp(40px,6vw,64px)' }}>
          <button
            onClick={handleContinue}
            disabled={saving}
            style={{
              height: 'clamp(48px,3.8vw,58px)',
              padding: '0 clamp(28px,3vw,48px)',
              borderRadius: 999,
              background: '#fff', color: '#111',
              fontWeight: 700, fontSize: 'clamp(14px,1.2vw,17px)',
              border: 'none', cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? .7 : 1, transition: 'opacity .2s',
            }}
          >
            {saving ? 'Saving…' : `Continue with ${plans.find(p => p.id === selected)?.name}`}
          </button>
        </div>

        <section>
          <h2 style={{ fontSize: 'clamp(18px,2vw,26px)', fontWeight: 700, textAlign: 'center', marginBottom: 24 }}>
            Frequently Asked Questions
          </h2>
          <div style={{ maxWidth: 600, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {planFaqs.map((faq, i) => (
              <FAQItem key={i} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
