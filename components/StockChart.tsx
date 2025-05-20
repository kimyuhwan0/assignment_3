'use client'

import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LineController,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(
  LineElement,
  PointElement,
  LineController,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
)

const dummyData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  datasets: [
    {
      label: 'Dummy Stock Price',
      data: [150, 155, 160, 158, 165],
      borderColor: 'rgba(75,192,192,1)',
      tension: 0.4,
    },
  ],
}

const options = {
  responsive: true,
  plugins: {
    legend: {
      display: true,
    },
  },
}

export default function StockChart({ symbol }: { symbol: string }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">{symbol} Chart</h2>
      <Line data={dummyData} options={options} />
    </div>
  )
} 