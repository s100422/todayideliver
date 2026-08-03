'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { PillButton } from '@/components/ui'
import { RestaurantForm } from '@/components/restaurants/RestaurantForm'
import { listCategories, type Category } from '@/lib/categories'
import { getLocalUser, type LocalUser } from '@/lib/localUser'
import { createRestaurant } from '@/lib/restaurants'

export default function NewRestaurantPage() {
  const router = useRouter()
  const [user, setUser] = useState<LocalUser | null | undefined>(undefined)
  const [categories, setCategories] = useState<Category[] | undefined>(undefined)

  useEffect(() => {
    const localUser = getLocalUser()
    setUser(localUser)
    if (localUser) {
      listCategories(localUser.userId).then(setCategories)
    }
  }, [])

  if (user === undefined || (user && categories === undefined)) {
    return null
  }

  if (!user) {
    router.replace('/')
    return null
  }

  if (categories && categories.length === 0) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
        <p className="font-display text-lg">먼저 카테고리를 1개 이상 만들어주세요!</p>
        <Link href="/">
          <PillButton variant="outline">메인으로</PillButton>
        </Link>
      </main>
    )
  }

  return (
    <RestaurantForm
      categories={categories ?? []}
      onSubmit={async (input) => {
        await createRestaurant(user.userId, input)
        router.push('/')
      }}
    />
  )
}
