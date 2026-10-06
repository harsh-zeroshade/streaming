import { User } from 'lucide-react'

export default function ProfileCard({ profile, onClick, size = 'lg' }) {
  const isLarge = size === 'lg'

  return (
    <button
      onClick={onClick}
      className="group flex flex-col items-center gap-3 cursor-pointer"
      aria-label={`Select profile ${profile.name}`}
    >
      <div
        className={[
          'rounded-xl overflow-hidden ring-2 ring-transparent',
          'group-hover:ring-white group-hover:scale-105 transition-all duration-200',
          isLarge ? 'w-32 h-32 md:w-40 md:h-40' : 'w-20 h-20',
        ].join(' ')}
        style={{ boxShadow: `0 0 0 0 ${profile.color}` }}
      >
        {profile.avatar ? (
          <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ backgroundColor: profile.color + '40' }}
          >
            <User size={isLarge ? 40 : 24} className="text-white/50" />
          </div>
        )}
      </div>
      <span className={`text-white/70 group-hover:text-white transition-colors font-medium ${isLarge ? 'text-base' : 'text-sm'}`}>
        {profile.name}
      </span>
      {profile.isKids && (
        <span className="text-xs text-amber-400 -mt-2">Kids</span>
      )}
    </button>
  )
}
