'use client'

import { useState } from 'react'
import { DeliveryAnimation } from '@/components/icons/DeliveryAnimation'
import { Input, PillButton } from '@/components/ui'
import { signIn, signUp } from '@/lib/session'

function translateAuthError(message: string): string {
  if (message.includes('Invalid login credentials')) return '이메일 또는 비밀번호가 올바르지 않아요.'
  if (message.includes('User already registered')) return '이미 가입된 이메일이에요. 로그인해주세요.'
  if (message.includes('Password should be at least')) return '비밀번호는 6자 이상이어야 해요.'
  if (message.includes('Unable to validate email address')) return '이메일 형식을 확인해주세요.'
  return '오류가 발생했어요. 다시 시도해주세요.'
}

export function AuthStep({ onAuthed }: { onAuthed: () => void }) {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [nickname, setNickname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setInfo('')

    if (!email.trim() || !password) {
      setError('이메일과 비밀번호를 입력해주세요.')
      return
    }
    if (mode === 'signup' && !nickname.trim()) {
      setError('닉네임을 입력해주세요.')
      return
    }

    setSubmitting(true)
    if (mode === 'signup') {
      const { data, error: signUpError } = await signUp(email.trim(), password, nickname.trim())
      if (signUpError) {
        setError(translateAuthError(signUpError.message))
        setSubmitting(false)
        return
      }
      if (!data.session) {
        setInfo('가입 확인 이메일을 보냈어요. 메일함을 확인한 뒤 로그인해주세요.')
        setMode('login')
        setSubmitting(false)
        return
      }
      onAuthed()
    } else {
      const { error: signInError } = await signIn(email.trim(), password)
      if (signInError) {
        setError(translateAuthError(signInError.message))
        setSubmitting(false)
        return
      }
      onAuthed()
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center">
      <h1 className="font-display text-3xl leading-tight">{mode === 'signup' ? '회원가입' : '로그인'}</h1>

      <form onSubmit={submit} className="w-full max-w-sm space-y-3 text-left">
        {mode === 'signup' && (
          <Input
            placeholder="닉네임 (10자 이내)"
            maxLength={10}
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            autoFocus
          />
        )}
        <Input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="비밀번호 (6자 이상)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-sm text-delete">{error}</p>}
        {info && <p className="text-sm text-ink/70">{info}</p>}

        <PillButton type="submit" variant="accent" className="w-full" disabled={submitting}>
          {submitting ? '처리 중…' : mode === 'signup' ? '가입하고 시작하기' : '로그인'}
        </PillButton>
      </form>

      <button
        type="button"
        className="text-sm text-ink/50 underline"
        onClick={() => {
          setMode((m) => (m === 'signup' ? 'login' : 'signup'))
          setError('')
          setInfo('')
        }}
      >
        {mode === 'signup' ? '이미 계정이 있으신가요? 로그인' : '처음이신가요? 회원가입'}
      </button>

      <DeliveryAnimation className="w-48" tint={[56, 180, 106]} />
    </main>
  )
}
