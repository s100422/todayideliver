'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { TransparentVideo } from '@/components/icons/TransparentVideo'
import { PillButton } from '@/components/ui'
import { listCategories, type Category } from '@/lib/categories'
import { deleteRestaurant, listRestaurants, type Restaurant, type SortOption } from '@/lib/restaurants'
import { signOut, type AppUser } from '@/lib/session'
import { CategoryChips } from './CategoryChips'
import { EmptyState } from './EmptyState'
import { RestaurantCard } from './RestaurantCard'
import { SortDropdown } from './SortDropdown'

export function MainList({ user }: { user: AppUser }) {
  const [categories, setCategories] = useState<Category[]>([])
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)
  const [sort, setSort] = useState<SortOption>('newest')
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    const [cats, rests] = await Promise.all([
      listCategories(user.userId),
      listRestaurants(user.userId, { categoryId: selectedCategoryId ?? undefined, sort }),
    ])
    setCategories(cats)
    setRestaurants(rests)
    setLoading(false)
  }, [user.userId, selectedCategoryId, sort])

  useEffect(() => {
    refresh()
  }, [refresh])

  function categoryName(id: number) {
    return categories.find((c) => c.id === id)?.name ?? ''
  }

  const addRestaurantHref =
    selectedCategoryId != null ? `/restaurants/new?categoryId=${selectedCategoryId}` : '/restaurants/new'

  return (
    <main className="min-h-screen">
      <div className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <h1 className="font-display text-2xl leading-tight">
            &lsquo;{user.nickname}&rsquo;의
            <br />
            배달 집 리스트
          </h1>
          <div className="flex flex-col gap-2">
            <Link href="/categories">
              <PillButton variant="outline" className="w-full">
                카테고리 등록 ＋
              </PillButton>
            </Link>
            <Link href="/restaurants/new">
              <PillButton variant="outline" className="w-full">
                음식점 등록 ＋
              </PillButton>
            </Link>
            <Link href="/recommendations">
              <PillButton variant="outline" className="w-full">
                내 주변 추천 📍
              </PillButton>
            </Link>
            <button
              type="button"
              onClick={() => signOut()}
              className="text-xs text-ink/40 underline"
            >
              로그아웃
            </button>
          </div>
        </div>

        <TransparentVideo src="/main-header-animation.mp4" className="mt-4 w-64" />

        <div className="mt-6">
          <CategoryChips
            categories={categories}
            selectedId={selectedCategoryId}
            onSelect={setSelectedCategoryId}
            addHref="/categories"
          />
        </div>
      </div>

      <div className="min-h-[60vh] p-6">
        <div className="mb-4 flex justify-end">
          <SortDropdown value={sort} onChange={setSort} />
        </div>

        {loading ? null : restaurants.length === 0 ? (
          <EmptyState href={addRestaurantHref} />
        ) : (
          <>
            <div className="space-y-4">
              {restaurants.map((r) => (
                <RestaurantCard
                  key={r.id}
                  restaurant={r}
                  categoryName={categoryName(r.category_id)}
                  onDelete={async (id) => {
                    await deleteRestaurant(id)
                    await refresh()
                  }}
                />
              ))}
            </div>
            <div className="mt-6 flex justify-center">
              <Link href={addRestaurantHref}>
                <PillButton variant="outline">음식점 추가 ＋</PillButton>
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  )
}
