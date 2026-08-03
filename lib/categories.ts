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
