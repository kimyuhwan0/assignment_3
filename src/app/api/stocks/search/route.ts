import { NextResponse } from 'next/server';

interface YahooFinanceQuote {
  symbol: string;
  shortname?: string;
  longname?: string;
  isYahooFinance?: boolean;
  typeDisp?: string;
  exchange?: string;
}

interface YahooFinanceSearchResult {
  quotes: YahooFinanceQuote[];
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    console.log('Searching for:', query);

    const response = await fetch(
      `https://query2.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(query)}&quotesCount=20&newsCount=0&enableFuzzyQuery=true`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0',
          'Accept': 'application/json',
          'Referer': 'https://finance.yahoo.com'
        }
      }
    );

    console.log('Yahoo Finance API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Yahoo Finance API error response:', errorText);
      return NextResponse.json(
        { error: 'Failed to fetch from Yahoo Finance', details: errorText },
        { status: response.status }
      );
    }

    const data: YahooFinanceSearchResult = await response.json();
    console.log('Yahoo Finance API response:', JSON.stringify(data, null, 2));

    if (!data.quotes || !Array.isArray(data.quotes)) {
      console.error('Invalid response format:', data);
      return NextResponse.json(
        { error: 'Invalid response format from Yahoo Finance' },
        { status: 500 }
      );
    }

    const stocks = data.quotes
      .filter(quote => quote.symbol && quote.symbol.length > 0)
      .map(quote => ({
        symbol: quote.symbol,
        name: quote.longname || quote.shortname || quote.symbol,
        exchange: quote.exchange || 'Unknown'
      }));

    console.log('Processed stocks:', stocks);

    return NextResponse.json({ stocks });
  } catch (error) {
    console.error('Error in stock search:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 