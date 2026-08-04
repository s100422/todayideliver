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
- [x] 로컬 브라우저 전체 플로우 테스트
- [x] git commit & push
- [x] Vercel 재배포 확인

## 8단계 — UI/UX 버그 수정 (2026-08-04 피드백)
- [x] 카테고리 칩 가로 스크롤: 스크롤바 숨김 유지 + 마우스 휠(세로→가로 변환)/드래그로 넘기기 지원
- [x] 음식점 등록/수정, 카테고리 관리 화면에 뒤로가기 버튼 추가
- [x] 메인 리스트 헤더 영상(`main-header-animation.mp4`)에 체크무늬 배경이 있는 다른 장면(택배기사+문 씬)이 섞여 있던 문제 수정 — 오토바이만 나오는 구간(0~1.45초)만 남기고 트리밍

## 9단계 — 로그인 도입 (이메일/비밀번호, Supabase Auth)
- [x] Supabase Auth 이메일/비밀번호 로그인 활성화 확인 (이메일 확인 필수가 기본값 — 가입 후 메일 확인 필요)
- [x] 로그인/회원가입 화면 추가 (`components/auth/AuthStep.tsx`), 온보딩 최상단 진입점으로 배치 (로그인 필수)
- [x] `categories`/`restaurants` RLS 정책을 `auth.uid()` 기준으로 변경 (마이그레이션: `require_auth_for_categories_and_restaurants`)
- [x] `lib/localUser.ts` 대신 `lib/session.ts`(Supabase Auth 세션 기반)로 교체, 페이지 라우팅은 `app/page.tsx`에서 세션+카테고리 존재 여부로 분기
- [x] 첫 로그인 시 이 브라우저의 기존 localStorage user_id 데이터를 새 계정 id로 자동 이전 (`migrate_local_data` RPC, SECURITY DEFINER)
- [x] 로그아웃 기능 추가 (MainList 상단)
- [x] 신규 가입 → 로그아웃 → 로그인(다른 localStorage 상태에서) 시 데이터 유지되는지 실제 테스트로 확인
- [x] **확인 완료**: 예전 localStorage 기반 데이터 뭉치들 — 사용자 확인 후 전부 삭제하고 새로 시작하기로 함
- [x] 가입 확인 이메일 링크가 localhost로 가던 문제 — `emailRedirectTo`를 `window.location.origin` 기준으로 보내도록 수정

## 최종 점검 (출시 전에 다시 확인)
- [ ] 이메일 확인(회원가입 컨펌 메일) 플로우 — Supabase 대시보드 Site URL/Redirect URLs 설정 완료 후 실제로 눌러서 확인
- [ ] "이메일 확인 필수" 옵션을 끌지 유지할지 최종 결정

## 10단계 — AI 위치 기반 음식점 추천 (Gemini API)
- [x] 데이터 소스: 카카오 로컬 API (주변 음식점 검색)
- [x] Gemini 역할: 후보별 추천 이유/멘트 문구 생성만 (선별·순위는 서버 로직에서)
- [x] 중복 판별: 도로명 주소 정확 비교로 하기로 함 → 이를 위해 등록 폼 주소 입력을 자유 텍스트에서 카카오/다음 주소 검색(도로명주소)으로 교체 (`components/restaurants/AddressSearchField.tsx`), 팝업 대신 임베드 모달 방식 사용 (팝업 차단 이슈 회피)
- [ ] **대기 중**: 카카오 로컬 API REST 키 발급 필요 (사용자가 카카오 개발자센터에서 발급 예정)
- [ ] Gemini API 키를 환경변수로 등록 (사용자가 키 보유 중 — 전달받아 설정)
- [ ] 서버 라우트 설계: 위치(lat/lng) + 기존 등록 주소 목록 → 카카오 로컬 API 검색 → 중복 제거 → Gemini로 후보별 추천 문구 생성 → 결과 반환
- [ ] 프론트: 위치 권한 요청 UI, 추천 결과 리스트 화면, "내 리스트에 추가" 연동
- [ ] 실제 카카오 키 받으면 세부 실행 계획 확정 후 진행
