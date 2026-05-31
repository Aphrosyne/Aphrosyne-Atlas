import Link from 'next/link'

interface ProjectCardProps {
  title: string
  description: string
  tags: string[]
  href: string
}

export default function ProjectCard({ title, description, tags, href }: ProjectCardProps) {
  return (
    <Link
      href={href}
      className="group rounded-xl border border-border bg-surface p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
    >
      <h3 className="font-semibold text-fg group-hover:text-accent transition-colors">{title}</h3>
      <p className="mt-2 text-sm text-muted leading-relaxed">{description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
          >
            {tag}
          </span>
        ))}
      </div>
    </Link>
  )
}
