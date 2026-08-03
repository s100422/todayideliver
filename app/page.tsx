import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const { data: matjips } = await supabase.from('맛집').select('*')

  return (
    <main>
      <h1>맛집 도장깨기</h1>
      <ul>
        {matjips?.map((matjip) => (
          <li key={matjip.id}>
            {matjip.name} - {matjip.food}
          </li>
        ))}
      </ul>
    </main>
  )
}
