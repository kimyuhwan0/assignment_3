'use client'

import React, { useState, useEffect } from 'react'
import { useDebounce } from '@/hooks/useDebounce'

interface SearchResult {
  symbol: string
  name: string
  exchange: string
}

interface StockSearchProps {
  onSelect: (symbol: string) => void
}

export default function StockSearch({ onSelect }: StockSearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const debouncedQuery = useDebounce(query, 300)

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery) {
      setResults([])
      return
    }

    setIsLoading(true)
    try {
      console.log('Searching for:', searchQuery)
      const response = await fetch(`/api/search?query=${encodeURIComponent(searchQuery)}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      console.log('Search results:', data)
      setResults(data)
    } catch (error) {
      console.error('Failed to fetch search results:', error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    handleSearch(debouncedQuery)
  }, [debouncedQuery])

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter company name or symbol..."
          className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700/50 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>

      {results.length > 0 && (
        <div className="absolute w-full mt-2 bg-gray-800/90 rounded-xl border border-gray-700/50 shadow-lg z-10">
          {results.map((result) => (
            <button
              key={result.symbol}
              className="w-full px-4 py-3 text-left hover:bg-gray-700/50 transition-colors first:rounded-t-xl last:rounded-b-xl"
              onClick={() => {
                setQuery(result.symbol)
                setResults([])
                onSelect(result.symbol)
              }}
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium text-gray-100">{result.name}</div>
                  <div className="text-sm text-gray-400">{result.symbol}</div>
                </div>
                <div className="text-sm text-gray-400">{result.exchange}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
} 