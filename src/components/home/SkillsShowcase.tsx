const skills = ['C / C++', 'Rust', 'Python', 'Go', 'Embedded Linux', 'Next.js']

export default function SkillsShowcase() {
  return (
    <div className="w-full rounded-lg border border-border bg-surface/70 p-4">
      <span className="text-xs font-medium text-muted uppercase tracking-wider">
        Skills
      </span>
      <div className="mt-3 flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span
            key={skill}
            className="rounded-full border border-border bg-surface/50 px-3 py-1 text-xs text-muted"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  )
}
