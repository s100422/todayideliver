import { DeliveryAnimation } from '@/components/icons/DeliveryAnimation'
import { PillButton } from '@/components/ui'

export function IntroStep({ onNext }: { onNext: () => void }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-8 text-center">
      <h1 className="font-display text-5xl leading-tight">
        오늘은
        <br />
        배달이다!
      </h1>
      <DeliveryAnimation className="w-64" />
      <p className="font-script text-xl text-ink/70">&quot;음식에 대한 명언&quot;</p>
      <PillButton onClick={onNext}>시작하기</PillButton>
    </main>
  )
}
