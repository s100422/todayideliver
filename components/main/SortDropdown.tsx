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
  return (
    <div className="inline-flex items-center gap-1 rounded-full bg-white px-4 py-2 shadow-sm shadow-black/5">
      <span className="text-check">✔</span>
      <select
        className="bg-transparent font-display text-sm text-ink focus:outline-none"
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
      >
        {OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}
