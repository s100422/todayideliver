const STORAGE_KEY = 'todayideliver_user'

export type LocalUser = {
  userId: string
  nickname: string
}

export function getLocalUser(): LocalUser | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as LocalUser
  } catch {
    return null
  }
}

export function clearLocalUser() {
  localStorage.removeItem(STORAGE_KEY)
}
