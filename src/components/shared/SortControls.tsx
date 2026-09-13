'use client'

export type SortDirection = 'asc' | 'desc'

export interface SortOption<T extends string> {
  value: T
  label: string
}

interface SortControlsProps<T extends string> {
  options: readonly SortOption<T>[]
  value: T
  direction: SortDirection
  onValueChange: (value: T) => void
  onDirectionChange: (direction: SortDirection) => void
  label?: string
  className?: string
}

export default function SortControls<T extends string>({
  options,
  value,
  direction,
  onValueChange,
  onDirectionChange,
  label = '排序方式',
  className = '',
}: SortControlsProps<T>) {
  const directionLabel = direction === 'desc' ? '降序' : '升序'

  return (
    <div className={`flex h-13 items-center gap-1 rounded-2xl border border-border/30 bg-surface/50 p-1 text-sm backdrop-blur-sm ${className}`} role="group" aria-label={label}>
      <div className="grid w-40 shrink-0 grid-cols-2 gap-1">
        {options.map((option) => {
          const isActive = option.value === value
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onValueChange(option.value)}
              aria-pressed={isActive}
              className={`min-h-11 cursor-pointer rounded-xl px-2 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                isActive
                  ? 'bg-accent font-semibold text-white shadow-sm'
                  : 'font-medium text-fg/60 hover:bg-surface hover:text-fg'
              }`}
            >
              {option.label}
            </button>
          )
        })}
      </div>
      <button
        type="button"
        onClick={() => onDirectionChange(direction === 'desc' ? 'asc' : 'desc')}
        aria-label={`当前${directionLabel}，切换为${direction === 'desc' ? '升序' : '降序'}`}
        title={`当前${directionLabel}`}
        className="inline-flex min-h-11 w-20 shrink-0 cursor-pointer items-center justify-center rounded-xl px-2 text-fg/65 transition-colors hover:bg-surface hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <span>{directionLabel}</span>
      </button>
    </div>
  )
}
