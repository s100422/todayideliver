export const FOOD_QUOTES = [
  '금강산도 식후경',
  '먹는 게 남는 거다',
  '밥이 보약이다',
  '배부르면 세상이 아름답다',
  '오늘 뭐 먹지가 인생 최대 고민',
  '맛있으면 0칼로리',
  '치킨은 살 안 쪄요, 마음의 양식이에요',
  '식후 디저트는 사치가 아니라 필수',
  '배달의 민족은 배고픔을 참지 않는다',
  '먹다가 죽어도 여한이 없다',
]

export function randomFoodQuote(): string {
  return FOOD_QUOTES[Math.floor(Math.random() * FOOD_QUOTES.length)]
}
