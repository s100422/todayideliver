'use client'

import { useState } from 'react'
import { AuthStep } from '@/components/auth/AuthStep'
import { IntroStep } from './IntroStep'

type Step = 'intro' | 'auth'

export function OnboardingFlow({ onAuthed }: { onAuthed: () => void }) {
  const [step, setStep] = useState<Step>('intro')

  if (step === 'intro') {
    return <IntroStep onNext={() => setStep('auth')} />
  }

  return <AuthStep onAuthed={onAuthed} />
}
