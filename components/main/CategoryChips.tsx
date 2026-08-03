import { Chip } from '@/components/ui'
import type { Category } from '@/lib/categories'

export function CategoryChips({
  categories,
  selectedId,
  onSelect,
  onAddClick,
}: {
  categories: Category[]
  selectedId: number | null
  onSelect: (id: number | null) => void
  onAddClick: () => void
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Chip active={selectedId === null} onClick={() => onSelect(null)}>
        전체
        <br />
        음식점
      </Chip>
      <div className="h-10 w-px bg-black/10" />
      {categories.map((c) => (
        <Chip key={c.id} active={selectedId === c.id} onClick={() => onSelect(c.id)}>
          {c.name}
        </Chip>
      ))}
      <Chip onClick={onAddClick}>＋</Chip>
    </div>
  )
}
