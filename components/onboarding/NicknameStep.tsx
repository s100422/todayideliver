'use client'

import { useState } from 'react'
import { DeliveryAnimation } from '@/components/icons/DeliveryAnimation'
import { Input } from '@/components/ui'

export function NicknameStep({ onNext }: { onNext: (nickname: string) => void }) {
  const [nickname, setNickname] = useState('')

  function submit() {
    const trimmed = nickname.trim()
    if (!trimmed) return
    onNext(trimmed)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-8 text-center">
      <h1 className="font-display text-4xl leading-tight">
        닉네임을
        <br />
        입력하세요
      </h1>
      <form
        className="flex w-full max-w-sm items-center gap-2 rounded-full bg-white pr-2 shadow-sm shadow-black/5"
        onSubmit={(e) => {
          e.preventDefault()
          submit()
        }}
      >
        <Input
          className="border-none shadow-none focus:ring-0"
          placeholder="10자 이내"
          maxLength={10}
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          autoFocus
        />
        <button
          type="submit"
          aria-label="다음"
          disabled={!nickname.trim()}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black/10 text-xl text-ink disabled:opacity-40"
        >
          →
        </button>
      </form>
      <DeliveryAnimation className="w-48" />
    </main>
  )
}
