import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import { Bar, Pie } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

export const ShipmentStatusChart = ({ shipments }) => {
  const statusCounts = shipments.reduce((acc, shipment) => {
    const status = shipment.status || 'Unknown'
    acc[status] = (acc[status] || 0) + 1
    return acc
  }, {})

  const data = {
    labels: Object.keys(statusCounts),
    datasets: [
      {
        label: 'Shipments by Status',
        data: Object.values(statusCounts),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',  // blue
          'rgba(34, 197, 94, 0.8)',   // green
          'rgba(250, 204, 21, 0.8)',  // yellow
          'rgba(168, 85, 247, 0.8)',  // purple
          'rgba(239, 68, 68, 0.8)',   // red
          'rgba(107, 114, 128, 0.8)', // gray
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(250, 204, 21, 1)',
          'rgba(168, 85, 247, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(107, 114, 128, 1)',
        ],
        borderWidth: 2,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 15,
          font: {
            size: 12
          }
        }
      },
      title: {
        display: true,
        text: 'Shipment Status Distribution',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
    },
  }

  return (
    <div className="h-64">
      <Pie data={data} options={options} />
    </div>
  )
}

export const MonthlyShipmentsChart = ({ shipments }) => {
  // Get last 6 months
  const months = []
  const monthCounts = []
  
  for (let i = 5; i >= 0; i--) {
    const date = new Date()
    date.setMonth(date.getMonth() - i)
    const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    months.push(monthName)
    
    // Count shipments for this month (mock data for demo)
    const count = Math.floor(Math.random() * 20) + 5
    monthCounts.push(count)
  }

  const data = {
    labels: months,
    datasets: [
      {
        label: 'Monthly Shipments',
        data: monthCounts,
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        borderRadius: 8,
        barThickness: 40,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Monthly Shipment Trends',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          borderDash: [2, 2],
        },
        ticks: {
          stepSize: 5
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    },
  }

  return (
    <div className="h-64">
      <Bar data={data} options={options} />
    </div>
  )
}

export default { ShipmentStatusChart, MonthlyShipmentsChart }
