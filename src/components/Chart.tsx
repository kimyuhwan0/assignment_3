'use client';

import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ChartOptions, Scale, CoreScaleOptions } from 'chart.js';
import { StockData } from '@/lib/yahoo-finance';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ChartProps {
  data: StockData[];
  symbol: string;
  name: string;
}

export default function Chart({ data, symbol, name }: ChartProps) {
  const dates = data.map(item => item.date);
  const prices = data.map(item => item.price);
  const volumes = data.map(item => item.volume || 0);

  const priceChartData = {
    labels: dates,
    datasets: [
      {
        label: '주가',
        data: prices,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.1,
      },
      {
        label: 'MA5',
        data: data.map(item => item.ma5),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderWidth: 1,
        pointRadius: 0,
        tension: 0.1,
      },
      {
        label: 'MA20',
        data: data.map(item => item.ma20),
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderWidth: 1,
        pointRadius: 0,
        tension: 0.1,
      },
      {
        label: 'MA60',
        data: data.map(item => item.ma60),
        borderColor: 'rgb(255, 206, 86)',
        backgroundColor: 'rgba(255, 206, 86, 0.5)',
        borderWidth: 1,
        pointRadius: 0,
        tension: 0.1,
      },
      {
        label: 'MA120',
        data: data.map(item => item.ma120),
        borderColor: 'rgb(153, 102, 255)',
        backgroundColor: 'rgba(153, 102, 255, 0.5)',
        borderWidth: 1,
        pointRadius: 0,
        tension: 0.1,
      },
    ],
  };

  const volumeChartData = {
    labels: dates,
    datasets: [
      {
        label: '거래량',
        data: volumes,
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 1,
      },
    ],
  };

  const priceChartOptions: ChartOptions<'line'> = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `${name} (${symbol}) 주가 및 이동평균선`,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: '날짜',
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        title: {
          display: true,
          text: '가격',
        },
        ticks: {
          callback: function(this: Scale<CoreScaleOptions>, tickValue: number | string) {
            const value = Number(tickValue);
            return '$' + value.toLocaleString();
          }
        }
      },
    },
  };

  const volumeChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: '거래량',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: '날짜',
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        title: {
          display: true,
          text: '거래량',
        },
        ticks: {
          callback: function(this: Scale<CoreScaleOptions>, tickValue: number | string) {
            const value = Number(tickValue);
            if (typeof value === 'number') {
              if (value >= 1000000) {
                return (value / 1000000).toFixed(1) + 'M';
              } else if (value >= 1000) {
                return (value / 1000).toFixed(1) + 'K';
              }
            }
            return value.toString();
          }
        }
      },
    },
  };

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <Line data={priceChartData} options={priceChartOptions} />
      </div>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <Bar data={volumeChartData} options={volumeChartOptions} />
      </div>
    </div>
  );
} 