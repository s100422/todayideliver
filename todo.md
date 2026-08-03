# TODO — 오늘은 배달이다!

> plan.md 기반 실행 계획. 1단계씩 진행 후 사용자 피드백 받고 `[x]` 표시.

## 1단계 — DB 스키마
- [ ] `categories` 테이블 생성 (id, user_id, name, created_at)
- [ ] `restaurants` 테이블 생성 (id, user_id, category_id FK, name, address, used_delivery, score, review, memo, created_at)
- [ ] RLS 활성화 + public 정책 (anon read/write, app에서 user_id 필터링)
- [ ] 기존 `맛집` 데모 테이블은 유지 (삭제 안 함)

## 2단계 — 디자인 시스템
- [ ] `images/Gemini_Generated_Image_...png` → `public/food-pattern.png`로 이동
- [ ] 구글 폰트(Black Han Sans) 적용, 종이질감 배경색/톤 설정
- [ ] 공용 컴포넌트 스타일: 알약 버튼, 알약 칩, 인풋, 카드
- [ ] 배달 오토바이 SVG 아이콘 제작

## 3단계 — 온보딩 플로우
- [ ] localStorage 기반 user_id/nickname 유틸 (`lib/localUser.ts`)
- [ ] 인트로 화면
- [ ] 닉네임 입력 화면
- [ ] 카테고리 최초 생성 화면 (1개 이상)
- [ ] 온보딩 완료 시 메인으로 이동, 재방문 시 스킵

## 4단계 — 메인 리스트 화면
- [ ] 카테고리 칩 필터 (전체 + 카테고리별 + 추가 버튼)
- [ ] 정렬 드롭다운 (최신/오래전/평점높은/평점낮은)
- [ ] 빈 상태 UI
- [ ] 음식점 카드 리스트 (평점, 리뷰, 특이사항, 수정/삭제)

## 5단계 — 음식점 등록/수정
- [ ] 등록 폼 (이름/주소/카테고리 선택/배달경험 체크)
- [ ] 배달경험 '예' → 평점+리뷰 필드 노출
- [ ] 배달경험 '아니요' → 평점/리뷰 숨김, 특이사항만
- [ ] 수정 폼 재사용, 삭제 기능

## 6단계 — 카테고리 관리
- [ ] 카테고리 목록 + 수정/삭제
- [ ] 카테고리 추가

## 7단계 — 통합 테스트 & 배포
- [ ] 로컬 브라우저 전체 플로우 테스트
- [ ] git commit & push
- [ ] Vercel 재배포 확인
