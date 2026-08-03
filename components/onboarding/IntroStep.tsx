'use client'

import { useState } from 'react'
import { DeliveryAnimation } from '@/components/icons/DeliveryAnimation'
import { PillButton } from '@/components/ui'
import { randomFoodQuote } from '@/lib/quotes'

export function IntroStep({ onNext }: { onNext: () => void }) {
  const [quote] = useState(randomFoodQuote)

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-8 text-center">
      <h1 className="font-display text-5xl leading-tight">
        오늘은
        <br />
        배달이다!
      </h1>
      <DeliveryAnimation className="w-64" />
      <p className="font-script text-xl text-ink/70">&quot;{quote}&quot;</p>
      <PillButton onClick={onNext}>시작하기</PillButton>
    </main>
  )
}
