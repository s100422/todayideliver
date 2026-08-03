'use client'

import { useState } from 'react'
import { Input, PillButton } from '@/components/ui'

export function AddCategoryInline({
  onAdd,
  onClose,
}: {
  onAdd: (name: string) => Promise<void>
  onClose: () => void
}) {
  const [name, setName] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function submit() {
    const trimmed = name.trim()
    if (!trimmed) return
    setSubmitting(true)
    try {
      await onAdd(trimmed)
      onClose()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form
      className="mt-3 flex max-w-xs items-center gap-2"
      onSubmit={(e) => {
        e.preventDefault()
        submit()
      }}
    >
      <Input
        placeholder="10자 이내"
        maxLength={10}
        value={name}
        onChange={(e) => setName(e.target.value)}
        autoFocus
      />
      <PillButton type="submit" variant="outline" disabled={submitting}>
        추가
      </PillButton>
    </form>
  )
}
