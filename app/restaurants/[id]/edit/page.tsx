'use client'

import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { PillButton } from '@/components/ui'
import { RestaurantForm, type RestaurantFormValues } from '@/components/restaurants/RestaurantForm'
import { listCategories, type Category } from '@/lib/categories'
import { getLocalUser, type LocalUser } from '@/lib/localUser'
import { deleteRestaurant, getRestaurant, updateRestaurant } from '@/lib/restaurants'

export default function EditRestaurantPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const restaurantId = Number(params.id)

  const [user, setUser] = useState<LocalUser | null | undefined>(undefined)
  const [categories, setCategories] = useState<Category[] | undefined>(undefined)
  const [initialValues, setInitialValues] = useState<RestaurantFormValues | null | undefined>(undefined)

  useEffect(() => {
    const localUser = getLocalUser()
    setUser(localUser)
    if (!localUser) return

    Promise.all([listCategories(localUser.userId), getRestaurant(restaurantId)]).then(
      ([cats, restaurant]) => {
        setCategories(cats)
        if (!restaurant || restaurant.user_id !== localUser.userId) {
          setInitialValues(null)
          return
        }
        setInitialValues({
          name: restaurant.name,
          address: restaurant.address ?? '',
          categoryId: String(restaurant.category_id),
          usedDelivery: restaurant.used_delivery,
          score: restaurant.score != null ? String(restaurant.score) : '',
          review: restaurant.review ?? '',
          memo: restaurant.memo ?? '',
        })
      }
    )
  }, [restaurantId])

  if (user === undefined || (user && initialValues === undefined)) {
    return null
  }

  if (!user) {
    router.replace('/')
    return null
  }

  if (initialValues === null) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
        <p className="font-display text-lg">음식점 정보를 찾을 수 없어요.</p>
        <Link href="/">
          <PillButton variant="outline">메인으로</PillButton>
        </Link>
      </main>
    )
  }

  return (
    <RestaurantForm
      title="음식점 수정"
      categories={categories ?? []}
      initialValues={initialValues}
      onSubmit={async (input) => {
        await updateRestaurant(restaurantId, input)
        router.push('/')
      }}
      extraAction={
        <PillButton
          variant="muted"
          type="button"
          onClick={async () => {
            await deleteRestaurant(restaurantId)
            router.push('/')
          }}
        >
          삭제
        </PillButton>
      }
    />
  )
}
