'use client'

import { useState } from 'react'
import { createCategories } from '@/lib/categories'
import { createUserId, saveLocalUser, type LocalUser } from '@/lib/localUser'
import { CategoryStep } from './CategoryStep'
import { IntroStep } from './IntroStep'
import { NicknameStep } from './NicknameStep'

type Step = 'intro' | 'nickname' | 'category'

export function OnboardingFlow({ onComplete }: { onComplete: (user: LocalUser) => void }) {
  const [step, setStep] = useState<Step>('intro')
  const [nickname, setNickname] = useState('')

  if (step === 'intro') {
    return <IntroStep onNext={() => setStep('nickname')} />
  }

  if (step === 'nickname') {
    return (
      <NicknameStep
        onNext={(value) => {
          setNickname(value)
          setStep('category')
        }}
      />
    )
  }

  return (
    <CategoryStep
      onComplete={async (names) => {
        const userId = createUserId()
        await createCategories(userId, names)
        const user: LocalUser = { userId, nickname }
        saveLocalUser(user)
        onComplete(user)
      }}
    />
  )
}
