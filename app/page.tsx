'use client'

import { useEffect, useState } from 'react'
import { MainList } from '@/components/main/MainList'
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow'
import { getLocalUser, type LocalUser } from '@/lib/localUser'

export default function Home() {
  const [user, setUser] = useState<LocalUser | null | undefined>(undefined)

  useEffect(() => {
    setUser(getLocalUser())
  }, [])

  if (user === undefined) {
    return null
  }

  if (!user) {
    return <OnboardingFlow onComplete={setUser} />
  }

  return <MainList user={user} />
}
