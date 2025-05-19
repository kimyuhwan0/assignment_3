'use client';

import { useState, useEffect } from 'react';
import { searchStocks, StockSearchResult } from '@/lib/yahoo-finance';

interface SelectorProps {
  onSelect: (symbol: string) => void;
}

export function Selector({ onSelect }: SelectorProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<StockSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const search = async () => {
      if (!query.trim()) {
        setResults([]);
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const stocks = await searchStocks(query);
        setResults(stocks);
        if (stocks.length === 0) {
          setError('검색 결과가 없습니다.');
        }
      } catch (err) {
        console.error('Search error:', err);
        setError(err instanceof Error ? err.message : '주식 검색 중 오류가 발생했습니다.');
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(search, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="주식 심볼 또는 회사명 검색..."
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {isLoading && (
        <div className="absolute right-3 top-2.5">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
        </div>
      )}
      {error && (
        <div className="text-red-500 text-sm mt-1">{error}</div>
      )}
      {results.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto">
          {results.map((stock) => (
            <button
              key={stock.symbol}
              onClick={() => {
                onSelect(stock.symbol);
                setQuery('');
                setResults([]);
                setError(null);
              }}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
            >
              <div className="font-medium">{stock.symbol}</div>
              <div className="text-sm text-gray-600">
                {stock.name} ({stock.exchange})
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 