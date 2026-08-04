'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { BackButton, PillButton } from '@/components/ui'
import { listRestaurants } from '@/lib/restaurants'
import { getCurrentUser, type AppUser } from '@/lib/session'

type Recommendation = {
  id: string
  name: string
  category: string
  address: string
  distance: number
  phone: string
  placeUrl: string
  blurb: string
}

type Status = 'idle' | 'locating' | 'loading' | 'done' | 'error'

export default function RecommendationsPage() {
  const router = useRouter()
  const [user, setUser] = useState<AppUser | null | undefined>(undefined)
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])

  useEffect(() => {
    getCurrentUser().then(setUser)
  }, [])

  if (user === undefined) {
    return null
  }

  if (!user) {
    router.replace('/')
    return null
  }

  function fetchRecommendations() {
    if (!user) return
    setStatus('locating')
    setError('')

    if (!navigator.geolocation) {
      setStatus('error')
      setError('이 브라우저에서는 위치 정보를 사용할 수 없어요.')
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        setStatus('loading')
        try {
          const existing = await listRestaurants(user.userId)
          const res = await fetch('/api/nearby-recommendations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              existing: existing.map((r) => ({ name: r.name, address: r.address })),
            }),
          })
          if (!res.ok) throw new Error('failed')
          const data = await res.json()
          setRecommendations(data.recommendations ?? [])
          setStatus('done')
        } catch {
          setStatus('error')
          setError('추천을 불러오지 못했어요. 다시 시도해주세요.')
        }
      },
      () => {
        setStatus('error')
        setError('위치 정보 접근을 허용해주셔야 추천을 받을 수 있어요.')
      }
    )
  }

  return (
    <main className="mx-auto max-w-lg space-y-6 p-6 pb-16">
      <div className="flex items-center gap-3">
        <BackButton />
        <h1 className="font-display text-3xl">내 주변 추천</h1>
      </div>

      {status === 'idle' && (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <p className="font-display text-lg leading-relaxed">
            내 위치 근처 음식점을
            <br />
            추천받아볼까요?
          </p>
          <PillButton onClick={fetchRecommendations}>추천 받기</PillButton>
        </div>
      )}

      {(status === 'locating' || status === 'loading') && (
        <p className="py-16 text-center text-ink/60">
          {status === 'locating' ? '위치를 확인하는 중…' : '주변 음식점을 찾아보는 중…'}
        </p>
      )}

      {status === 'error' && (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <p className="text-sm text-delete">{error}</p>
          <PillButton variant="outline" onClick={fetchRecommendations}>
            다시 시도
          </PillButton>
        </div>
      )}

      {status === 'done' && recommendations.length === 0 && (
        <p className="py-16 text-center text-ink/60">근처에 새로 추천할 음식점을 못 찾았어요.</p>
      )}

      {status === 'done' && recommendations.length > 0 && (
        <div className="space-y-4">
          {recommendations.map((r) => (
            <div key={r.id} className="rounded-3xl bg-white p-5 shadow-sm shadow-black/5">
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 font-display text-base">
                <span>{r.name}</span>
                <span className="text-sm text-ink/50">| {r.category}</span>
                <span className="text-sm text-ink/50">| {r.distance}m</span>
              </div>
              {r.blurb && <p className="mt-2 text-sm">{r.blurb}</p>}
              <p className="mt-1 text-sm text-ink/50">{r.address}</p>
              <div className="mt-3 flex justify-end">
                <Link
                  href={`/restaurants/new?name=${encodeURIComponent(r.name)}&address=${encodeURIComponent(r.address)}`}
                >
                  <PillButton variant="outline">내 리스트에 추가</PillButton>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
