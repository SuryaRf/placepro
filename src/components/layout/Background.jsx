/**
 * Decorative background composition shared across pages —
 * subtle abstract shapes that keep the design clean, not noisy.
 */
function Background() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* warm paper wash */}
      <div className="absolute inset-0 bg-gradient-to-b from-paper-100/70 via-paper-50 to-paper-50" />

      {/* soft moss glow top-right */}
      <div className="absolute -top-32 right-[-10%] h-[480px] w-[480px] rounded-full bg-moss-200/40 blur-[120px]" />

      {/* faint sun glow bottom-left */}
      <div className="absolute bottom-[-20%] left-[-10%] h-[420px] w-[420px] rounded-full bg-sun-300/20 blur-[120px]" />

      {/* thin vertical accent lines */}
      <div className="absolute inset-y-0 left-[8%] hidden w-px bg-ink-900/[0.04] lg:block" />
      <div className="absolute inset-y-0 right-[8%] hidden w-px bg-ink-900/[0.04] lg:block" />
    </div>
  )
}

export default Background
