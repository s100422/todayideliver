'use client'

import { useState } from 'react'
import { DeliveryAnimation } from '@/components/icons/DeliveryAnimation'
import { Input, PillButton } from '@/components/ui'

export function CategoryStep({ onComplete }: { onComplete: (names: string[]) => Promise<void> }) {
  const [names, setNames] = useState(['', ''])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  function updateName(index: number, value: string) {
    setNames((prev) => prev.map((n, i) => (i === index ? value : n)))
  }

  function addField() {
    setNames((prev) => [...prev, ''])
  }

  async function submit() {
    const cleaned = [...new Set(names.map((n) => n.trim()).filter(Boolean))]
    if (cleaned.length === 0) {
      setError('카테고리를 1개 이상 입력해주세요.')
      return
    }
    setError('')
    setSubmitting(true)
    try {
      await onComplete(cleaned)
    } catch {
      setError('저장에 실패했어요. 다시 시도해주세요.')
      setSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center">
      <div>
        <h1 className="font-display text-4xl leading-tight">
          카테고리를
          <br />
          만들어주세요
        </h1>
        <p className="mt-2 text-sm text-ink/60">1개 이상 만들기!</p>
      </div>

      <div className="w-full max-w-sm space-y-3">
        {names.map((name, i) => (
          <Input
            key={i}
            placeholder="10자 이내"
            maxLength={10}
            value={name}
            onChange={(e) => updateName(i, e.target.value)}
            autoFocus={i === 0}
          />
        ))}
        <PillButton variant="muted" className="w-full" onClick={addField} type="button">
          ＋
        </PillButton>
      </div>

      {error && <p className="text-sm text-delete">{error}</p>}

      <PillButton variant="outline" onClick={submit} disabled={submitting}>
        {submitting ? '저장 중…' : '완료'}
      </PillButton>

      <DeliveryAnimation className="w-48" />
    </main>
  )
}
