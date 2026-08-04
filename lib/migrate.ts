import { clearLocalUser, getLocalUser } from './localUser'
import { supabase } from './supabase'

export async function migrateLocalDataIfNeeded() {
  const local = getLocalUser()
  if (!local) return
  const { error } = await supabase.rpc('migrate_local_data', { p_old_user_id: local.userId })
  if (!error) clearLocalUser()
}
