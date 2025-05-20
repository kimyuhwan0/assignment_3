'use client'

import { useParams } from 'next/navigation'
import StockChart from '@/components/StockChart'

export default function StockPage() {
  const params = useParams()
  const symbol = params.symbol as string

  if (!symbol) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Error</h1>
          <p>Stock symbol is required</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <StockChart symbol={symbol} />
      </div>
    </div>
  )
} 