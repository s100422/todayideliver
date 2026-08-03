import Link from 'next/link'
import { PillButton } from '@/components/ui'

export function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <p className="font-display text-lg leading-relaxed">
        음식점 등록된게 없어요!
        <br />
        등록하러 가시겠어요?
      </p>
      <Link href="/restaurants/new">
        <PillButton variant="outline">음식점 등록</PillButton>
      </Link>
    </div>
  )
}
