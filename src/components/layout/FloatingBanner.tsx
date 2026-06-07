export default function FloatingBanner() {
  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 pointer-events-none overflow-hidden rounded-full border border-white/10 bg-black/25 backdrop-blur-md shadow-[0_8px_20px_rgba(0,0,0,0.15)]"
      style={{ width: '280px', height: '32px' }}
    >
      <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-black/30 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-r from-transparent to-black/30 z-10 pointer-events-none" />
      <div
        className="flex whitespace-nowrap h-full items-center"
        style={{ animation: 'bannerScroll 20s linear infinite', willChange: 'transform' }}
      >
        {[...Array(2)].map((_, copy) => (
          <span key={copy} className="inline-flex items-center">
            {Array.from({ length: 12 }).map((_, i) => (
              <span key={i} className="inline-flex items-center gap-4 mx-3">
                <span className="text-xs font-semibold tracking-[0.15em] text-white/30 select-none">
                  Aphrosyne
                </span>
                <span className="h-1 w-1 rounded-full bg-accent/30 shrink-0" />
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  )
}
