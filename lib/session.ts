import type { User } from '@supabase/supabase-js'
import { supabase } from './supabase'

export type AppUser = {
  userId: string
  nickname: string
}

function toAppUser(user: User | null | undefined): AppUser | null {
  if (!user) return null
  return { userId: user.id, nickname: (user.user_metadata?.nickname as string) ?? '' }
}

export async function getCurrentUser(): Promise<AppUser | null> {
  const { data } = await supabase.auth.getSession()
  return toAppUser(data.session?.user)
}

export function subscribeAuth(callback: (user: AppUser | null) => void) {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(toAppUser(session?.user))
  })
  return () => data.subscription.unsubscribe()
}

export function signUp(email: string, password: string, nickname: string) {
  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: { nickname },
      emailRedirectTo: typeof window !== 'undefined' ? window.location.origin : undefined,
    },
  })
}

export function signIn(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password })
}

export function signOut() {
  return supabase.auth.signOut()
}
