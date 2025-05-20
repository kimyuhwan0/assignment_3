'use client'

import React from 'react'

export default function KeyFeatures() {
  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-16 bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
        Key Features
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Stock Chart Analysis */}
        <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700/50">
          <h3 className="text-xl font-semibold mb-4 text-blue-400">Stock Chart Analysis</h3>
          <p className="text-gray-300 mb-6">
            Understand market trends through stock charts and moving averages of various periods.
          </p>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
              Moving average analysis (MA5, MA20, MA60, MA120)
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
              Volume analysis and price movement tracking
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
              Support and resistance level identification
            </li>
          </ul>
        </div>

        {/* Technical Indicators */}
        <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700/50">
          <h3 className="text-xl font-semibold mb-4 text-blue-400">Technical Indicators</h3>
          <p className="text-gray-300 mb-6">
            Comprehensive technical analysis based on moving averages and volume.
          </p>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
              Moving average crossover signals
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
              Volume trend analysis
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
              Price momentum indicators
            </li>
          </ul>
        </div>

        {/* Price Change Analysis */}
        <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700/50">
          <h3 className="text-xl font-semibold mb-4 text-blue-400">Price Change Analysis</h3>
          <p className="text-gray-300 mb-6">
            Monitor price changes in real-time for 1 week, 1 month, and 1 year periods.
          </p>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
              Real-time price change tracking
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
              Historical price comparison
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
              Trend analysis and forecasting
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
} 