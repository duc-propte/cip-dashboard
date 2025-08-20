"use client"

import { DollarSign, MapPin, Phone, Mail, BarChart3 } from "lucide-react"
import { KeyInterestsData } from "@/types"

interface KeyInterestsProps {
  data?: KeyInterestsData
}

export default function KeyInterestsV1({ data }: KeyInterestsProps) {
  // Mock data
  const mockData: KeyInterestsData = data || {
    priceRangeFocus: {
      range: "300k–400k",
      minPrice: 300000,
      maxPrice: 400000,
      views: 5,
      brochures: 2,
      lastActivity: "2024-12-22T10:30:00Z",
      lots: [
        { lotNumber: "A-12", clicks: 3, brochureDownloads: 1, lastViewed: "2024-12-22T10:30:00Z", price: 350000, size: 280 },
        { lotNumber: "B-07", clicks: 2, brochureDownloads: 1, lastViewed: "2024-12-21T15:45:00Z", price: 375000, size: 265 }
      ]
    },
    mostViewedLots: [
      { lotNumber: "A-12", clicks: 3, brochureDownloads: 1, formSubmissions: 1, lastViewed: "2024-12-22T10:30:00Z", price: 350000, size: 280 },
      { lotNumber: "B-07", clicks: 2, brochureDownloads: 1, lastViewed: "2024-12-21T15:45:00Z", price: 375000, size: 265 },
      { lotNumber: "C-03", clicks: 1, lastViewed: "2024-12-20T09:15:00Z", price: 320000, size: 245 }
    ],
    lotSizeInterest: {
      range: "250–300m²",
      minSize: 250,
      maxSize: 300,
      lotsViewed: 4,
      lots: [
        { lotNumber: "A-12", clicks: 3, lastViewed: "2024-12-22T10:30:00Z", size: 280 },
        { lotNumber: "B-07", clicks: 2, lastViewed: "2024-12-21T15:45:00Z", size: 265 }
      ]
    },
    directIntent: {
      phoneClicks: 2,
      emailClicks: 1,
      lastPhoneClick: "2024-12-22T09:45:00Z",
      lastEmailClick: "2024-12-21T16:20:00Z",
      followUpStatus: "pending"
    }
  }

  // Distribution data for hexagon chart
  const distributionData = [
    { label: "Purchases", value: mockData.priceRangeFocus.views, angle: 0 },
    { label: "Direct", value: mockData.directIntent.phoneClicks + mockData.directIntent.emailClicks, angle: 60 },
    { label: "Waste", value: 2, angle: 120 },
    { label: "Others", value: 1, angle: 180 },
    { label: "Energy", value: 3, angle: 240 },
    { label: "Transport", value: mockData.lotSizeInterest.lotsViewed, angle: 300 }
  ]

  const maxValue = Math.max(...distributionData.map(d => d.value))
  const totalValue = distributionData.reduce((sum, d) => sum + d.value, 0)

  // Create hexagon path for different scales
  const createHexagonPath = (scale: number) => {
    const points = []
    for (let i = 0; i < 6; i++) {
      const angle = (i * 60) * Math.PI / 180
      const x = 50 + (30 * scale) * Math.cos(angle)
      const y = 50 + (30 * scale) * Math.sin(angle)
      points.push(`${x},${y}`)
    }
    return `M${points.join('L')}Z`
  }

  // Interest distribution icons/timeline
  const interestTimeline = [
    { 
      icon: <DollarSign className="w-4 h-4" />, 
      color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
      value: mockData.priceRangeFocus.views,
      label: "Price Focus"
    },
    { 
      icon: <MapPin className="w-4 h-4" />, 
      color: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
      value: mockData.mostViewedLots[0].clicks,
      label: "Location"
    },
    { 
      icon: <Phone className="w-4 h-4" />, 
      color: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
      value: mockData.directIntent.phoneClicks,
      label: "Contact"
    },
    { 
      icon: <Mail className="w-4 h-4" />, 
      color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
      value: mockData.directIntent.emailClicks,
      label: "Email"
    }
  ]

  return (
    <div className="p-4 border-b border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          Interest Distribution
        </h3>
        <BarChart3 className="w-4 h-4 text-slate-500 dark:text-slate-400" />
      </div>

      {/* Distribution Hexagon Chart */}
      <div className="mb-6">
        <div className="flex flex-col items-center">
          <div className="relative">
            <svg width="120" height="120" viewBox="0 0 100 100" className="mb-2">
              {/* Grid lines */}
              <path
                d={createHexagonPath(0.3)}
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-slate-300 dark:text-slate-600"
              />
              <path
                d={createHexagonPath(0.6)}
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-slate-300 dark:text-slate-600"
              />
              <path
                d={createHexagonPath(1)}
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="text-slate-400 dark:text-slate-500"
              />
              
              {/* Data polygon */}
              <path
                d={(() => {
                  const points = distributionData.map(d => {
                    const scale = maxValue > 0 ? (d.value / maxValue) : 0
                    const angle = (d.angle - 90) * Math.PI / 180
                    const x = 50 + (30 * scale) * Math.cos(angle)
                    const y = 50 + (30 * scale) * Math.sin(angle)
                    return `${x},${y}`
                  })
                  return `M${points.join('L')}Z`
                })()}
                fill="rgba(34, 197, 94, 0.2)"
                stroke="rgb(34, 197, 94)"
                strokeWidth="2"
              />
              
              {/* Axis lines and labels */}
              {distributionData.map((item, index) => {
                const angle = (item.angle - 90) * Math.PI / 180
                const x2 = 50 + 35 * Math.cos(angle)
                const y2 = 50 + 35 * Math.sin(angle)
                const labelX = 50 + 42 * Math.cos(angle)
                const labelY = 50 + 42 * Math.sin(angle)
                
                return (
                  <g key={index}>
                    <line
                      x1="50"
                      y1="50"
                      x2={x2}
                      y2={y2}
                      stroke="currentColor"
                      strokeWidth="0.5"
                      className="text-slate-300 dark:text-slate-600"
                    />
                    <text
                      x={labelX}
                      y={labelY}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-xs font-medium fill-slate-700 dark:fill-slate-300"
                      fontSize="8"
                    >
                      {item.label}
                    </text>
                  </g>
                )
              })}
              
              {/* Center value */}
              <text
                x="50"
                y="48"
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-sm font-bold fill-slate-900 dark:fill-slate-100"
                fontSize="10"
              >
                {totalValue}
              </text>
              <text
                x="50"
                y="55"
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-xs fill-slate-600 dark:fill-slate-400"
                fontSize="6"
              >
                total
              </text>
            </svg>
          </div>
        </div>
      </div>

      {/* Interest Activity Timeline */}
      <div className="space-y-3">
        <div className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-3">
          Interest Activity
        </div>
        
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-5 top-0 bottom-0 w-px bg-slate-200 dark:bg-slate-700"></div>
          
          <div className="space-y-4">
            {interestTimeline.map((item, index) => (
              <div key={index} className="relative flex items-center space-x-3">
                {/* Icon with circle */}
                <div className={`p-2 rounded-full ${item.color} relative z-10`}>
                  {item.icon}
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      {item.label}
                    </span>
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                      {item.value}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <div className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {mockData.priceRangeFocus.range}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400">
              Price Range
            </div>
          </div>
          <div>
            <div className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {mockData.mostViewedLots[0].lotNumber}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400">
              Top Lot
            </div>
          </div>
          <div>
            <div className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {mockData.directIntent.phoneClicks + mockData.directIntent.emailClicks}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400">
              Contact Attempts
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
