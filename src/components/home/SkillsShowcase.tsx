import AnimatedSection from '../shared/AnimatedSection'

const skills = [
  { name: 'C / C++', level: 90 },
  { name: 'Rust', level: 75 },
  { name: 'Python', level: 80 },
  { name: 'Embedded Linux', level: 70 },
  { name: 'React / Next.js', level: 65 },
  { name: 'Go', level: 60 },
]

export default function SkillsShowcase() {
  return (
    <AnimatedSection className="mx-auto max-w-5xl px-4 py-20" delay={0.2}>
      <h2 className="text-2xl font-semibold tracking-tight">Skills &amp; Tools</h2>
      <p className="mt-2 text-muted">Technologies I work with regularly.</p>
      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {skills.map((skill, i) => (
          <div key={skill.name}>
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-fg">{skill.name}</span>
              <span className="text-muted">{skill.level}%</span>
            </div>
            <div className="mt-1.5 h-2 w-full rounded-full bg-zinc-200 dark:bg-zinc-700">
              <div
                className="h-full rounded-full bg-accent transition-all duration-700"
                style={{ width: `${skill.level}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </AnimatedSection>
  )
}
