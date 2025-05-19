"use client";

import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";
import "chart.js/auto";
import { fetchStockCandles, StockCandle, fetchStockQuote } from "@/lib/finnhub";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

interface StockChartProps {
  symbol: string;
}

interface Analysis {
  trend: string;
  support: number;
  resistance: number;
  recommendation: string;
}

export default function StockChart({ symbol }: StockChartProps) {
  const [candles, setCandles] = useState<StockCandle | null>(null);
  const [quote, setQuote] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<"1D" | "1W" | "1M" | "3M">("1M");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const now = Math.floor(Date.now() / 1000);
        let from = now;
        
        switch (timeframe) {
          case "1D":
            from = now - 24 * 60 * 60;
            break;
          case "1W":
            from = now - 7 * 24 * 60 * 60;
            break;
          case "1M":
            from = now - 30 * 24 * 60 * 60;
            break;
          case "3M":
            from = now - 90 * 24 * 60 * 60;
            break;
        }

        const [candleData, quoteData] = await Promise.all([
          fetchStockCandles(symbol, "D", from, now),
          fetchStockQuote(symbol)
        ]);

        setCandles(candleData);
        setQuote(quoteData);
        setError(null);

        // Generate analysis
        const prices = candleData.c;
        const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
        const trend = prices[prices.length - 1] > avg ? "Bullish" : "Bearish";
        const support = Math.min(...prices) * 0.95;
        const resistance = Math.max(...prices) * 1.05;
        const recommendation = trend === "Bullish" ? "Consider buying" : "Consider selling";

        setAnalysis({
          trend,
          support,
          resistance,
          recommendation
        });

      } catch (error) {
        console.error("Failed to load data:", error);
        setError("Failed to load data. Please try again later.");
      }
    };

    loadData();
  }, [symbol, timeframe]);

  if (error) return <div className="text-red-500">{error}</div>;
  if (!candles || !quote) return <div>Loading...</div>;

  const chartData = {
    labels: candles.t.map((timestamp) => {
      const date = new Date(timestamp * 1000);
      return date.toLocaleDateString();
    }),
    datasets: [
      {
        label: `${symbol} Price`,
        data: candles.c,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
        fill: true,
        backgroundColor: "rgba(75, 192, 192, 0.1)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: `${symbol} Stock Price Analysis`,
      },
    },
    scales: {
      x: {
        type: "category" as const,
        title: {
          display: true,
          text: "Date",
        },
      },
      y: {
        type: "linear" as const,
        title: {
          display: true,
          text: "Price",
        },
      },
    },
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{symbol} Analysis</span>
          <div className="flex gap-2">
            <Button
              variant={timeframe === "1D" ? "default" : "outline"}
              onClick={() => setTimeframe("1D")}
            >
              1D
            </Button>
            <Button
              variant={timeframe === "1W" ? "default" : "outline"}
              onClick={() => setTimeframe("1W")}
            >
              1W
            </Button>
            <Button
              variant={timeframe === "1M" ? "default" : "outline"}
              onClick={() => setTimeframe("1M")}
            >
              1M
            </Button>
            <Button
              variant={timeframe === "3M" ? "default" : "outline"}
              onClick={() => setTimeframe("3M")}
            >
              3M
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="chart" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="chart">Chart</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
          </TabsList>
          <TabsContent value="chart">
            <div className="w-full h-[400px] p-4">
              <Line data={chartData} options={options} />
            </div>
          </TabsContent>
          <TabsContent value="analysis">
            <div className="space-y-4 p-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Current Price</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">${quote.c.toFixed(2)}</p>
                    <p className={`text-sm ${quote.d >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {quote.d >= 0 ? '+' : ''}{quote.d.toFixed(2)} ({quote.dp.toFixed(2)}%)
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Trend Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg font-semibold">{analysis?.trend}</p>
                    <p className="text-sm text-gray-500">{analysis?.recommendation}</p>
                  </CardContent>
                </Card>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Technical Levels</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Support Level</p>
                      <p className="text-lg font-semibold">${analysis?.support.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Resistance Level</p>
                      <p className="text-lg font-semibold">${analysis?.resistance.toFixed(2)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 