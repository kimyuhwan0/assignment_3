'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <nav className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
            StockSage
          </Link>
          
          <div className="flex space-x-4">
            <Link
              href="/"
              className={`px-3 py-2 rounded-lg text-sm ${
                isActive('/')
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-300 hover:bg-gray-700/50'
              }`}
            >
              Home
            </Link>
            <Link
              href="/about"
              className={`px-3 py-2 rounded-lg text-sm ${
                isActive('/about')
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-300 hover:bg-gray-700/50'
              }`}
            >
              About
            </Link>
            <Link
              href="/contact"
              className={`px-3 py-2 rounded-lg text-sm ${
                isActive('/contact')
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-300 hover:bg-gray-700/50'
              }`}
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
} 