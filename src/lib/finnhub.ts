// Finnhub API client for S&P500 stocks

const FINNHUB_API_KEY = 'cn8v9qpr01qj0vq9q8tgcn8v9qpr01qj0vq9q8u0'; // Free API key
const BASE_URL = '/api/finnhub'; // Updated to use proxied endpoint

export interface Stock {
  symbol: string;
  description: string;
  displaySymbol: string;
  type: string;
}

export interface StockQuote {
  c: number; // Current price
  d: number; // Change
  dp: number; // Percent change
  h: number; // High price of the day
  l: number; // Low price of the day
  o: number; // Open price of the day
  pc: number; // Previous close price
  t: number; // Timestamp
}

export interface StockCandle {
  c: number[]; // Close prices
  h: number[]; // High prices
  l: number[]; // Low prices
  o: number[]; // Open prices
  s: string; // Status
  t: number[]; // Timestamps
  v: number[]; // Volumes
}

// Mock data for when API fails
const mockStocks: Stock[] = [
  { symbol: 'AAPL', description: 'Apple Inc.', displaySymbol: 'AAPL', type: 'Common Stock' },
  { symbol: 'MSFT', description: 'Microsoft Corporation', displaySymbol: 'MSFT', type: 'Common Stock' },
  { symbol: 'AMZN', description: 'Amazon.com Inc.', displaySymbol: 'AMZN', type: 'Common Stock' },
  { symbol: 'GOOGL', description: 'Alphabet Inc.', displaySymbol: 'GOOGL', type: 'Common Stock' },
  { symbol: 'META', description: 'Meta Platforms Inc.', displaySymbol: 'META', type: 'Common Stock' },
  { symbol: 'TSLA', description: 'Tesla Inc.', displaySymbol: 'TSLA', type: 'Common Stock' },
  { symbol: 'NVDA', description: 'NVIDIA Corporation', displaySymbol: 'NVDA', type: 'Common Stock' },
  { symbol: 'PYPL', description: 'PayPal Holdings Inc.', displaySymbol: 'PYPL', type: 'Common Stock' },
  { symbol: 'INTC', description: 'Intel Corporation', displaySymbol: 'INTC', type: 'Common Stock' },
  { symbol: 'AMD', description: 'Advanced Micro Devices Inc.', displaySymbol: 'AMD', type: 'Common Stock' }
];

const generateMockQuote = (symbol: string): StockQuote => {
  const basePrice = {
    'AAPL': 180.0,
    'MSFT': 380.0,
    'AMZN': 170.0,
    'GOOGL': 140.0,
    'META': 480.0,
    'TSLA': 180.0,
    'NVDA': 880.0,
    'PYPL': 60.0,
    'INTC': 45.0,
    'AMD': 170.0
  }[symbol] || 100.0;

  const change = (Math.random() - 0.5) * 2;
  const price = basePrice + change;
  const percentChange = (change / basePrice) * 100;

  return {
    c: price,
    d: change,
    dp: percentChange,
    h: price + Math.random() * 2,
    l: price - Math.random() * 2,
    o: price + (Math.random() - 0.5) * 2,
    pc: basePrice,
    t: Math.floor(Date.now() / 1000)
  };
};

const generateMockCandles = (symbol: string, from: number, to: number): StockCandle => {
  const basePrice = {
    'AAPL': 180.0,
    'MSFT': 380.0,
    'AMZN': 170.0,
    'GOOGL': 140.0,
    'META': 480.0,
    'TSLA': 180.0,
    'NVDA': 880.0,
    'PYPL': 60.0,
    'INTC': 45.0,
    'AMD': 170.0
  }[symbol] || 100.0;

  const days = Math.ceil((to - from) / (24 * 60 * 60));
  const timestamps = Array.from({ length: days }, (_, i) => from + i * 24 * 60 * 60);
  
  let lastPrice = basePrice;
  const prices = timestamps.map(() => {
    const change = (Math.random() - 0.5) * 2;
    lastPrice = Math.max(1, lastPrice + change);
    return lastPrice;
  });

  return {
    c: prices,
    h: prices.map(p => p * (1 + Math.random() * 0.02)),
    l: prices.map(p => p * (1 - Math.random() * 0.02)),
    o: prices.map(p => p * (1 + (Math.random() - 0.5) * 0.01)),
    s: 'ok',
    t: timestamps,
    v: timestamps.map(() => Math.floor(Math.random() * 1000000))
  };
};

export async function fetchSP500Stocks(): Promise<Stock[]> {
  try {
    const response = await fetch(`${BASE_URL}/stock/symbol?exchange=NASDAQ&token=${FINNHUB_API_KEY}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      console.log('Using mock data for stocks');
      return mockStocks;
    }
    
    const stocks = await response.json();
    if (!Array.isArray(stocks)) {
      console.log('Invalid response format, using mock data');
      return mockStocks;
    }
    
    return stocks.slice(0, 10);
  } catch (error) {
    console.error('Error fetching stocks:', error);
    console.log('Using mock data due to error');
    return mockStocks;
  }
}

export async function fetchStockQuote(symbol: string): Promise<StockQuote> {
  try {
    const response = await fetch(`${BASE_URL}/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      console.log(`Using mock data for ${symbol} quote`);
      return generateMockQuote(symbol);
    }
    
    const data = await response.json();
    if (!data || typeof data.c !== 'number') {
      console.log(`Invalid quote data for ${symbol}, using mock data`);
      return generateMockQuote(symbol);
    }
    
    return data;
  } catch (error) {
    console.error(`Error fetching quote for ${symbol}:`, error);
    console.log(`Using mock data for ${symbol} quote due to error`);
    return generateMockQuote(symbol);
  }
}

export async function fetchStockCandles(symbol: string, resolution: string, from: number, to: number): Promise<StockCandle> {
  try {
    const response = await fetch(`${BASE_URL}/stock/candle?symbol=${symbol}&resolution=${resolution}&from=${from}&to=${to}&token=${FINNHUB_API_KEY}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      console.log(`Using mock data for ${symbol} candles`);
      return generateMockCandles(symbol, from, to);
    }
    
    const data = await response.json();
    if (data.s === 'no_data' || !data || !Array.isArray(data.c) || !Array.isArray(data.t)) {
      console.log(`No valid data for ${symbol}, using mock data`);
      return generateMockCandles(symbol, from, to);
    }
    
    return data;
  } catch (error) {
    console.error(`Error fetching candles for ${symbol}:`, error);
    console.log(`Using mock data for ${symbol} candles due to error`);
    return generateMockCandles(symbol, from, to);
  }
} 