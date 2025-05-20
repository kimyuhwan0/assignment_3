import { NextResponse } from 'next/server'
import yahooFinance from 'yahoo-finance2'

// Mock data for demonstration
const mockStocks = [
  { symbol: 'AAPL', name: 'Apple Inc.', exchange: 'NASDAQ' },
  { symbol: 'MSFT', name: 'Microsoft Corporation', exchange: 'NASDAQ' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', exchange: 'NASDAQ' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', exchange: 'NASDAQ' },
  { symbol: 'META', name: 'Meta Platforms Inc.', exchange: 'NASDAQ' },
  { symbol: 'TSLA', name: 'Tesla Inc.', exchange: 'NASDAQ' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation', exchange: 'NASDAQ' },
  { symbol: 'JPM', name: 'JPMorgan Chase & Co.', exchange: 'NYSE' },
  { symbol: 'V', name: 'Visa Inc.', exchange: 'NYSE' },
  { symbol: 'WMT', name: 'Walmart Inc.', exchange: 'NYSE' },
]

interface YahooFinanceQuote {
  symbol: string
  shortname?: string
  longname?: string
  exchange?: string
  typeDisp: string
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query') || ''

  if (!query) {
    return NextResponse.json([])
  }

  try {
    console.log('Searching Yahoo Finance for:', query)
    const results = await yahooFinance.search(query, {
      quotesCount: 20,
      newsCount: 0,
      enableFuzzyQuery: true,
    })

    // Transform the results to match our interface
    const transformedResults = results.quotes
      .filter(quote => {
        const type = (quote as any).typeDisp
        const symbol = (quote as any).symbol
        return type === 'Equity' || type === 'ETF' || (symbol && symbol.includes('Q'))
      })
      .map(quote => ({
        symbol: (quote as any).symbol,
        name: (quote as any).shortname || (quote as any).longname || (quote as any).symbol,
        exchange: (quote as any).exchange || 'Unknown',
      }))

    console.log('Search results:', transformedResults)
    return NextResponse.json(transformedResults)
  } catch (error) {
    console.error('Failed to fetch search results:', error)
    return NextResponse.json(
      { error: 'Failed to fetch search results' },
      { status: 500 }
    )
  }
} 