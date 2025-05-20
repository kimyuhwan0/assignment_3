'use client'

import React from 'react'

const features = [
  {
    title: 'Stock Chart Analysis',
    description: 'Understand market trends through stock charts and moving averages of various periods.',
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
        />
      </svg>
    ),
  },
  {
    title: 'Technical Indicators',
    description: 'Comprehensive technical analysis based on moving averages and volume.',
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
  },
  {
    title: 'Price Change Analysis',
    description: 'Monitor price changes in real-time for 1 week, 1 month, and 1 year periods.',
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
        />
      </svg>
    ),
  },
]

export default function KeyFeatures() {
  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
        Key Features
      </h2>
      
      <div className="grid md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-gray-800/50 p-6 rounded-lg border border-gray-700/50"
          >
            <div className="text-blue-500 mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
            <p className="text-gray-400 mb-4">{feature.description}</p>
            <ul className="space-y-2 text-gray-300">
              {index === 0 && (
                <>
                  <li>• Multiple time periods from 1 week to 5 years</li>
                  <li>• Simultaneous display of price and volume</li>
                  <li>• Moving average analysis (MA5, MA20, MA60, MA120)</li>
                </>
              )}
              {index === 1 && (
                <>
                  <li>• Trend analysis based on moving averages</li>
                  <li>• Volume change analysis</li>
                  <li>• Trading recommendations and overall score</li>
                </>
              )}
              {index === 2 && (
                <>
                  <li>• 1 week, 1 month, and 1 year price changes</li>
                  <li>• Real-time price change rate calculation</li>
                  <li>• Intuitive price movement indicators</li>
                </>
              )}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
} 