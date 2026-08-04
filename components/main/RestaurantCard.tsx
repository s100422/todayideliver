'use client'

import Link from 'next/link'
import { Card } from '@/components/ui'
import type { Restaurant } from '@/lib/restaurants'

export function RestaurantCard({
  restaurant,
  categoryName,
  onDelete,
}: {
  restaurant: Restaurant
  categoryName: string
  onDelete: (id: number) => void
}) {
  return (
    <Card>
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 font-display text-base">
        <span className="text-check">✔</span>
        <span>{restaurant.name}</span>
        {restaurant.address && <span className="text-sm text-ink/50">| {restaurant.address}</span>}
        {restaurant.used_delivery && restaurant.score != null && (
          <span className="text-sm text-ink/50">| 평점: {restaurant.score}/5</span>
        )}
        <span className="text-sm text-ink/50">| 카테고리: {categoryName}</span>
      </div>

      {restaurant.used_delivery && restaurant.review && (
        <div className="mt-3">
          <span className="inline-block rounded-full bg-accent px-3 py-0.5 font-display text-xs text-white">
            리뷰
          </span>
          <p className="mt-1 whitespace-pre-wrap text-sm">{restaurant.review}</p>
        </div>
      )}

      <div className="mt-3 flex items-end justify-between gap-3">
        <div>
          <span className="inline-block rounded-full bg-accent px-3 py-0.5 font-display text-xs text-white">
            특이사항
          </span>
          <p className="mt-1 whitespace-pre-wrap text-sm">{restaurant.memo || '-'}</p>
        </div>
        <div className="flex shrink-0 gap-3 text-sm font-medium">
          <Link href={`/restaurants/${restaurant.id}/edit`} className="text-edit">
            수정
          </Link>
          <button
            onClick={() => {
              if (window.confirm(`'${restaurant.name}'을(를) 삭제할까요?`)) onDelete(restaurant.id)
            }}
            className="text-delete"
          >
            삭제
          </button>
        </div>
      </div>
    </Card>
  )
}
