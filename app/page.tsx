'use client'

import { useEffect, useState } from 'react'
import { MainList } from '@/components/main/MainList'
import { CategoryStep } from '@/components/onboarding/CategoryStep'
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow'
import { createCategories, listCategories } from '@/lib/categories'
import { migrateLocalDataIfNeeded } from '@/lib/migrate'
import { getCurrentUser, subscribeAuth, type AppUser } from '@/lib/session'

export default function Home() {
  const [user, setUser] = useState<AppUser | null | undefined>(undefined)
  const [hasCategories, setHasCategories] = useState<boolean | undefined>(undefined)

  useEffect(() => {
    getCurrentUser().then(setUser)
    return subscribeAuth((u) => {
      setUser(u)
      setHasCategories(undefined)
    })
  }, [])

  useEffect(() => {
    if (!user) return
    listCategories(user.userId).then((cats) => setHasCategories(cats.length > 0))
  }, [user])

  if (user === undefined) {
    return null
  }

  if (!user) {
    return (
      <OnboardingFlow
        onAuthed={async () => {
          await migrateLocalDataIfNeeded()
          const authedUser = await getCurrentUser()
          setUser(authedUser)
          if (authedUser) {
            const cats = await listCategories(authedUser.userId)
            setHasCategories(cats.length > 0)
          }
        }}
      />
    )
  }

  if (hasCategories === undefined) {
    return null
  }

  if (!hasCategories) {
    return (
      <CategoryStep
        onComplete={async (names) => {
          await createCategories(user.userId, names)
          setHasCategories(true)
        }}
      />
    )
  }

  return <MainList user={user} />
}
