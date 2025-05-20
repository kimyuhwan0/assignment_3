# StockSage

StockSage는 실시간 주식 데이터와 고급 분석을 제공하는 웹 기반 주식 분석 플랫폼입니다.

## 주요 기능

- 실시간 주식 검색
- 상세 차트 분석
- 이동평균선 분석 (MA5, MA20, MA60, MA120)
- 거래량 분석
- 다양한 기간 선택 (15일, 1개월, 3개월, 6개월, 1년, 전체)

## 기술 스택

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Chart.js

## 시작하기

1. 저장소를 클론합니다:
```bash
git clone [repository-url]
cd stocksage
```

2. 의존성을 설치합니다:
```bash
npm install
```

3. 개발 서버를 실행합니다:
```bash
npm run dev
```

4. 브라우저에서 http://localhost:3000 으로 접속합니다.

## 프로젝트 구조

```
stocksage/
├── app/
│   ├── api/
│   │   ├── search/
│   │   └── stock-data/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── StockSearch.tsx
│   ├── StockChart.tsx
│   └── KeyFeatures.tsx
├── hooks/
│   └── useDebounce.ts
└── public/
```

## API 엔드포인트

### 검색 API
- `GET /api/search?q={query}`
  - 주식 심볼과 회사명으로 검색
  - 최대 20개의 결과 반환

### 주식 데이터 API
- `GET /api/stock-data?period={period}`
  - 기간별 주식 데이터 반환
  - 지원 기간: 15D, 1M, 3M, 6M, 1Y, ALL

## 라이선스

MIT License 