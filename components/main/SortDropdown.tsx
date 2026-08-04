import { useEffect, useRef, useState } from 'react'
import type { SortOption } from '@/lib/restaurants'

const OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: '최신 등록 순' },
  { value: 'oldest', label: '오래전 등록 순' },
  { value: 'score_desc', label: '평점 높은 순' },
  { value: 'score_asc', label: '평점 낮은 순' },
]

export function SortDropdown({
  value,
  onChange,
}: {
  value: SortOption
  onChange: (value: SortOption) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const current = OPTIONS.find((opt) => opt.value === value)

  useEffect(() => {
    if (!open) return
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [open])

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 font-display text-sm text-ink shadow-sm shadow-black/5 transition active:scale-95"
      >
        <span className="text-check">✔</span>
        {current?.label}
        <span className={`text-[10px] text-ink/40 transition ${open ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-2 w-40 overflow-hidden rounded-3xl bg-white py-1.5 shadow-lg shadow-black/15">
          {OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value)
                setOpen(false)
              }}
              className={`flex w-full items-center gap-2 rounded-full px-4 py-2 text-left font-display text-sm transition hover:bg-black/5 ${
                opt.value === value ? 'text-accent' : 'text-ink'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
