'use client'

import { useState } from 'react'
import { BackButton, Input, PillButton, Select, Textarea } from '@/components/ui'
import type { Category } from '@/lib/categories'
import type { RestaurantInput } from '@/lib/restaurants'
import { AddressSearchField } from './AddressSearchField'

export type RestaurantFormValues = {
  name: string
  address: string
  categoryId: string
  usedDelivery: boolean
  score: string
  review: string
  memo: string
}

const EMPTY_VALUES: RestaurantFormValues = {
  name: '',
  address: '',
  categoryId: '',
  usedDelivery: true,
  score: '',
  review: '',
  memo: '',
}

export function RestaurantForm({
  categories,
  initialValues,
  defaultCategoryId,
  defaultName,
  defaultAddress,
  onSubmit,
  title = '음식점 등록',
  extraAction,
}: {
  categories: Category[]
  initialValues?: RestaurantFormValues
  defaultCategoryId?: string
  defaultName?: string
  defaultAddress?: string
  onSubmit: (input: RestaurantInput) => Promise<void>
  title?: string
  extraAction?: React.ReactNode
}) {
  const [values, setValues] = useState<RestaurantFormValues>(
    initialValues ?? {
      ...EMPTY_VALUES,
      categoryId: defaultCategoryId ?? '',
      name: defaultName ?? '',
      address: defaultAddress ?? '',
    }
  )
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  function set<K extends keyof RestaurantFormValues>(key: K, value: RestaurantFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  async function submit() {
    const name = values.name.trim()
    if (!name) {
      setError('음식점 이름을 입력해주세요.')
      return
    }
    if (!values.categoryId) {
      setError('카테고리를 선택해주세요.')
      return
    }
    const score = values.usedDelivery && values.score !== '' ? Number(values.score) : null
    if (score !== null && (Number.isNaN(score) || score < 0 || score > 5)) {
      setError('평점은 0~5 사이 숫자로 입력해주세요.')
      return
    }

    setError('')
    setSubmitting(true)
    try {
      await onSubmit({
        category_id: Number(values.categoryId),
        name,
        address: values.address.trim() || null,
        used_delivery: values.usedDelivery,
        score,
        review: values.usedDelivery ? values.review.trim() || null : null,
        memo: values.memo.trim() || null,
      })
    } catch {
      setError('저장에 실패했어요. 다시 시도해주세요.')
      setSubmitting(false)
    }
  }

  return (
    <main className="mx-auto max-w-lg space-y-6 p-6 pb-16">
      <div className="flex items-center gap-3">
        <BackButton />
        <h1 className="font-display text-3xl">{title}</h1>
      </div>

      <FormRow label="음식점 이름">
        <Input
          placeholder="10자 이내"
          maxLength={10}
          value={values.name}
          onChange={(e) => set('name', e.target.value)}
        />
      </FormRow>

      <FormRow label="음식점 주소">
        <AddressSearchField value={values.address} onChange={(address) => set('address', address)} />
      </FormRow>

      <FormRow label="카테고리">
        <Select value={values.categoryId} onChange={(e) => set('categoryId', e.target.value)}>
          <option value="">선택해주세요</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>
      </FormRow>

      <FormRow label={<>배달 시킨 적{'\n'}있나요?</>}>
        <div className="flex gap-2 py-2" role="radiogroup" aria-label="배달 시킨 적 있나요?">
          <PillButton
            type="button"
            role="radio"
            aria-checked={values.usedDelivery}
            variant={values.usedDelivery ? 'solid' : 'outline'}
            onClick={() => set('usedDelivery', true)}
          >
            예
          </PillButton>
          <PillButton
            type="button"
            role="radio"
            aria-checked={!values.usedDelivery}
            variant={!values.usedDelivery ? 'solid' : 'outline'}
            onClick={() => set('usedDelivery', false)}
          >
            아니요
          </PillButton>
        </div>
      </FormRow>

      {values.usedDelivery && (
        <>
          <FormRow label="평점">
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min={0}
                max={5}
                step={0.1}
                value={values.score}
                onChange={(e) => set('score', e.target.value)}
                className="w-24"
              />
              <span className="text-ink/50">/ 5</span>
            </div>
          </FormRow>

          <div>
            <p className="mb-2 font-display text-xl">리뷰를 남겨주세요.</p>
            <Textarea
              rows={4}
              maxLength={500}
              placeholder="500자 이내"
              value={values.review}
              onChange={(e) => set('review', e.target.value)}
            />
          </div>
        </>
      )}

      <div>
        <p className="mb-2 font-display text-xl">특이사항을 써주세요.</p>
        <Textarea
          rows={4}
          maxLength={500}
          placeholder="500자 이내"
          value={values.memo}
          onChange={(e) => set('memo', e.target.value)}
        />
      </div>

      {error && <p className="text-sm text-delete">{error}</p>}

      <div className="flex justify-center gap-3">
        <PillButton variant="accent" onClick={submit} disabled={submitting}>
          {submitting ? '저장 중…' : '저장하기'}
        </PillButton>
        {extraAction}
      </div>
    </main>
  )
}

function FormRow({ label, children }: { label: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4">
      <p className="w-28 shrink-0 whitespace-pre-line font-display text-xl">{label}</p>
      <div className="flex-1">{children}</div>
    </div>
  )
}
