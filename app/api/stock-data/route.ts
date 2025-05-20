import { NextResponse } from 'next/server'
import yahooFinance from 'yahoo-finance2'

interface StockData {
  date: string
  price: number
  volume: number
  ma5: number | null
  ma20: number | null
  ma60: number | null
  ma120: number | null
}

interface YahooFinanceQuote {
  date: Date
  close: number
  volume: number
}

function calculateMA(prices: number[], period: number): (number | null)[] {
  const ma: (number | null)[] = []
  for (let i = 0; i < prices.length; i++) {
    if (i < period - 1) {
      ma.push(null)
      continue
    }
    const sum = prices.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0)
    ma.push(sum / period)
  }
  return ma
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get('symbol')
    const period = searchParams.get('period') || '1m'

    if (!symbol) {
      return NextResponse.json(
        { error: 'Symbol is required' },
        { status: 400 }
      )
    }

    let interval: '1d' | '1wk' | '1mo' = '1d'
    let range = '1mo'

    switch (period) {
      case '1d':
        interval = '1d'
        range = '1d'
        break
      case '1w':
        interval = '1d'
        range = '5d'
        break
      case '1m':
        interval = '1d'
        range = '1mo'
        break
      case '3m':
        interval = '1d'
        range = '3mo'
        break
      case '6m':
        interval = '1d'
        range = '6mo'
        break
      case '1y':
        interval = '1d'
        range = '1y'
        break
      case '5y':
        interval = '1wk'
        range = '5y'
        break
      case 'all':
        interval = '1wk'
        range = 'max'
        break
      default:
        return NextResponse.json(
          { error: 'Invalid period' },
          { status: 400 }
        )
    }

    // Get historical data with additional days for MA calculation
    const endDate = new Date()
    const startDate = new Date()
    
    // Calculate the start date based on the period and add extra days for MA calculation
    switch (period) {
      case '1d':
        startDate.setDate(startDate.getDate() - 1 - 180) // Add 180 days for MA120
        break
      case '1w':
        startDate.setDate(startDate.getDate() - 7 - 180)
        break
      case '1m':
        startDate.setMonth(startDate.getMonth() - 1 - 6) // Add 6 months for MA120
        break
      case '3m':
        startDate.setMonth(startDate.getMonth() - 3 - 6)
        break
      case '6m':
        startDate.setMonth(startDate.getMonth() - 6 - 6)
        break
      case '1y':
        startDate.setFullYear(startDate.getFullYear() - 1 - 1) // Add 1 year for MA120
        break
      case '5y':
        startDate.setFullYear(startDate.getFullYear() - 5 - 2) // Add 2 years for MA120
        break
      case 'all':
        startDate.setFullYear(1990)
        break
    }

    // Ensure we have enough data for MA120 calculation
    const quote = await yahooFinance.historical(symbol, {
      period1: startDate,
      period2: endDate,
      interval,
    }) as YahooFinanceQuote[]

    if (!quote || quote.length === 0) {
      return NextResponse.json(
        { error: 'No data available for the specified symbol' },
        { status: 404 }
      )
    }

    // Process the data
    const prices = quote.map(q => q.close)
    const volumes = quote.map(q => q.volume)
    const dates = quote.map(q => q.date.toISOString().split('T')[0])

    // Calculate moving averages with more data points
    const ma5 = calculateMA(prices, 5)
    const ma20 = calculateMA(prices, 20)
    const ma60 = calculateMA(prices, 60)
    const ma120 = calculateMA(prices, 120)

    // Combine the data
    const stockData: StockData[] = dates.map((date: string, i: number) => ({
      date,
      price: prices[i],
      volume: volumes[i],
      ma5: ma5[i],
      ma20: ma20[i],
      ma60: ma60[i],
      ma120: ma120[i],
    }))

    // Filter data based on selected period
    const periodStartDate = new Date()
    switch (period) {
      case '1d':
        periodStartDate.setDate(periodStartDate.getDate() - 1)
        break
      case '1w':
        periodStartDate.setDate(periodStartDate.getDate() - 7)
        break
      case '1m':
        periodStartDate.setMonth(periodStartDate.getMonth() - 1)
        break
      case '3m':
        periodStartDate.setMonth(periodStartDate.getMonth() - 3)
        break
      case '6m':
        periodStartDate.setMonth(periodStartDate.getMonth() - 6)
        break
      case '1y':
        periodStartDate.setFullYear(periodStartDate.getFullYear() - 1)
        break
      case '5y':
        periodStartDate.setFullYear(periodStartDate.getFullYear() - 5)
        break
      case 'all':
        return NextResponse.json(stockData)
    }

    // Filter the data while preserving MA values
    const filteredData = stockData.filter(data => 
      new Date(data.date) >= periodStartDate && 
      new Date(data.date) <= endDate
    )

    if (filteredData.length === 0) {
      return NextResponse.json(
        { error: 'No data available for the selected period' },
        { status: 404 }
      )
    }

    return NextResponse.json(filteredData)
  } catch (error) {
    console.error('Failed to fetch stock data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stock data' },
      { status: 500 }
    )
  }
} 