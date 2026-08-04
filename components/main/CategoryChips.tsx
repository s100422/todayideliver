import Link from 'next/link'
import { Chip } from '@/components/ui'
import type { Category } from '@/lib/categories'

export function CategoryChips({
  categories,
  selectedId,
  onSelect,
  addHref,
}: {
  categories: Category[]
  selectedId: number | null
  onSelect: (id: number | null) => void
  addHref: string
}) {
  return (
    <div className="no-scrollbar flex items-center gap-3 overflow-x-auto">
      <div className="sticky left-0 z-10 flex shrink-0 items-center gap-3 bg-paper pr-3">
        <Chip active={selectedId === null} onClick={() => onSelect(null)}>
          전체
          <br />
          음식점
        </Chip>
        <div className="h-10 w-px bg-black/10" />
      </div>
      {categories.map((c) => (
        <Chip key={c.id} active={selectedId === c.id} onClick={() => onSelect(c.id)}>
          {c.name}
        </Chip>
      ))}
      <Link
        href={addHref}
        className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-white text-center font-display text-sm text-ink shadow-[0_4px_0_rgba(0,0,0,0.1),0_7px_12px_rgba(0,0,0,0.12)] transition active:translate-y-[3px] active:shadow-none"
      >
        ＋
      </Link>
    </div>
  )
}
