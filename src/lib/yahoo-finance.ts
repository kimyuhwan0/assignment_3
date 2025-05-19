import yahooFinance from 'yahoo-finance2';

export interface StockData {
  symbol: string;
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
  ma5?: number;
  ma10?: number;
  ma20?: number;
  ma60?: number;
  ma120?: number;
}

export interface StockInfo {
  symbol: string;
  name: string;
  prices: StockData[];
}

export interface StockSearchResult {
  symbol: string;
  name: string;
  exchange: string;
}

function calculateMovingAverage(prices: number[], period: number): number[] {
  const result: number[] = [];
  
  for (let i = 0; i < prices.length; i++) {
    // 현재 날짜까지의 모든 가격 데이터를 사용
    const availablePrices = prices.slice(0, i + 1);
    
    if (availablePrices.length < period) {
      // 충분한 데이터가 없는 경우, 현재까지의 평균을 사용
      const sum = availablePrices.reduce((a, b) => a + b, 0);
      result.push(sum / availablePrices.length);
    } else {
      // 충분한 데이터가 있는 경우, period 기간의 이동평균을 계산
      const sum = availablePrices.slice(-period).reduce((a, b) => a + b, 0);
      result.push(sum / period);
    }
  }

  return result;
}

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

function getPeriodDates(period: string): { start: Date; end: Date } {
  const end = new Date();
  const start = new Date();

  switch (period) {
    case '15d':
      start.setDate(end.getDate() - 15);
      break;
    case '1m':
      start.setMonth(end.getMonth() - 1);
      break;
    case '3m':
      start.setMonth(end.getMonth() - 3);
      break;
    case '6m':
      start.setMonth(end.getMonth() - 6);
      break;
    case '1y':
      start.setFullYear(end.getFullYear() - 1);
      break;
    case 'all':
      start.setFullYear(2023, 0, 1); // 2023년 1월 1일부터
      break;
    default:
      start.setFullYear(2023, 0, 1);
  }

  return { start, end };
}

export async function getStockData(symbol: string, period: string = 'all'): Promise<StockInfo> {
  try {
    const { start, end } = getPeriodDates(period);
    
    // 이동평균 계산을 위해 더 많은 과거 데이터를 가져옵니다
    const historicalStart = new Date(start);
    historicalStart.setDate(start.getDate() - 120); // 120일 전부터 데이터를 가져옵니다

    const response = await fetch(
      `/api/stocks/data?symbol=${encodeURIComponent(symbol)}&period1=${formatDate(historicalStart)}&period2=${formatDate(end)}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch stock data');
    }
    const data = await response.json();
    
    // Calculate moving averages using all historical data
    const prices = data.prices.map(p => p.price);
    const ma5 = calculateMovingAverage(prices, 5);
    const ma20 = calculateMovingAverage(prices, 20);
    const ma60 = calculateMovingAverage(prices, 60);
    const ma120 = calculateMovingAverage(prices, 120);

    // Filter data to show only the selected period
    const startDate = formatDate(start);
    const filteredPrices = data.prices
      .map((price, index) => ({
        ...price,
        date: formatDate(new Date(price.date)),
        ma5: ma5[index],
        ma20: ma20[index],
        ma60: ma60[index],
        ma120: ma120[index]
      }))
      .filter(price => price.date >= startDate);

    return {
      symbol: data.symbol,
      name: data.name,
      prices: filteredPrices
    };
  } catch (error) {
    console.error(`Error fetching data for ${symbol}:`, error);
    throw error;
  }
}

export async function searchStocks(query: string): Promise<StockSearchResult[]> {
  try {
    const response = await fetch(`/api/stocks/search?query=${encodeURIComponent(query)}`);
    const data = await response.json();

    if (!response.ok) {
      console.error('Search API error:', data);
      throw new Error(data.error || 'Failed to search stocks');
    }

    if (!data.stocks || !Array.isArray(data.stocks)) {
      console.error('Invalid response format:', data);
      throw new Error('Invalid response format from search API');
    }

    return data.stocks;
  } catch (error) {
    console.error('Error searching stocks:', error);
    throw error;
  }
} 