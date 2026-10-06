import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export default function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border border-white/10 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/3 transition-colors cursor-pointer"
        aria-expanded={open}
      >
        <span className="text-sm font-medium text-white/90 pr-4">{question}</span>
        <ChevronDown
          size={16}
          className={[
            'flex-none text-white/40 transition-transform duration-200',
            open ? 'rotate-180' : '',
          ].join(' ')}
          aria-hidden="true"
        />
      </button>
      {open && (
        <div className="px-5 pb-4">
          <p className="text-sm text-white/60 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  )
}
