# StockSage

StockSage는 주식 투자를 처음 시작하는 분들을 위한 간단한 투자 보조 도구입니다. 기술적 분석의 기초가 되는 이동평균선을 활용하여 매수/매도 시점을 제안합니다.

## 주요 기능

- 실시간 주가 차트 시각화
- 7일/14일 이동평균선 기반 분석
- 매수/매도/관망 추천
- 다크모드 지원

## 기술 스택

- Next.js 14 (App Router)
- Tailwind CSS
- Chart.js
- TypeScript

## 시작하기

1. 저장소를 클론합니다:
```bash
git clone https://github.com/yourusername/stocksage.git
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

4. 브라우저에서 [http://localhost:3000](http://localhost:3000)을 엽니다.

## 배포

이 프로젝트는 Vercel에 배포되어 있습니다:
[https://stocksage.vercel.app](https://stocksage.vercel.app)

## 프로젝트 구조

```
📁 /stocksage/
├── app/
│   ├── page.tsx            # Home
│   ├── about/page.tsx      # About
│   ├── contact/page.tsx    # Contact
├── components/
│   ├── Chart.tsx           # 차트 컴포넌트
│   ├── Selector.tsx        # 종목 선택 UI
│   └── ResultCard.tsx      # 결과 요약 카드
├── data/
│   └── stocks.json         # mock 주가 데이터
├── styles/
│   └── globals.css
├── public/
│   └── icon.png
├── tailwind.config.js
├── next.config.js
├── README.md
```

## 분석 로직

- MA7 = 최근 7일 가격 평균
- MA14 = 최근 14일 가격 평균
- 분석 기준:
  - MA7 > MA14 → "상승 추세, 매수 추천"
  - MA7 < MA14 → "하락 추세, 관망 또는 매도"
  - MA7 ≈ MA14 → "횡보 추세, 관망"

## 주의사항

이 도구는 투자 결정을 위한 참고용이며, 실제 투자 결정은 반드시 전문가와 상담하시기 바랍니다.

## 라이선스

MIT License
