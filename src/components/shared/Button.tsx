import Link from 'next/link'

interface ButtonProps {
  href: string
  children: React.ReactNode
  variant?: 'primary' | 'outline'
  className?: string
}

export default function Button({ href, children, variant = 'primary', className = '' }: ButtonProps) {
  const base =
    'inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-all duration-200'

  const styles = {
    primary: 'bg-accent text-white hover:opacity-90',
    outline:
      'border border-border text-fg hover:bg-surface',
  }

  return (
    <Link href={href} className={`${base} ${styles[variant]} ${className}`}>
      {children}
    </Link>
  )
}
