'use client'

import Link from 'next/link'

const LINKS = [
  { label: 'Blog', href: '/blog', desc: 'Thoughts & notes', glow: '#3b82f6' },
  { label: 'Projects', href: '/projects', desc: 'Stuff I built', glow: '#8b5cf6' },
  { label: 'About', href: '/about', desc: 'Who I am', glow: '#06b6d4' },
]

export default function HeroLinks() {
  return (
    <>
      <style>{`
        /* ─── Container glow bars — overflow visible so they protrude ─── */
        .hero-btn::before,
        .hero-btn::after {
          content: '';
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          width: 40px;
          height: 10px;
          border-radius: 5px;
          background: var(--c);
          box-shadow: 0 0 5px var(--c), 0 0 15px var(--c), 0 0 30px var(--c), 0 0 60px var(--c);
          transition: 0.5s;
        }
        .hero-btn:hover::before,
        .hero-btn:hover::after {
          width: 80%;
          height: 50%;
          border-radius: 15px;
          transition-delay: 0.3s;
        }
        .hero-btn::before  { bottom: -5px; }
        .hero-btn:hover::before { bottom: 0; }
        .hero-btn::after   { top: -5px; }
        .hero-btn:hover::after  { top: 0; }

        /* ─── Sweep — on the link's ::before, matches demo exactly ─── */
        .hero-btn-link::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 50%;
          height: 100%;
          background: linear-gradient(to right, transparent, rgba(255,255,255,0.15));
          transform: skewX(45deg) translateX(0);
          transition: 0.5s;
        }
        .hero-btn:hover .hero-btn-link::before {
          transform: skewX(45deg) translateX(200%);
        }
      `}</style>

      <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
        {LINKS.map((l) => (
          <span
            key={l.label}
            className="hero-btn relative inline-flex rounded-full"
            style={{ ['--c' as string]: l.glow }}
          >
            <Link
              href={l.href}
              className="hero-btn-link relative z-10 flex items-center gap-2 px-5 py-2 text-sm text-white/80 hover:text-white rounded-full overflow-hidden bg-white/[0.05] backdrop-blur-[15px] border-t border-white/10 border-b border-white/10 shadow-[0_15px_35px_rgba(0,0,0,0.2)] transition duration-500"
            >
              {l.label}
              <span className="hidden sm:inline text-[11px] text-white/50">· {l.desc}</span>
            </Link>
          </span>
        ))}
      </div>
    </>
  )
}
