'use client'

import React from 'react'
import Navbar from '@/components/Navbar'

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-gray-100">
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
                About StockSage
              </h1>
              <div className="space-y-12">
                {/* Stock Chart Analysis */}
                <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700/50">
                  <h2 className="text-2xl font-semibold mb-4 text-blue-400">Stock Chart Analysis</h2>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Understand market trends through stock charts of various periods and 
                    make better investment decisions with moving average and volume analysis.
                  </p>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span>Multiple time periods from 1 week to 5 years</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span>Simultaneous display of price and volume</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span>Moving average analysis (MA5, MA20, MA60, MA120)</span>
                    </li>
                  </ul>
                </div>

                {/* Technical Analysis */}
                <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700/50">
                  <h2 className="text-2xl font-semibold mb-4 text-blue-400">Technical Analysis</h2>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Analyze stock trends and momentum through comprehensive technical analysis 
                    based on moving averages and volume.
                  </p>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span>Trend analysis based on moving averages</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span>Volume change analysis</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span>Trading recommendations and overall score</span>
                    </li>
                  </ul>
                </div>

                {/* Price Change Analysis */}
                <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700/50">
                  <h2 className="text-2xl font-semibold mb-4 text-blue-400">Price Change Analysis</h2>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Monitor price changes across different time periods in real-time and 
                    intuitively understand price movements.
                  </p>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span>1 week, 1 month, and 1 year price changes</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span>Real-time price change rate calculation</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span>Intuitive price movement indicators</span>
                    </li>
                  </ul>
                </div>

                {/* Technology Stack */}
                <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700/50">
                  <h2 className="text-2xl font-semibold mb-6 text-blue-400">Technology Stack</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="bg-gray-700/50 rounded-xl p-6 text-center">
                      <div className="text-blue-500 font-semibold mb-2">Next.js</div>
                      <div className="text-sm text-gray-400">Frontend Framework</div>
                    </div>
                    <div className="bg-gray-700/50 rounded-xl p-6 text-center">
                      <div className="text-blue-500 font-semibold mb-2">Chart.js</div>
                      <div className="text-sm text-gray-400">Data Visualization</div>
                    </div>
                    <div className="bg-gray-700/50 rounded-xl p-6 text-center">
                      <div className="text-blue-500 font-semibold mb-2">TypeScript</div>
                      <div className="text-sm text-gray-400">Type Safety</div>
                    </div>
                    <div className="bg-gray-700/50 rounded-xl p-6 text-center">
                      <div className="text-blue-500 font-semibold mb-2">Tailwind CSS</div>
                      <div className="text-sm text-gray-400">Styling</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-400">
            <p>&copy; 2024 StockSage. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
} 