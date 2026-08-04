'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { DeliveryAnimation } from '@/components/icons/DeliveryAnimation'
import { BackButton, Input, PillButton } from '@/components/ui'
import {
  createCategories,
  deleteCategory,
  listCategories,
  updateCategory,
  type Category,
} from '@/lib/categories'
import { getLocalUser, type LocalUser } from '@/lib/localUser'

export default function CategoriesPage() {
  const router = useRouter()
  const [user, setUser] = useState<LocalUser | null | undefined>(undefined)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingName, setEditingName] = useState('')
  const [newName, setNewName] = useState('')

  async function refresh(userId: string) {
    setCategories(await listCategories(userId))
    setLoading(false)
  }

  useEffect(() => {
    const localUser = getLocalUser()
    setUser(localUser)
    if (localUser) refresh(localUser.userId)
  }, [])

  if (user === undefined || loading) {
    return null
  }

  if (!user) {
    router.replace('/')
    return null
  }

  async function handleAdd() {
    const trimmed = newName.trim()
    if (!trimmed || !user) return
    await createCategories(user.userId, [trimmed])
    setNewName('')
    await refresh(user.userId)
  }

  async function handleSaveEdit() {
    const trimmed = editingName.trim()
    if (!trimmed || editingId == null || !user) return
    await updateCategory(editingId, trimmed)
    setEditingId(null)
    await refresh(user.userId)
  }

  async function handleDelete(id: number) {
    if (!user) return
    const confirmed = window.confirm(
      '이 카테고리를 삭제하면 여기 등록된 음식점도 함께 삭제돼요. 삭제할까요?'
    )
    if (!confirmed) return
    await deleteCategory(id)
    await refresh(user.userId)
  }

  return (
    <main className="relative mx-auto flex min-h-screen max-w-lg flex-col items-center gap-6 p-6 pb-16 text-center">
      <BackButton className="absolute left-6 top-6" />
      <h1 className="font-display text-4xl leading-tight">카테고리 수정</h1>

      <div className="w-full space-y-3 text-left">
        {categories.map((c) => (
          <div key={c.id} className="flex items-center gap-3 rounded-full bg-black/10 px-5 py-3">
            {editingId === c.id ? (
              <>
                <Input
                  className="flex-1"
                  maxLength={10}
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  autoFocus
                />
                <button className="shrink-0 text-sm font-medium text-edit" onClick={handleSaveEdit}>
                  저장
                </button>
                <button
                  className="shrink-0 text-sm font-medium text-ink/50"
                  onClick={() => setEditingId(null)}
                >
                  취소
                </button>
              </>
            ) : (
              <>
                <span className="flex-1 font-display">{c.name}</span>
                <button
                  className="shrink-0 text-sm font-medium text-edit"
                  onClick={() => {
                    setEditingId(c.id)
                    setEditingName(c.name)
                  }}
                >
                  수정
                </button>
                <button
                  className="shrink-0 text-sm font-medium text-delete"
                  onClick={() => handleDelete(c.id)}
                >
                  삭제
                </button>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="flex w-full items-center gap-2">
        <Input
          placeholder="10자 이내"
          maxLength={10}
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <PillButton variant="muted" onClick={handleAdd} type="button">
          ＋
        </PillButton>
      </div>

      <Link href="/">
        <PillButton variant="outline">완료</PillButton>
      </Link>

      <DeliveryAnimation className="w-48" />
    </main>
  )
}
