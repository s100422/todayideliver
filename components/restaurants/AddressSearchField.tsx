'use client'

import { useEffect, useRef, useState } from 'react'
import { PillButton } from '@/components/ui'

type DaumPostcodeResult = {
  roadAddress: string
  jibunAddress: string
}

declare global {
  interface Window {
    daum?: {
      Postcode: new (options: {
        oncomplete: (data: DaumPostcodeResult) => void
        width?: string | number
        height?: string | number
      }) => { embed: (el: HTMLElement) => void }
    }
  }
}

const SCRIPT_SRC = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'

let scriptPromise: Promise<void> | null = null

function loadDaumPostcodeScript(): Promise<void> {
  if (typeof window !== 'undefined' && window.daum?.Postcode) return Promise.resolve()
  if (scriptPromise) return scriptPromise
  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = SCRIPT_SRC
    script.onload = () => resolve()
    script.onerror = () => {
      scriptPromise = null
      reject(new Error('주소 검색 스크립트를 불러오지 못했어요.'))
    }
    document.head.appendChild(script)
  })
  return scriptPromise
}

export function AddressSearchField({
  value,
  onChange,
}: {
  value: string
  onChange: (address: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadDaumPostcodeScript().catch(() => {})
  }, [])

  useEffect(() => {
    if (!open || !containerRef.current) return
    let cancelled = false
    setError('')
    loadDaumPostcodeScript()
      .then(() => {
        if (cancelled || !containerRef.current) return
        new window.daum!.Postcode({
          oncomplete: (data) => {
            onChange(data.roadAddress || data.jibunAddress)
            setOpen(false)
          },
          width: '100%',
          height: '100%',
        }).embed(containerRef.current)
      })
      .catch(() => setError('주소 검색을 불러오지 못했어요. 다시 시도해주세요.'))
    return () => {
      cancelled = true
    }
  }, [open, onChange])

  return (
    <div>
      <div className="flex items-center gap-2">
        <div className="flex-1 rounded-2xl border border-black/5 bg-white px-4 py-3 text-ink">
          {value || <span className="text-black/35">주소를 검색해주세요</span>}
        </div>
        <PillButton type="button" variant="muted" onClick={() => setOpen(true)}>
          검색
        </PillButton>
      </div>
      {error && <p className="mt-1 text-sm text-delete">{error}</p>}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="relative w-full max-w-sm rounded-3xl bg-white p-4 shadow-xl">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/5 text-ink/60"
              aria-label="닫기"
            >
              ✕
            </button>
            <div ref={containerRef} className="h-[400px] w-full overflow-hidden rounded-2xl" />
          </div>
        </div>
      )}
    </div>
  )
}
