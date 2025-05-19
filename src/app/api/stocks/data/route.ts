import { NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');
  const period1 = searchParams.get('period1');
  const period2 = searchParams.get('period2');

  if (!symbol) {
    return NextResponse.json({ error: 'Symbol parameter is required' }, { status: 400 });
  }

  try {
    // Get historical data
    const quote = await yahooFinance.historical(symbol, {
      period1: period1 || '2023-01-01',
      period2: period2 || new Date(),
      interval: '1d'
    });

    // Get company info
    const info = await yahooFinance.quote(symbol);

    const data = {
      symbol: symbol,
      name: info.longName || symbol,
      prices: quote.map(item => ({
        date: formatDate(item.date),
        price: item.close,
        volume: item.volume
      }))
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error fetching data for ${symbol}:`, error);
    return NextResponse.json({ error: 'Failed to fetch stock data' }, { status: 500 });
  }
} 