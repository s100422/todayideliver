import { DeliveryScooterIcon } from '@/components/icons/DeliveryScooterIcon'
import { Card, Chip, Input, PillButton, Textarea } from '@/components/ui'

export default function StylePreview() {
  return (
    <main className="min-h-screen space-y-8 p-8">
      <h1 className="font-display text-4xl">오늘은 배달이다!</h1>
      <p className="max-w-md text-sm text-ink/70">
        본문/리뷰용 기본 폰트(Noto Sans KR)입니다. 긴 글자도 읽기 편하도록 손글씨 폰트 대신 이 폰트를 씁니다.
      </p>

      <div className="flex flex-wrap gap-3">
        <PillButton variant="solid">저장하기</PillButton>
        <PillButton variant="outline">완료</PillButton>
        <PillButton variant="muted">＋</PillButton>
      </div>

      <div className="flex gap-3">
        <Chip active>전체 음식점</Chip>
        <Chip>BBQ 치킨</Chip>
        <Chip>햄버거</Chip>
        <Chip>＋</Chip>
      </div>

      <div className="max-w-sm space-y-3">
        <Input placeholder="10자 이내" />
        <Textarea placeholder="500자 이내" rows={3} />
      </div>

      <Card className="max-w-sm">
        <p className="font-display text-lg">BBQ 고읍점</p>
        <p className="text-sm text-ink/70">평점 4.8/5 · BBQ 치킨</p>
      </Card>

      <DeliveryScooterIcon className="h-24 w-24 text-ink" />

      <div className="bg-food-pattern h-48 w-full rounded-3xl border border-black/5" />
    </main>
  )
}
