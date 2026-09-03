import { Link } from 'react-router-dom'

function Logo({ className = '', compact = false }) {
  return (
    <Link to="/" className={`group inline-flex items-center gap-2.5 ${className}`} aria-label="PlacePro home">
      <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-moss-800 transition-transform duration-300 group-hover:scale-105">
        <svg width="20" height="20" viewBox="0 0 32 32" fill="none" aria-hidden="true">
          <path
            d="M7 10.5c0-1.4 1.1-2.5 2.5-2.5h13c1.4 0 2.5 1.1 2.5 2.5v11c0 1.4-1.1 2.5-2.5 2.5h-13c-1.4 0-2.5-1.1-2.5-2.5v-11Z"
            stroke="#5f9a7d"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path d="M12 14.5h8M12 17.5h5" stroke="#f0b84f" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </span>
      {!compact && (
        <span className="font-display text-lg font-semibold tracking-tight text-ink-950">
          Place<span className="text-moss-600">Pro</span>
        </span>
      )}
    </Link>
  )
}

export default Logo
