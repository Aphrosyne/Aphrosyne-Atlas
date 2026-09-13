import type { ReactNode } from 'react'

interface ContentToolbarProps {
  children: ReactNode
  className?: string
}

/** Shared responsive alignment for Blog and Knowledge content actions. */
export default function ContentToolbar({ children, className = '' }: ContentToolbarProps) {
  return (
    <div className={`flex flex-col gap-3 sm:flex-row sm:items-center ${className}`}>
      {children}
    </div>
  )
}
