'use client'

import { useEffect, useState } from 'react'
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

  return (
    <main className="min-h-screen p-6">
      <h1 className="font-display text-2xl">{user.nickname}님의 배달 집 리스트</h1>
      <p className="mt-2 text-sm text-ink/60">메인 리스트 화면은 4단계에서 만들 예정입니다.</p>
    </main>
  )
}
