"use client";

import { useState, useEffect } from "react";
import { fetchSP500Stocks, Stock } from "@/lib/finnhub";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StockChart from "./StockChart";

export default function StockList() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredStocks, setFilteredStocks] = useState<Stock[]>([]);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStocks = async () => {
      try {
        const data = await fetchSP500Stocks();
        setStocks(data);
        setFilteredStocks(data);
        setError(null);
      } catch (error) {
        console.error("Failed to load stocks:", error);
        setError("Failed to load stocks. Please try again later.");
      }
    };
    loadStocks();
  }, []);

  useEffect(() => {
    const filtered = stocks.filter(stock => 
      stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStocks(filtered);
  }, [searchTerm, stocks]);

  const handleStockClick = (stock: Stock) => {
    setSelectedStock(stock);
  };

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Top 10 NASDAQ Stocks</CardTitle>
          <Input
            placeholder="Search stocks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mt-2"
          />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <ul className="space-y-2">
                {filteredStocks.map((stock) => (
                  <li
                    key={stock.symbol}
                    className={`p-2 border rounded cursor-pointer hover:bg-gray-100 ${
                      selectedStock?.symbol === stock.symbol ? 'bg-gray-100' : ''
                    }`}
                    onClick={() => handleStockClick(stock)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <strong>{stock.symbol}</strong>
                        <p className="text-sm text-gray-500">{stock.description}</p>
                      </div>
                      <div className="text-sm text-gray-500">
                        {stock.type}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              {selectedStock ? (
                <StockChart symbol={selectedStock.symbol} />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Select a stock to view its chart and analysis
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 