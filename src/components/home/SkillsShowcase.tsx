const skills = ['C / C++', 'Rust', 'Python', 'Go', 'Embedded Linux', 'Next.js']

export default function SkillsShowcase() {
  return (
    <div className="group relative w-full overflow-hidden rounded-xl border border-border/50 bg-surface/30 backdrop-blur-xl p-5 transition-all duration-300 hover:border-border/70 hover:shadow-lg hover:shadow-accent/5">
      {/* Gradient top accent */}
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-accent/40 to-transparent" />
      {/* Subtle inner glow */}
      <div className="absolute -right-16 top-1/2 h-32 w-32 -translate-y-1/2 rounded-full bg-accent/3 blur-2xl transition-opacity duration-500 group-hover:opacity-70" />

      <span className="relative block text-xs font-semibold text-muted/70 uppercase tracking-widest">
        Skills &amp; Tools
      </span>
      <div className="relative mt-3 flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span
            key={skill}
            className="inline-flex items-center rounded-full border border-border/40 bg-surface/40 px-3 py-1 text-xs text-muted/70 transition-all duration-200 hover:border-accent/20 hover:bg-accent/4 hover:text-fg/90"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  )
}
