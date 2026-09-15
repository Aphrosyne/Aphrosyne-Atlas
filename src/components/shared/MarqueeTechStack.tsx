'use client'

const techStack = [
  '80c51', 'Altium', 'Arduino', 'C / C++', 'CMake',
  'DaVinci Resolve', 'ESP32', 'FreeRTOS', 'Git',
  'GitHub', 'HTML / CSS / JS', 'Java', 'MATLAB', 'Next.js',
  'PlatformIO', 'Python', 'Qt', 'Shell', 'STM32', 'VS Code',
]

const half = Math.ceil(techStack.length / 2)
const row1 = techStack.slice(0, half)
const row2 = techStack.slice(half)

function MarqueeRow({ items, reverse }: { items: string[]; reverse?: boolean }) {
  const doubled = [...items, ...items]

  return (
    <div
      className="min-w-0 overflow-hidden py-2"
      style={{
        maskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
      }}
    >
      <ul className="sr-only">
        {items.map((tech) => <li key={tech}>{tech}</li>)}
      </ul>
      <div
        className={`flex w-max gap-2.5 group-hover:[animation-play-state:paused] motion-reduce:hidden ${reverse ? 'animate-marquee-reverse' : 'animate-marquee'}`}
        aria-hidden
      >
        {doubled.map((tech, i) => (
          <span
            key={`${tech}-${i}`}
            className="shrink-0 select-none rounded-full border border-white/10 bg-white/30 backdrop-blur-lg px-3.5 py-1 text-sm text-white whitespace-nowrap"
          >
            {tech}
          </span>
        ))}
      </div>
      <div className="hidden flex-wrap justify-center gap-2.5 motion-reduce:flex" aria-hidden="true">
        {items.map((tech) => (
          <span key={tech} className="shrink-0 select-none rounded-full border border-white/10 bg-white/30 backdrop-blur-lg px-3.5 py-1 text-sm text-white whitespace-nowrap">
            {tech}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function MarqueeTechStack() {
  return (
    <div className="group w-full min-w-0 rounded-xl border border-white/10 bg-white/3 py-5">
      <MarqueeRow items={row1} />
      <MarqueeRow items={row2} reverse />
    </div>
  )
}
