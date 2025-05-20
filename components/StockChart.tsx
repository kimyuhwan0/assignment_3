'use client'

import React, { useEffect, useState } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from 'chart.js'
import { Chart } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
)

interface StockChartProps {
  symbol: string
}

interface StockData {
  date: string
  price: number
  volume: number
  ma5: number | null
  ma20: number | null
  ma60: number | null
  ma120: number | null
}

export default function StockChart({ symbol }: StockChartProps) {
  const [stockData, setStockData] = useState<StockData[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState('1w')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hidden, setHidden] = useState([false, false, false, false, false, false])
  const [priceChanges, setPriceChanges] = useState<{
    weekChange: { change: number; percentChange: number } | null;
    monthChange: { change: number; percentChange: number } | null;
    yearChange: { change: number; percentChange: number } | null;
  } | null>(null)

  // 주가 변화 계산 함수
  const calculatePriceChange = (currentPrice: number, pastPrice: number) => {
    const change = currentPrice - pastPrice
    const percentChange = (change / pastPrice) * 100
    return {
      change,
      percentChange
    }
  }

  // 주가 정보 계산
  const calculatePriceChanges = (data: StockData[]) => {
    if (!data || data.length === 0 || !data[data.length - 1]) return null

    const currentPrice = data[data.length - 1].price
    const currentDate = new Date(data[data.length - 1].date)

    // 각 기간에 해당하는 데이터 포인트 찾기
    const findPriceByPeriod = (days: number) => {
      const targetDate = new Date(currentDate)
      targetDate.setDate(currentDate.getDate() - days)
      targetDate.setHours(0, 0, 0, 0)  // 시간 정보 초기화
      
      // 정확한 날짜 매칭 시도
      const exactMatch = data.find(d => {
        const dataDate = new Date(d.date)
        dataDate.setHours(0, 0, 0, 0)
        return dataDate.getTime() === targetDate.getTime()
      })
      
      if (exactMatch) return exactMatch.price

      // 가장 가까운 날짜 찾기 (과거 데이터만 고려)
      let closestPrice = null
      let minDiff = Infinity

      for (const item of data) {
        const itemDate = new Date(item.date)
        itemDate.setHours(0, 0, 0, 0)
        const diff = targetDate.getTime() - itemDate.getTime()
        
        // 과거 데이터만 고려하고, 가장 가까운 과거 데이터 선택
        if (diff >= 0 && diff < minDiff) {
          minDiff = diff
          closestPrice = item.price
        }
      }

      // 가장 가까운 과거 데이터가 없으면 가장 오래된 데이터 사용
      return closestPrice || data[0].price
    }

    // 각 기간별 가격 계산 (현재일 기준)
    const weekAgoPrice = findPriceByPeriod(7)  // 7일
    const monthAgoPrice = findPriceByPeriod(30)  // 1개월 (30일)
    const yearAgoPrice = findPriceByPeriod(365)  // 1년

    // 가격 변화 계산
    const calculateChange = (current: number, past: number) => {
      if (!past || past === 0) return null
      const change = current - past
      const percentChange = (change / past) * 100
      return { change, percentChange }
    }

    return {
      weekChange: calculateChange(currentPrice, weekAgoPrice),
      monthChange: calculateChange(currentPrice, monthAgoPrice),
      yearChange: calculateChange(currentPrice, yearAgoPrice)
    }
  }

  // 매매 추천 계산 함수
  const calculateRecommendation = (data: StockData[]) => {
    if (!data || data.length === 0 || !data[data.length - 1]) return null

    const currentPrice = data[data.length - 1].price
    const ma5 = data[data.length - 1].ma5 ?? 0
    const ma20 = data[data.length - 1].ma20 ?? 0
    const ma60 = data[data.length - 1].ma60 ?? 0
    const ma120 = data[data.length - 1].ma120 ?? 0

    // 기간별 분석 가중치 조정
    const getPeriodWeights = () => {
      switch (selectedPeriod) {
        case '1d':
          return { ma: 0.3, momentum: 0.5, trend: 0.2 }  // 단기 모멘텀 중시
        case '1w':
          return { ma: 0.4, momentum: 0.4, trend: 0.2 }  // 단기 이동평균과 모멘텀 균형
        case '1m':
          return { ma: 0.5, momentum: 0.3, trend: 0.2 }  // 중기 이동평균 중시
        case '3m':
        case '6m':
          return { ma: 0.4, momentum: 0.2, trend: 0.4 }  // 추세와 이동평균 균형
        case '1y':
        case 'all':
          return { ma: 0.3, momentum: 0.2, trend: 0.5 }  // 장기 추세 중시
        default:
          return { ma: 0.4, momentum: 0.3, trend: 0.3 }  // 기본값
      }
    }

    const weights = getPeriodWeights()

    // 1. 이동평균선 분석
    const maAnalysis = (() => {
      const conditions = {
        priceAboveMA5: currentPrice > ma5,
        priceAboveMA20: currentPrice > ma20,
        priceAboveMA60: currentPrice > ma60,
        priceAboveMA120: currentPrice > ma120,
        ma5AboveMA20: ma5 > ma20,
        ma20AboveMA60: ma20 > ma60,
        ma60AboveMA120: ma60 > ma120
      }
      
      let score = 0
      let analysis = []
      
      if (conditions.priceAboveMA5) {
        score += 1
        analysis.push('Current price is above 5-day moving average')
      }
      if (conditions.priceAboveMA20) {
        score += 1
        analysis.push('Current price is above 20-day moving average')
      }
      if (conditions.priceAboveMA60) {
        score += 1
        analysis.push('Current price is above 60-day moving average')
      }
      if (conditions.priceAboveMA120) {
        score += 1
        analysis.push('Current price is above 120-day moving average')
      }
      if (conditions.ma5AboveMA20) {
        score += 1
        analysis.push('5-day moving average is above 20-day moving average')
      }
      if (conditions.ma20AboveMA60) {
        score += 1
        analysis.push('20-day moving average is above 60-day moving average')
      }
      if (conditions.ma60AboveMA120) {
        score += 1
        analysis.push('60-day moving average is above 120-day moving average')
      }

      return { score, analysis }
    })()

    // 2. 모멘텀 분석
    const momentumAnalysis = (() => {
      // 기간별 모멘텀 분석 데이터 포인트 수 조정
      const getMomentumPoints = () => {
        switch (selectedPeriod) {
          case '1d':
            return { recent: 3, previous: 3 }  // 3시간 vs 3시간
          case '1w':
            return { recent: 3, previous: 3 }  // 3일 vs 3일
          case '1m':
            return { recent: 5, previous: 5 }  // 5일 vs 5일
          case '3m':
          case '6m':
            return { recent: 10, previous: 10 }  // 10일 vs 10일
          case '1y':
          case 'all':
            return { recent: 20, previous: 20 }  // 20일 vs 20일
          default:
            return { recent: 5, previous: 5 }
        }
      }

      const points = getMomentumPoints()
      const recentPoints = data.slice(-points.recent)
      const previousPoints = data.slice(-points.recent - points.previous, -points.recent)
      
      if (recentPoints.length < points.recent || previousPoints.length < points.previous) {
        return {
          score: 0,
          analysis: 'Insufficient data to perform momentum analysis'
        }
      }

      const recentAvg = recentPoints.reduce((sum, d) => sum + d.price, 0) / points.recent
      const previousAvg = previousPoints.reduce((sum, d) => sum + d.price, 0) / points.previous
      const momentum = recentAvg > previousAvg
      
      return {
        score: momentum ? 1 : -1,
        analysis: momentum 
          ? `Recent ${points.recent} data points average is higher than previous ${points.previous} data points (Bullish momentum)`
          : `Recent ${points.recent} data points average is lower than previous ${points.previous} data points (Bearish momentum)`
      }
    })()

    // 3. 추세 강도 분석
    const trendAnalysis = (() => {
      // 기간별 추세 분석 데이터 포인트 수 조정
      const getTrendPoints = () => {
        switch (selectedPeriod) {
          case '1d':
            return 5  // 5시간
          case '1w':
            return 5  // 5일
          case '1m':
            return 10  // 10일
          case '3m':
          case '6m':
            return 20  // 20일
          case '1y':
          case 'all':
            return 30  // 30일
          default:
            return 10
        }
      }

      const points = getTrendPoints()
      const recentPrices = data.slice(-points)
      if (recentPrices.length < 2) {
        return {
          score: 0.5,
          analysis: 'Insufficient data to perform trend analysis'
        }
      }

      const upDays = recentPrices.filter((d, i) => i > 0 && d.price > recentPrices[i - 1].price).length
      const trendStrength = upDays / (recentPrices.length - 1)
      
      let trendDescription = ''
      if (trendStrength >= 0.7) trendDescription = 'Strong bullish trend'
      else if (trendStrength >= 0.6) trendDescription = 'Bullish trend'
      else if (trendStrength >= 0.4) trendDescription = 'Sideways trend'
      else if (trendStrength >= 0.3) trendDescription = 'Bearish trend'
      else trendDescription = 'Strong bearish trend'

      return {
        score: trendStrength,
        analysis: `Recent ${recentPrices.length} data points, ${upDays} up (${trendDescription})`
      }
    })()

    // 종합 점수 계산 (0~10)
    const totalScore = (
      maAnalysis.score * weights.ma + 
      momentumAnalysis.score * weights.momentum + 
      trendAnalysis.score * weights.trend
    ) * 2

    // 추천 결정
    let recommendation = ''
    let description = ''
    let color = ''

    if (totalScore >= 8) {
      recommendation = 'Strong buy'
      description = 'Strong bullish trend and positive technical indicators confirmed'
      color = 'text-red-500'
    } else if (totalScore >= 6) {
      recommendation = 'Buy'
      description = 'Bullish trend confirmed, positive technical indicators'
      color = 'text-red-400'
    } else if (totalScore >= 4) {
      recommendation = 'Neutral'
      description = 'No clear trend visible, monitoring needed'
      color = 'text-yellow-500'
    } else if (totalScore >= 2) {
      recommendation = 'Sell'
      description = 'Bearish trend confirmed, negative technical indicators'
      color = 'text-blue-400'
    } else {
      recommendation = 'Strong sell'
      description = 'Strong bearish trend and negative technical indicators confirmed'
      color = 'text-blue-500'
    }

    return {
      recommendation,
      description,
      color,
      score: totalScore.toFixed(1),
      analysis: {
        ma: maAnalysis.analysis,
        momentum: momentumAnalysis.analysis,
        trend: trendAnalysis.analysis
      }
    }
  }

  const recommendation = calculateRecommendation(stockData)

  // 주식 데이터 가져오기
  const fetchStockData = async () => {
    if (!symbol) {
      console.warn('StockChart: No symbol provided')
      setError('Stock symbol is required')
      return
    }

    console.log('StockChart: Fetching data for symbol:', symbol)
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/stock-data?symbol=${symbol}&period=${selectedPeriod}`)
      console.log('StockChart: API response status:', response.status)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('StockChart: API error response:', errorText)
        throw new Error(`Failed to fetch stock data: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      console.log('StockChart: Received data points:', data.length)
      
      // 데이터 유효성 검사
      if (!data || !Array.isArray(data) || data.length === 0) {
        console.error('StockChart: Invalid data received - empty or not an array')
        throw new Error('Invalid stock data received')
      }

      // 데이터 형식 검사
      const isValidData = data.every(item => 
        typeof item.date === 'string' &&
        typeof item.price === 'number' &&
        typeof item.volume === 'number' &&
        (item.ma5 === null || typeof item.ma5 === 'number') &&
        (item.ma20 === null || typeof item.ma20 === 'number') &&
        (item.ma60 === null || typeof item.ma60 === 'number') &&
        (item.ma120 === null || typeof item.ma120 === 'number')
      )

      if (!isValidData) {
        console.error('StockChart: Invalid data format received')
        throw new Error('Invalid data format received')
      }

      console.log('StockChart: Data validation passed')
      setStockData(data)
      setPriceChanges(calculatePriceChanges(data))
    } catch (error) {
      console.error('StockChart: Error fetching stock data:', error)
      setError(error instanceof Error ? error.message : 'Failed to fetch stock data')
      setStockData([])
      setPriceChanges(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    console.log('StockChart: useEffect triggered with symbol:', symbol)
    if (symbol) {
      fetchStockData()
    }
  }, [symbol, selectedPeriod])

  const datasets = [
    {
      type: 'line' as const,
      label: 'Price',
      data: stockData.map(d => d.price),
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
      yAxisID: 'y',
      tension: 0.1,
      pointRadius: 0,
      borderWidth: 4,
      hidden: hidden[0],
    },
    {
      type: 'line' as const,
      label: 'MA5',
      data: stockData.map(d => d.ma5),
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
      yAxisID: 'y',
      tension: 0.1,
      pointRadius: 0,
      borderWidth: 1.4,
      hidden: hidden[1],
    },
    {
      type: 'line' as const,
      label: 'MA20',
      data: stockData.map(d => d.ma20),
      borderColor: 'rgb(54, 162, 235)',
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
      yAxisID: 'y',
      tension: 0.1,
      pointRadius: 0,
      borderWidth: 1.4,
      hidden: hidden[2],
    },
    {
      type: 'line' as const,
      label: 'MA60',
      data: stockData.map(d => d.ma60),
      borderColor: 'rgb(255, 206, 86)',
      backgroundColor: 'rgba(255, 206, 86, 0.5)',
      yAxisID: 'y',
      tension: 0.1,
      pointRadius: 0,
      borderWidth: 1.4,
      hidden: hidden[3],
    },
    {
      type: 'line' as const,
      label: 'MA120',
      data: stockData.map(d => d.ma120),
      borderColor: 'rgb(153, 102, 255)',
      backgroundColor: 'rgba(153, 102, 255, 0.5)',
      yAxisID: 'y',
      tension: 0.1,
      pointRadius: 0,
      borderWidth: 1.4,
      hidden: hidden[4],
    },
    {
      type: 'bar' as const,
      label: 'Volume',
      data: stockData.map(d => d.volume),
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      yAxisID: 'y1',
      borderRadius: 4,
      order: 1,
      hidden: hidden[5],
    },
  ]

  const data = {
    labels: stockData.map(d => d.date),
    datasets,
  }

  const legendLabels = ['Price', 'MA5', 'MA20', 'MA60', 'MA120', 'Volume']
  const legendColors = [
    'rgb(75, 192, 192)',
    'rgb(255, 99, 132)',
    'rgb(54, 162, 235)',
    'rgb(255, 206, 86)',
    'rgb(153, 102, 255)',
    'rgba(255,255,255,0.2)'
  ]

  const options: ChartOptions<'line' | 'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      title: {
        display: true,
        text: `${symbol} Stock Price Chart`,
        color: 'white',
        font: {
          size: 24,
          weight: 'bold' as const,
        },
        padding: {
          top: 10,
          bottom: 30
        }
      },
      legend: {
        display: true,
        position: 'top' as const,
        align: 'end' as const,
        labels: {
          color: 'white',
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        padding: 10,
        displayColors: true,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('ko-KR', {
                style: 'currency',
                currency: 'USD'
              }).format(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
        },
      },
      y: {
        position: 'left' as const,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          callback: function(value) {
            return new Intl.NumberFormat('ko-KR', {
              style: 'currency',
              currency: 'USD'
            }).format(value as number);
          }
        },
      },
      y1: {
        position: 'right' as const,
        grid: {
          display: false,
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          callback: function(value) {
            return new Intl.NumberFormat('ko-KR', {
              notation: 'compact',
              maximumFractionDigits: 1
            }).format(value as number);
          }
        },
      },
    },
  }

  const periods = [
    { value: '1w', label: '1 week' },
    { value: '1m', label: '1 month' },
    { value: '3m', label: '3 months' },
    { value: '6m', label: '6 months' },
    { value: '1y', label: '1 year' },
    { value: '5y', label: '5 years' },
    { value: 'all', label: 'All' },
  ]

  if (isLoading) {
    return (
      <div className="h-[700px] w-full flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-[700px] w-full flex items-center justify-center">
        <div className="text-red-500">Error: {error}</div>
      </div>
    )
  }

  if (!stockData || stockData.length === 0) {
    return (
      <div className="h-[700px] w-full flex items-center justify-center">
        <div className="text-gray-400">No data available</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end space-x-2">
        <button
          className={`px-4 py-2 rounded-lg text-sm ${
            selectedPeriod === '1d' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'
          }`}
          onClick={() => setSelectedPeriod('1d')}
        >
          1 day
        </button>
        <button
          className={`px-4 py-2 rounded-lg text-sm ${
            selectedPeriod === '1w' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'
          }`}
          onClick={() => setSelectedPeriod('1w')}
        >
          1 week
        </button>
        <button
          className={`px-4 py-2 rounded-lg text-sm ${
            selectedPeriod === '1m' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'
          }`}
          onClick={() => setSelectedPeriod('1m')}
        >
          1 month
        </button>
        <button
          className={`px-4 py-2 rounded-lg text-sm ${
            selectedPeriod === '3m' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'
          }`}
          onClick={() => setSelectedPeriod('3m')}
        >
          3 months
        </button>
        <button
          className={`px-4 py-2 rounded-lg text-sm ${
            selectedPeriod === '6m' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'
          }`}
          onClick={() => setSelectedPeriod('6m')}
        >
          6 months
        </button>
        <button
          className={`px-4 py-2 rounded-lg text-sm ${
            selectedPeriod === '1y' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'
          }`}
          onClick={() => setSelectedPeriod('1y')}
        >
          1 year
        </button>
        <button
          className={`px-4 py-2 rounded-lg text-sm ${
            selectedPeriod === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'
          }`}
          onClick={() => setSelectedPeriod('all')}
        >
          All
        </button>
      </div>
      <div className="h-[560px]">
        <Chart type="line" options={options} data={data} />
      </div>
      
      {/* 매매 추천 표시 */}
      {recommendation && (
        <div className="p-4 bg-gray-800/50 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm text-gray-400 mb-1">Recommendation</div>
              <div className={`text-2xl font-bold ${recommendation.color}`}>
                {recommendation.recommendation}
              </div>
              <div className="text-sm text-gray-300 mt-1">
                {recommendation.description}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400 mb-1">Total Score</div>
              <div className={`text-2xl font-bold ${recommendation.color}`}>
                {recommendation.score}/10
              </div>
            </div>
          </div>
          
          {/* 상세 분석 내용 */}
          <div className="mt-4 pt-4 border-t border-gray-700">
            <div className="text-sm text-gray-400 mb-2">Analysis</div>
            <div className="space-y-2">
              <div className="text-sm">
                <span className="text-gray-400">MA Analysis:</span>
                <ul className="list-disc list-inside ml-4 mt-1 text-gray-300">
                  {recommendation.analysis.ma.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="text-sm">
                <span className="text-gray-400">Momentum Analysis:</span>
                <div className="ml-4 mt-1 text-gray-300">
                  {recommendation.analysis.momentum}
                </div>
              </div>
              <div className="text-sm">
                <span className="text-gray-400">Trend Analysis:</span>
                <div className="ml-4 mt-1 text-gray-300">
                  {recommendation.analysis.trend}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 