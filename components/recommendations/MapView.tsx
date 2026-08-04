'use client'

import { useEffect, useRef, useState } from 'react'

type MapMarker = {
  id: string
  name: string
  lat: number
  lng: number
  placeUrl: string
}

declare global {
  interface Window {
    kakao?: any
  }
}

const SCRIPT_SRC = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_JS_KEY}&autoload=false`

let scriptPromise: Promise<void> | null = null

function loadKakaoMapScript(): Promise<void> {
  if (typeof window !== 'undefined' && window.kakao?.maps) return Promise.resolve()
  if (scriptPromise) return scriptPromise
  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = SCRIPT_SRC
    script.onload = () => window.kakao!.maps.load(() => resolve())
    script.onerror = () => {
      scriptPromise = null
      reject(new Error('지도를 불러오지 못했어요.'))
    }
    document.head.appendChild(script)
  })
  return scriptPromise
}

export function MapView({
  center,
  markers,
}: {
  center: { lat: number; lng: number }
  markers: MapMarker[]
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    if (!containerRef.current) return

    loadKakaoMapScript()
      .then(() => {
        if (cancelled || !containerRef.current) return
        const { kakao } = window
        const map = new kakao.maps.Map(containerRef.current, {
          center: new kakao.maps.LatLng(center.lat, center.lng),
          level: 4,
        })

        new kakao.maps.Marker({
          position: new kakao.maps.LatLng(center.lat, center.lng),
          map,
        })

        markers.forEach((m) => {
          const position = new kakao.maps.LatLng(m.lat, m.lng)
          const marker = new kakao.maps.Marker({ position, map })

          const content = document.createElement('div')
          content.style.cssText =
            'padding:4px 10px;font-size:12px;white-space:nowrap;background:white;border-radius:8px;box-shadow:0 2px 6px rgba(0,0,0,0.2);'
          content.textContent = m.name
          const infowindow = new kakao.maps.InfoWindow({ content, removable: false })

          kakao.maps.event.addListener(marker, 'mouseover', () => infowindow.open(map, marker))
          kakao.maps.event.addListener(marker, 'mouseout', () => infowindow.close())
          if (m.placeUrl) {
            kakao.maps.event.addListener(marker, 'click', () => {
              window.open(m.placeUrl, '_blank', 'noopener,noreferrer')
            })
          }
        })
      })
      .catch((err) => {
        console.error('[MapView] 카카오맵 로드 실패:', err)
        if (!cancelled) setError('지도를 불러오지 못했어요. (콘솔에 에러 로그 확인 가능)')
      })

    return () => {
      cancelled = true
    }
  }, [center.lat, center.lng, markers])

  if (error) {
    return (
      <div className="flex h-64 w-full items-center justify-center rounded-3xl bg-black/5 p-4 text-center text-sm text-ink/50">
        {error}
      </div>
    )
  }

  return <div ref={containerRef} className="h-64 w-full overflow-hidden rounded-3xl" />
}
