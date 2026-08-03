export function DeliveryScooterIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* rear wheel */}
      <circle cx="30" cy="80" r="14" fill="currentColor" />
      <circle cx="30" cy="80" r="6" fill="var(--color-paper)" />
      {/* front wheel */}
      <circle cx="92" cy="80" r="14" fill="currentColor" />
      <circle cx="92" cy="80" r="6" fill="var(--color-paper)" />
      {/* scooter body */}
      <path
        d="M30 80 L50 80 L62 58 L82 58 L92 80"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* handlebar */}
      <path
        d="M82 58 L90 42"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path
        d="M83 41 L97 41"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
      />
      {/* delivery box */}
      <rect x="4" y="52" width="26" height="24" rx="3" fill="currentColor" />
      <path
        d="M12 64 L17 58 L22 64 M17 58 L17 70"
        stroke="var(--color-paper)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* rider body */}
      <path
        d="M52 78 C52 66 56 58 62 55 L70 50"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
      />
      {/* rider arm to handlebar */}
      <path d="M64 56 L78 46" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
      {/* rider head */}
      <circle cx="74" cy="38" r="9" fill="currentColor" />
      {/* rider cap brim */}
      <path d="M66 34 L82 34" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
    </svg>
  )
}
