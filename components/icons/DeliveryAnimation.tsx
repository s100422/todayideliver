'use client'

import { useEffect, useRef } from 'react'

export function DeliveryAnimation({ className }: { className?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.muted = true
    video.play().catch(() => {})
  }, [])

  return (
    <video
      ref={videoRef}
      className={className}
      src="/delivery-animation.mp4"
      autoPlay
      loop
      muted
      playsInline
      controls={false}
      aria-hidden="true"
    />
  )
}
