'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { MapView } from '@/components/recommendations/MapView'
import { BackButton, FoodLoading, Input, PillButton } from '@/components/ui'
import { listRestaurants } from '@/lib/restaurants'
import { getAccessToken, getCurrentUser, type AppUser } from '@/lib/session'

type Recommendation = {
  id: string
  name: string
  category: string
  address: string
  distance: number
  phone: string
  placeUrl: string
  lat: number
  lng: number
  blurb: string
}

type Status = 'idle' | 'asking' | 'locating' | 'loading' | 'done' | 'error'

export default function RecommendationsPage() {
  const router = useRouter()
  const [user, setUser] = useState<AppUser | null | undefined>(undefined)
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [myLocation, setMyLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [foodQuery, setFoodQuery] = useState('')
  const [activeFoodQuery, setActiveFoodQuery] = useState('')

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

  function getPosition(options: PositionOptions): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject, options))
  }

  async function fetchRecommendations(query?: string) {
    if (!user) return
    setActiveFoodQuery(query ?? '')
    setStatus('locating')
    setError('')

    if (!navigator.geolocation) {
      setStatus('error')
      setError('이 브라우저에서는 위치 정보를 사용할 수 없어요.')
      return
    }

    let position: GeolocationPosition
    try {
      // GPS가 있으면 정확한 위치를, 없거나 시간이 오래 걸리면 대략적인 위치로 대체
      position = await getPosition({ enableHighAccuracy: true, timeout: 8000 })
    } catch (err) {
      if ((err as GeolocationPositionError).code === GeolocationPositionError.PERMISSION_DENIED) {
        setStatus('error')
        setError('위치 정보 접근을 허용해주셔야 추천을 받을 수 있어요.')
        return
      }
      try {
        position = await getPosition({ enableHighAccuracy: false, timeout: 10000 })
      } catch {
        setStatus('error')
        setError('위치 정보를 가져오지 못했어요. 다시 시도해주세요.')
        return
      }
    }

    setStatus('loading')
    setMyLocation({ lat: position.coords.latitude, lng: position.coords.longitude })
    try {
      const existing = await listRestaurants(user.userId)
      const token = await getAccessToken()
      const res = await fetch('/api/nearby-recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          existing: existing.map((r) => ({ name: r.name, address: r.address })),
          ...(query ? { foodQuery: query } : {}),
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
  }

  return (
    <main className="mx-auto max-w-lg space-y-6 p-6 pb-16">
      <div className="flex items-center gap-3">
        <BackButton />
        <h1 className="font-display text-3xl">내 주변 맛집</h1>
      </div>

      {status === 'idle' && (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <p className="font-display text-lg leading-relaxed">
            내 위치 근처 음식점을
            <br />
            추천받아볼까요?
          </p>
          <PillButton variant="accent" onClick={() => setStatus('asking')}>추천 받기</PillButton>
        </div>
      )}

      {status === 'asking' && (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <p className="font-display text-lg leading-relaxed">원하는 음식이 있나요?</p>
          <Input
            placeholder="예: 치킨, 마라탕..."
            value={foodQuery}
            onChange={(e) => setFoodQuery(e.target.value)}
            className="max-w-xs"
          />
          <PillButton variant="accent" onClick={() => fetchRecommendations(foodQuery.trim() || undefined)}>
            이 음식으로 찾기
          </PillButton>
          <PillButton variant="outline" onClick={() => fetchRecommendations()}>
            아니! 그냥 랜덤으로 식당 추천해줘!
          </PillButton>
        </div>
      )}

      {(status === 'locating' || status === 'loading') && (
        <FoodLoading
          label={
            status === 'locating'
              ? '위치를 확인하는 중'
              : activeFoodQuery
                ? `주변 맛집 '${activeFoodQuery}' 검색중`
                : '주변 음식 찾는 중!'
          }
        />
      )}

      {status === 'error' && (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <p className="text-sm text-delete">{error}</p>
          <PillButton variant="accent" onClick={() => fetchRecommendations(activeFoodQuery || undefined)}>
            다시 시도
          </PillButton>
        </div>
      )}

      {status === 'done' && recommendations.length === 0 && (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <p className="text-ink/60">
            {activeFoodQuery
              ? `'${activeFoodQuery}'은(는) '${user.nickname}' 님 주변에 없어요!ㅠㅠ`
              : '근처에 새로 추천할 음식점을 못 찾았어요.'}
          </p>
          <PillButton variant="accent" onClick={() => setStatus('asking')}>
            다른 음식으로 다시 찾기
          </PillButton>
        </div>
      )}

      {status === 'done' && recommendations.length > 0 && myLocation && (
        <MapView
          center={myLocation}
          markers={recommendations.map((r) => ({
            id: r.id,
            name: r.name,
            lat: r.lat,
            lng: r.lng,
            placeUrl: r.placeUrl,
          }))}
        />
      )}

      {status === 'done' && recommendations.length > 0 && (
        <div className="space-y-4">
          {recommendations.map((r) => (
            <div key={r.id} className="rounded-3xl bg-white p-5 shadow-sm shadow-black/5">
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 font-display text-base">
                {r.placeUrl ? (
                  <a
                    href={r.placeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2"
                  >
                    {r.name}
                  </a>
                ) : (
                  <span>{r.name}</span>
                )}
                <span className="text-sm text-ink/50">| {r.category}</span>
                <span className="text-sm text-ink/50">| {r.distance}m</span>
              </div>
              {r.blurb && <p className="mt-2 text-sm">{r.blurb}</p>}
              <p className="mt-1 text-sm text-ink/50">{r.address}</p>
              <div className="mt-3 flex justify-end gap-2">
                {r.placeUrl && (
                  <a href={r.placeUrl} target="_blank" rel="noopener noreferrer">
                    <PillButton variant="outline" type="button">
                      카카오맵에서 보기
                    </PillButton>
                  </a>
                )}
                <Link
                  href={`/restaurants/new?name=${encodeURIComponent(r.name)}&address=${encodeURIComponent(r.address)}`}
                >
                  <PillButton variant="accent">내 리스트에 추가</PillButton>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
