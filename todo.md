# TODO — 오늘은 배달이다!

> plan.md 기반 실행 계획. 1단계씩 진행 후 사용자 피드백 받고 `[x]` 표시.

## 1단계 — DB 스키마
- [x] `categories` 테이블 생성 (id, user_id, name, created_at)
- [x] `restaurants` 테이블 생성 (id, user_id, category_id FK, name, address, used_delivery, score, review, memo, created_at)
- [x] RLS 활성화 + public 정책 (anon read/write, app에서 user_id 필터링)
- [x] 기존 `맛집` 데모 테이블은 유지 (삭제 안 함)

## 2단계 — 디자인 시스템
- [x] `images/Gemini_Generated_Image_...png` → `public/food-pattern.png`로 이동
- [x] 구글 폰트(이후 로컬 폰트로 교체) 적용, 종이질감 배경색/톤 설정
- [x] 공용 컴포넌트 스타일: 알약 버튼, 알약 칩, 인풋, 카드
- [x] 배달 오토바이 SVG 아이콘 제작
- [x] 구글 폰트 대신 로컬 폰트(배민 을지로체=제목/버튼, 배민 연성체=포인트 문구)로 교체

## 3단계 — 온보딩 플로우
- [x] localStorage 기반 user_id/nickname 유틸 (`lib/localUser.ts`)
- [x] 인트로 화면
- [x] 닉네임 입력 화면
- [x] 카테고리 최초 생성 화면 (1개 이상)
- [x] 온보딩 완료 시 메인으로 이동, 재방문 시 스킵

## 4단계 — 메인 리스트 화면
- [x] 카테고리 칩 필터 (전체 + 카테고리별 + 추가 버튼)
- [x] 정렬 드롭다운 (최신/오래전/평점높은/평점낮은)
- [x] 빈 상태 UI
- [x] 음식점 카드 리스트 (평점, 리뷰, 특이사항, 수정/삭제)

## 5단계 — 음식점 등록/수정
- [x] 등록 폼 (이름/주소/카테고리 선택/배달경험 체크)
- [x] 배달경험 '예' → 평점+리뷰 필드 노출
- [x] 배달경험 '아니요' → 평점/리뷰 숨김, 특이사항만
- [x] 수정 폼 재사용, 삭제 기능

## 6단계 — 카테고리 관리
- [x] 카테고리 목록 + 수정/삭제 (삭제 시 소속 음식점도 cascade로 삭제, DB에서 확인함)
- [x] 카테고리 추가
- [x] 인트로 화면 픽토 애니메이션 (mp4 자동재생/루프/무음)

## 7단계 — 통합 테스트 & 배포
- [ ] 로컬 브라우저 전체 플로우 테스트
- [ ] git commit & push
- [ ] Vercel 재배포 확인
