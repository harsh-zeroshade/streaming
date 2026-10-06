import { Play, User, CreditCard, Download, Users, Wallet } from 'lucide-react'

const iconMap = { Play, User, CreditCard, Download, Users, Wallet }

export default function HelpCategory({ category, onClick }) {
  const Icon = iconMap[category.icon] || User

  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-3 p-5 bg-white/3 hover:bg-white/8 border border-white/8 hover:border-white/20 rounded-xl transition-all text-center cursor-pointer group"
      aria-label={`${category.name} help`}
    >
      <div className="w-12 h-12 bg-violet-500/15 rounded-xl flex items-center justify-center group-hover:bg-violet-500/25 transition-colors">
        <Icon size={22} className="text-violet-400" aria-hidden="true" />
      </div>
      <div>
        <p className="text-sm font-semibold text-white/90">{category.name}</p>
        <p className="text-xs text-white/40 mt-0.5">{category.description}</p>
      </div>
    </button>
  )
}
