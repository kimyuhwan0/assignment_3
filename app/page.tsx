'use client'

import React, { useState, useRef } from 'react'
import Navbar from '@/components/Navbar'
import StockSearch from '@/components/StockSearch'
import StockChart from '@/components/StockChart'
import KeyFeatures from '@/components/KeyFeatures'

export default function Home() {
  const [selectedStock, setSelectedStock] = useState<string | null>(null)
  const searchRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)

  const smoothScroll = (target: HTMLElement) => {
    const start = window.scrollY
    const targetPosition = target.getBoundingClientRect().top + window.scrollY
    const distance = targetPosition - start
    const duration = 1000
    let startTime: number | null = null

    const sigmoid = (x: number) => {
      return 1 / (1 + Math.exp(-12 * (x - 0.5)))
    }

    const animation = (currentTime: number) => {
      if (startTime === null) startTime = currentTime
      const timeElapsed = currentTime - startTime
      const progress = Math.min(timeElapsed / duration, 1)
      const easedProgress = sigmoid(progress)
      
      window.scrollTo(0, start + distance * easedProgress)
      
      if (timeElapsed < duration) {
        requestAnimationFrame(animation)
      }
    }

    requestAnimationFrame(animation)
  }

  const handleStockSelect = (symbol: string) => {
    setSelectedStock(symbol)
    if (chartRef.current) {
      smoothScroll(chartRef.current)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-gray-100">
      <Navbar />
      
      <main className="space-y-32">
        {/* Hero Section */}
        <section className="relative py-32 overflow-hidden">
          {/* Background Image with Overlay */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: 'url("/stock_market_bg.jpg")' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/90 to-gray-900/70" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent" />
          
          <div className="container mx-auto px-4 relative">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
                StockSage
              </h1>
              <p className="text-xl text-gray-300 mb-12">
                Understand the stock market better through real-time stock charts and technical analysis
              </p>
              <div className="flex justify-center gap-6">
                <button 
                  className="px-8 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-teal-500 text-white font-medium hover:from-blue-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                  onClick={() => {
                    if (searchRef.current) {
                      smoothScroll(searchRef.current)
                    }
                  }}
                >
                  View Chart
                </button>
                <button 
                  className="px-8 py-3 rounded-lg bg-gray-800 text-white font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                  onClick={() => {
                    if (featuresRef.current) {
                      smoothScroll(featuresRef.current)
                    }
                  }}
                >
                  About
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section ref={searchRef} className="py-32">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto space-y-[512px]">
              <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700/50">
                <h2 className="text-2xl font-semibold mb-6">Stock Search</h2>
                <StockSearch onSelect={handleStockSelect} />
              </div>
              <div ref={chartRef} className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700/50">
                <h2 className="text-2xl font-semibold mb-6">Chart Analysis</h2>
                {selectedStock ? (
                  <StockChart symbol={selectedStock} />
                ) : (
                  <div className="h-[560px] flex items-center justify-center text-gray-400">
                    Search for a stock to view its chart.
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section ref={featuresRef} className="py-32 bg-gray-800/30">
          <div className="container mx-auto px-4">
            <KeyFeatures />
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
                Start with Real-Time Stock Charts
              </h2>
              <p className="text-xl text-gray-300 mb-12">
                Comprehensive stock analysis using moving averages, volume, and technical indicators
              </p>
              <div className="flex justify-center mt-12">
                <button
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition"
                  onClick={() => {
                    if (searchRef.current) {
                      smoothScroll(searchRef.current)
                    }
                  }}
                >
                  Start Chart Analysis
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-400">
            <p>&copy; 2024 StockSage. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
} 