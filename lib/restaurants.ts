import { supabase } from './supabase'

export type Restaurant = {
  id: number
  user_id: string
  category_id: number
  name: string
  address: string | null
  used_delivery: boolean
  score: number | null
  review: string | null
  memo: string | null
  created_at: string
}

export type SortOption = 'newest' | 'oldest' | 'score_desc' | 'score_asc'

export async function listRestaurants(
  userId: string,
  opts: { categoryId?: number; sort?: SortOption } = {}
): Promise<Restaurant[]> {
  let query = supabase.from('restaurants').select('*').eq('user_id', userId)
  if (opts.categoryId) {
    query = query.eq('category_id', opts.categoryId)
  }

  switch (opts.sort) {
    case 'oldest':
      query = query.order('created_at', { ascending: true })
      break
    case 'score_desc':
      query = query.order('score', { ascending: false, nullsFirst: false })
      break
    case 'score_asc':
      query = query.order('score', { ascending: true, nullsFirst: false })
      break
    default:
      query = query.order('created_at', { ascending: false })
  }

  const { data, error } = await query
  if (error) throw error
  return data ?? []
}

export async function deleteRestaurant(id: number): Promise<void> {
  const { error } = await supabase.from('restaurants').delete().eq('id', id)
  if (error) throw error
}
