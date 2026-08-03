'use client'

import { useEffect, useRef } from 'react'

const CANVAS_WIDTH = 320
const CANVAS_HEIGHT = 180
const OPAQUE_BELOW = 140
const TRANSPARENT_ABOVE = 185
const FRAME_INTERVAL_MS = 1000 / 30

export function DeliveryAnimation({ className }: { className?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return

    video.muted = true
    video.play().catch(() => {})

    function draw() {
      if (video && ctx && video.readyState >= 2) {
        ctx.drawImage(video, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
        const frame = ctx.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
        const data = frame.data
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i]
          const g = data[i + 1]
          const b = data[i + 2]
          const brightness = (r + g + b) / 3
          const saturated = Math.max(r, g, b) - Math.min(r, g, b) > 30
          if (!saturated) {
            const t = (brightness - OPAQUE_BELOW) / (TRANSPARENT_ABOVE - OPAQUE_BELOW)
            const keepFraction = 1 - Math.min(1, Math.max(0, t))
            data[i + 3] = Math.round(data[i + 3] * keepFraction)
          }
        }
        ctx.putImageData(frame, 0, 0)
      }
    }
    const interval = setInterval(draw, FRAME_INTERVAL_MS)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={`relative aspect-video overflow-hidden ${className ?? ''}`}>
      <video
        ref={videoRef}
        src="/delivery-animation.mp4"
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
        className="absolute h-px w-px opacity-0"
      />
      <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="h-full w-full" />
    </div>
  )
}
