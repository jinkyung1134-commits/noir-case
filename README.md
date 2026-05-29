# NOIR CASE

케이스와 화면 디자인을 세트로 맞춰 판매하는 프리미엄 모바일 커머스 사이트입니다.

## 페이지 구성

- `index.html`: 메인 쇼핑 페이지
- `product.html`: 애플 공식 페이지 느낌의 상품 상세 페이지
- `checkout.html`: 주문서 및 결제 진입 페이지
- `admin.html`: 관리자 상품, 메인 화면, 주문 관리 페이지
- `i18n.js`: 한국어, 영어, 중국어 자동 감지 및 수동 전환
- `config.js`: Supabase 및 결제 설정
- `store.js`: 상품, 장바구니, 주문, 메인 화면 설정 저장 모듈
- `supabase-schema.sql`: Supabase 테이블과 Storage 정책 SQL

## 주요 기능

- 케이스, 화면 디자인, 케이스와 화면 디자인 세트 상품 지원
- 배송 상품, 디지털 다운로드 상품, 배송과 디지털 제공 혼합 상품 지원
- 메인 화면 상품 자동 전환 및 수동 전환
- 관리자에서 메인 화면에 보일 상품과 전환 시간 설정
- 관리자에서 사진, 동영상, 디지털 파일 업로드
- 상품 상세 페이지에서 사진, 동영상, 설명, 포함 구성, 구매 영역 표시
- 장바구니, 바로 구매, 주문서, 주문 상태 관리
- 디지털 상품만 주문하면 배송지 입력 자동 숨김
- 모바일 우선 반응형 화면
- 한국어, 영어, 중국어 지원
- 첫 접속 시 IP 국가 정보를 우선 감지하고, 실패하면 브라우저 언어로 감지
- 상단 언어 선택 메뉴로 수동 변경 가능
- Supabase 연결 시 상품, 주문, 메인 화면 설정, 업로드 파일을 클라우드에 저장
- Supabase 미연결 시 브라우저 로컬 저장소로 동작

## 관리자

관리자 페이지: `admin.html`

초기 비밀번호:

```text
BLACKCASE2026
```

관리자에서 할 수 있는 일:

- 상품 등록, 수정, 삭제
- 상품 타입 선택: 스타일 세트, 케이스, 화면 디자인
- 제공 방식 선택: 배송, 디지털 다운로드, 배송 + 디지털
- 포함 구성 입력
- 영어와 중국어 상품명, 설명, 배지, 포함 구성, 옵션을 상품별로 따로 입력
- 애플식 상세 페이지용 소개 섹션과 강조 스펙 입력
- 대표 이미지, 갤러리 이미지, 상품 동영상, 디지털 파일 업로드
- 메인 화면 노출 상품 설정
- 메인 화면 자동 전환 시간 설정
- 주문 상태 변경

## Supabase

1. Supabase의 SQL Editor에서 `supabase-schema.sql`을 실행합니다.
2. `config.js`에 Supabase URL과 Publishable key를 넣습니다.
3. Storage 버킷 이름은 기본값 `noir-case-assets`를 사용합니다.

예시:

```js
window.SiteConfig = {
  supabase: {
    url: "https://프로젝트아이디.supabase.co",
    anonKey: "Publishable key",
    storageBucket: "noir-case-assets",
  },
  payment: {
    provider: "demo",
    tossClientKey: "",
  },
};
```

`service_role` 키는 절대 프론트엔드 파일에 넣지 마세요.

## 결제

현재는 데모 주문으로 저장됩니다. Toss Payments 같은 실제 결제를 연결하려면 `config.js`에서 provider와 client key를 바꾸고, 운영 환경에서는 서버에서 결제 승인 검증을 추가해야 합니다.

```js
payment: {
  provider: "toss",
  tossClientKey: "토스 클라이언트 키",
}
```

## 운영 팁

- 이미 Supabase에 기존 상품이 저장되어 있으면 기본 샘플 상품 대신 Supabase 상품이 먼저 표시됩니다.
- 새로 추가한 다국어 샘플 상품을 보고 싶으면 관리자에서 초기화하거나 기존 상품에 영어/중국어 번역 정보를 추가해야 합니다.
- 실제 판매 전에는 결제 승인 검증, 개인정보 처리방침, 환불 정책, 배송 정책 페이지를 추가하는 것이 좋습니다.
- 가격은 원화 금액을 기준으로 저장하고, 화면에서는 언어에 따라 원, 달러, 위안으로 표시합니다. 환율은 `config.js`의 `currency.rates`에서 조정합니다.
- 상세 소개 섹션은 `eyebrow | title | body | image` 형식으로 한 줄씩 입력합니다.
- 강조 스펙은 `label | value | body` 형식으로 한 줄씩 입력합니다.

## GitHub Pages 배포

이 사이트는 정적 HTML/CSS/JS로 구성되어 있어서 GitHub Pages에 바로 올릴 수 있습니다.

1. GitHub에서 저장소를 만들거나 기존 저장소를 선택합니다.
2. 이 폴더의 파일을 저장소 루트에 업로드합니다.
3. 저장소 `Settings > Pages`에서 `Deploy from a branch`를 선택합니다.
4. Branch는 `main`, folder는 `/root`로 선택합니다.
5. 배포가 끝나면 GitHub Pages 주소를 모바일 브라우저에서 열어 확인합니다.

Codex에서 직접 업로드하려면 GitHub 앱을 해당 계정 또는 저장소에 설치해야 합니다.

## GitHub API 업로드

GitHub 앱 설치 대신 Personal Access Token을 쓸 수도 있습니다.

1. `.env.example`을 참고해서 `.env` 파일을 만듭니다.
2. `GITHUB_TOKEN`, `GITHUB_OWNER`, `GITHUB_REPO`를 입력합니다.
3. 아래 명령을 실행합니다.

```bash
node github-upload.js
```

`.env` 파일은 업로드 대상에서 제외됩니다.
