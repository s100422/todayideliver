import { NextRequest, NextResponse } from 'next/server'

const KAKAO_CATEGORY_URL = 'https://dapi.kakao.com/v2/local/search/category.json'
const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'
const RESTAURANT_CATEGORY_CODE = 'FD6'
const SEARCH_RADIUS_METERS = 1500
const MAX_CANDIDATES = 5

type KakaoDocument = {
  id: string
  place_name: string
  category_name: string
  address_name: string
  road_address_name: string
  distance: string
  phone: string
  place_url: string
}

type ExistingRestaurant = {
  name: string
  address: string | null
}

function normalize(value: string) {
  return value.replace(/\s+/g, '')
}

function isAlreadyRegistered(candidate: KakaoDocument, existing: ExistingRestaurant[]) {
  const candidateAddress = normalize(candidate.road_address_name || candidate.address_name)
  const candidateName = normalize(candidate.place_name)
  return existing.some((r) => {
    const existingAddress = r.address ? normalize(r.address) : ''
    const existingName = normalize(r.name)
    if (existingAddress && candidateAddress && existingAddress === candidateAddress) return true
    return existingName === candidateName
  })
}

async function fetchBlurbs(candidates: KakaoDocument[], apiKey: string) {
  const prompt = `아래는 사용자 근처의 배달 음식점 후보 목록이야. 각 가게에 대해 한 줄짜리 재치있는 추천 멘트를 한국어로 만들어줘. 이름은 그대로 유지하고, 카테고리나 거리 정보를 살짝 참고해도 좋아.\n\n${candidates
    .map((c, i) => `${i + 1}. ${c.place_name} (${c.category_name}, ${c.distance}m)`)
    .join('\n')}`

  const res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'object',
          properties: {
            recommendations: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  blurb: { type: 'string' },
                },
                required: ['name', 'blurb'],
              },
            },
          },
          required: ['recommendations'],
        },
      },
    }),
  })

  if (!res.ok) return []
  const data = await res.json()
  try {
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '{}'
    return (JSON.parse(text).recommendations ?? []) as { name: string; blurb: string }[]
  } catch {
    return []
  }
}

export async function POST(req: NextRequest) {
  const kakaoKey = process.env.KAKAO_REST_API_KEY
  const geminiKey = process.env.Gemini_API
  if (!kakaoKey || !geminiKey) {
    return NextResponse.json({ error: 'API 키가 설정되지 않았어요.' }, { status: 500 })
  }

  const body = (await req.json()) as {
    lat?: number
    lng?: number
    existing?: ExistingRestaurant[]
  }
  const { lat, lng, existing = [] } = body

  if (typeof lat !== 'number' || typeof lng !== 'number') {
    return NextResponse.json({ error: '위치 정보가 필요해요.' }, { status: 400 })
  }

  const kakaoRes = await fetch(
    `${KAKAO_CATEGORY_URL}?category_group_code=${RESTAURANT_CATEGORY_CODE}&x=${lng}&y=${lat}&radius=${SEARCH_RADIUS_METERS}&size=15&sort=distance`,
    { headers: { Authorization: `KakaoAK ${kakaoKey}` } }
  )
  if (!kakaoRes.ok) {
    return NextResponse.json({ error: '주변 음식점을 찾지 못했어요.' }, { status: 502 })
  }

  const kakaoData = (await kakaoRes.json()) as { documents: KakaoDocument[] }
  const candidates = kakaoData.documents
    .filter((doc) => !isAlreadyRegistered(doc, existing))
    .slice(0, MAX_CANDIDATES)

  if (candidates.length === 0) {
    return NextResponse.json({ recommendations: [] })
  }

  const blurbs = await fetchBlurbs(candidates, geminiKey)

  const recommendations = candidates.map((c) => {
    const match = blurbs.find((b) => normalize(b.name) === normalize(c.place_name))
    return {
      id: c.id,
      name: c.place_name,
      category: c.category_name.split('>').pop()?.trim() ?? c.category_name,
      address: c.road_address_name || c.address_name,
      distance: Number(c.distance),
      phone: c.phone,
      placeUrl: c.place_url,
      blurb: match?.blurb ?? '',
    }
  })

  return NextResponse.json({ recommendations })
}
