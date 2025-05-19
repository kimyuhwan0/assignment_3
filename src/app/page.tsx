"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Selector } from '@/components/Selector';
import { PeriodSelector } from '@/components/PeriodSelector';
import Chart from '@/components/Chart';
import { ResultCard } from '@/components/ResultCard';
import { getStockData, searchStocks, StockInfo } from '@/lib/yahoo-finance';

export const dynamic = 'force-dynamic';

export default function Home() {
  const [selectedSymbol, setSelectedSymbol] = useState<string>('');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('all');
  const [stockData, setStockData] = useState<StockInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedSymbol) {
      setLoading(true);
      setError(null);
      getStockData(selectedSymbol, selectedPeriod)
        .then(data => {
          setStockData(data);
        })
        .catch(err => {
          setError(err.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [selectedSymbol, selectedPeriod]);

  const calculateMA = (prices: number[], period: number) => {
    if (prices.length < period) return 0;
    const sum = prices.slice(-period).reduce((a, b) => a + b, 0);
    return sum / period;
  };

  const prices = stockData?.prices.map(p => p.close) || [];
  const ma5 = calculateMA(prices, 5);
  const ma20 = calculateMA(prices, 20);
  const ma60 = calculateMA(prices, 60);
  const ma120 = calculateMA(prices, 120);
  const currentPrice = prices[prices.length - 1] || 0;

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="relative h-[400px] w-full">
        <Image
          src="/stock_market_bg.jpg"
          alt="Stock Market Background"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/60">
          <div className="container mx-auto px-4 h-full flex items-center">
            <div className="text-white">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                StockSage
              </h1>
              <p className="text-xl md:text-2xl max-w-2xl">
                Make smarter investment decisions with our advanced stock analysis tools
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Stock Selector */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                Select Stock
              </h2>
              <Selector
                onSelect={setSelectedSymbol}
              />
            </div>
          </div>

          {/* Right Column - Chart and Analysis */}
          <div className="lg:col-span-2">
            {loading ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
                  <div className="h-[400px] bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            ) : error ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <div className="text-red-500 dark:text-red-400">
                  Error: {error}
                </div>
              </div>
            ) : stockData ? (
              <>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <div className="mb-4">
                    <PeriodSelector
                      selectedPeriod={selectedPeriod}
                      onPeriodChange={setSelectedPeriod}
                    />
                  </div>
                  <Chart 
                    data={stockData.prices} 
                    symbol={selectedSymbol}
                    name={stockData.name}
                  />
                </div>
                <div className="mt-8">
                  <ResultCard data={stockData.prices} />
                </div>
              </>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <div className="text-gray-500 dark:text-gray-400 text-center">
                  Select a stock to view its analysis
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="text-blue-500 dark:text-blue-400 text-4xl mb-4">
                📈
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                Real-time Charts
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                View detailed stock price charts with multiple technical indicators
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="text-green-500 dark:text-green-400 text-4xl mb-4">
                🧠
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                Smart Analysis
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Get intelligent insights and predictions based on historical data
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="text-purple-500 dark:text-purple-400 text-4xl mb-4">
                🛡️
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                Safe Investment
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Make informed decisions with our risk assessment tools
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
