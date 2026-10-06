import { Check } from 'lucide-react'
import Button from '../common/Button'

export default function PlanCard({ plan, selected, onSelect }) {
  const features = [
    { label: plan.resolution, show: true },
    { label: `Watch on ${plan.screens} screen${plan.screens > 1 ? 's' : ''} at once`, show: true },
    { label: 'Ad-free streaming', show: !plan.ads },
    { label: 'Downloads for offline viewing', show: plan.downloads },
    { label: 'Dolby Atmos audio', show: plan.dolbyAtmos },
    { label: 'Dolby Vision HDR', show: plan.dolbyVision },
  ].filter((f) => f.show)

  return (
    <div
      className={[
        'relative flex flex-col rounded-2xl border-2 p-6 transition-all duration-200',
        selected
          ? 'border-violet-500 bg-violet-500/10 shadow-xl shadow-violet-900/30'
          : `${plan.color} bg-white/3 hover:bg-white/6`,
        plan.recommended ? 'ring-1 ring-violet-500/50' : '',
      ].join(' ')}
    >
      {plan.badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-violet-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
            {plan.badge}
          </span>
        </div>
      )}

      <div className="mb-4">
        <h3 className="text-xl font-bold text-white">{plan.name}</h3>
        <p className="text-white/40 text-sm mt-0.5">{plan.tagline}</p>
      </div>

      <div className="mb-6">
        <span className="text-4xl font-black text-white">${plan.price}</span>
        <span className="text-white/50 text-sm ml-1">/{plan.billingPeriod}</span>
      </div>

      <ul className="space-y-2.5 flex-1 mb-6">
        {features.map((f) => (
          <li key={f.label} className="flex items-center gap-2.5 text-sm text-white/80">
            <Check size={14} className="text-violet-400 flex-none" aria-hidden="true" />
            {f.label}
          </li>
        ))}
        {plan.ads && (
          <li className="flex items-center gap-2.5 text-sm text-white/40">
            <span className="w-3.5 h-px bg-white/20 flex-none" />
            Ad-supported
          </li>
        )}
      </ul>

      <Button
        variant={selected ? 'primary' : 'secondary'}
        onClick={() => onSelect(plan)}
        className="w-full justify-center"
      >
        {selected ? 'Current Plan' : 'Choose Plan'}
      </Button>
    </div>
  )
}
