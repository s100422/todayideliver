'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { Chip } from '@/components/ui'
import type { Category } from '@/lib/categories'

export function CategoryChips({
  categories,
  selectedId,
  onSelect,
  addHref,
}: {
  categories: Category[]
  selectedId: number | null
  onSelect: (id: number | null) => void
  addHref: string
}) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const drag = useRef({ active: false, moved: false, startX: 0, startScrollLeft: 0 })

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    function onWheel(e: WheelEvent) {
      if (el!.scrollWidth <= el!.clientWidth) return
      e.preventDefault()
      el!.scrollLeft += e.deltaY !== 0 ? e.deltaY : e.deltaX
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [])

  function onMouseDown(e: React.MouseEvent<HTMLDivElement>) {
    const el = scrollRef.current
    if (!el) return
    drag.current = { active: true, moved: false, startX: e.clientX, startScrollLeft: el.scrollLeft }
  }

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = scrollRef.current
    if (!el || !drag.current.active) return
    const delta = e.clientX - drag.current.startX
    if (Math.abs(delta) > 4) drag.current.moved = true
    el.scrollLeft = drag.current.startScrollLeft - delta
  }

  function endDrag() {
    drag.current.active = false
  }

  function onClickCapture(e: React.MouseEvent<HTMLDivElement>) {
    if (drag.current.moved) {
      e.preventDefault()
      e.stopPropagation()
      drag.current.moved = false
    }
  }

  return (
    <div
      ref={scrollRef}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={endDrag}
      onMouseLeave={endDrag}
      onClickCapture={onClickCapture}
      className="no-scrollbar flex cursor-grab items-center gap-3 overflow-x-auto active:cursor-grabbing"
    >
      <div className="sticky left-0 z-10 flex shrink-0 items-center gap-3 bg-paper pr-3">
        <Chip active={selectedId === null} onClick={() => onSelect(null)}>
          전체
          <br />
          음식점
        </Chip>
        <div className="h-10 w-px bg-black/10" />
      </div>
      {categories.map((c) => (
        <Chip key={c.id} active={selectedId === c.id} onClick={() => onSelect(c.id)}>
          {c.name}
        </Chip>
      ))}
      <Link
        href={addHref}
        className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-white text-center font-display text-sm text-ink shadow-[0_4px_0_rgba(0,0,0,0.1),0_7px_12px_rgba(0,0,0,0.12)] transition active:translate-y-[3px] active:shadow-none"
      >
        ＋
      </Link>
    </div>
  )
}
