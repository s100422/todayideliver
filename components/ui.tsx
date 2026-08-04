import { ButtonHTMLAttributes, InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'

function cn(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(' ')
}

export function PillButton({
  variant = 'solid',
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'solid' | 'outline' | 'muted' }) {
  return (
    <button
      className={cn(
        'rounded-full px-6 py-3 font-display text-base transition active:scale-95 disabled:opacity-40',
        variant === 'solid' && 'bg-ink text-paper',
        variant === 'outline' && 'bg-white text-ink shadow-sm shadow-black/5 border border-black/5',
        variant === 'muted' && 'bg-black/10 text-ink/60',
        className
      )}
      {...props}
    />
  )
}

export function Chip({
  active,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      className={cn(
        'flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-full text-center font-display text-sm leading-tight transition active:translate-y-[3px] active:shadow-none',
        active
          ? 'bg-gradient-to-b from-[#3a352c] to-ink text-paper shadow-[0_4px_0_#000,0_7px_12px_rgba(0,0,0,0.35)]'
          : 'bg-gradient-to-b from-accent-light to-accent text-white shadow-[0_4px_0_var(--color-accent-dark),0_7px_12px_rgba(0,0,0,0.2)]',
        className
      )}
      {...props}
    />
  )
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'w-full rounded-2xl border border-black/5 bg-white px-4 py-3 text-ink placeholder:text-black/35 focus:outline-none focus:ring-2 focus:ring-ink/20',
        className
      )}
      {...props}
    />
  )
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        'w-full rounded-2xl border border-black/5 bg-white px-4 py-3 text-ink placeholder:text-black/35 focus:outline-none focus:ring-2 focus:ring-ink/20',
        className
      )}
      {...props}
    />
  )
}

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        'w-full rounded-2xl border border-black/5 bg-white px-4 py-3 text-ink focus:outline-none focus:ring-2 focus:ring-ink/20',
        className
      )}
      {...props}
    />
  )
}

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn('rounded-3xl bg-white p-5 shadow-sm shadow-black/5', className)}>
      {children}
    </div>
  )
}
