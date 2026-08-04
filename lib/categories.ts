import { supabase } from './supabase'

export type Category = {
  id: number
  user_id: string
  name: string
  created_at: string
}

export async function listCategories(userId: string): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data ?? []
}

export async function createCategories(userId: string, names: string[]): Promise<Category[]> {
  const rows = names.map((name) => ({ user_id: userId, name }))
  const { data, error } = await supabase.from('categories').insert(rows).select()
  if (error) throw error
  return data ?? []
}

export async function updateCategory(id: number, name: string): Promise<void> {
  const { error } = await supabase.from('categories').update({ name }).eq('id', id)
  if (error) throw error
}

export async function deleteCategory(id: number): Promise<void> {
  const { error } = await supabase.from('categories').delete().eq('id', id)
  if (error) throw error
}

const CATEGORY_EMOJI_KEYWORDS: [string, string][] = [
  ['치킨', '🍗'],
  ['bbq', '🍗'],
  ['피자', '🍕'],
  ['떡볶이', '🍢'],
  ['족발', '🍖'],
  ['보쌈', '🍖'],
  ['곱창', '🥘'],
  ['막창', '🥘'],
  ['초밥', '🍣'],
  ['스시', '🍣'],
  ['회', '🐟'],
  ['해물', '🦐'],
  ['생선', '🐟'],
  ['중식', '🥡'],
  ['중국요리', '🥡'],
  ['짜장', '🥡'],
  ['버거', '🍔'],
  ['샌드위치', '🥪'],
  ['카페', '☕'],
  ['커피', '☕'],
  ['디저트', '🍰'],
  ['베이커리', '🍞'],
  ['분식', '🍢'],
  ['국밥', '🍚'],
  ['한식', '🍚'],
  ['찜', '🍲'],
  ['탕', '🍲'],
  ['국수', '🍜'],
  ['라면', '🍜'],
]

const CATEGORY_EMOJI_FALLBACK_POOL = ['🍽️', '🍱', '🥟', '🌮', '🥗', '🍛', '🍤', '🍩', '🥙', '🍡']

export function categoryEmoji(name: string): string {
  const lower = name.toLowerCase()
  const match = CATEGORY_EMOJI_KEYWORDS.find(([keyword]) => lower.includes(keyword))
  if (match) return match[1]

  let hash = 0
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0
  return CATEGORY_EMOJI_FALLBACK_POOL[hash % CATEGORY_EMOJI_FALLBACK_POOL.length]
}
