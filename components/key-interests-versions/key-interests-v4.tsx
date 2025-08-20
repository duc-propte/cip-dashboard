"use client"

import { DollarSign, BarChart3, TrendingUp, Phone } from "lucide-react"
import { KeyInterestsData } from "@/types"

interface KeyInterestsProps {
  data?: KeyInterestsData
}

export default function KeyInterestsV4({ data }: KeyInterestsProps) {
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

  // Engagement distribution data
  const engagementData = [
    { label: "Lot Views", value: mockData.mostViewedLots.reduce((sum, lot) => sum + lot.clicks, 0), color: "bg-blue-500" },
    { label: "Downloads", value: mockData.mostViewedLots.reduce((sum, lot) => sum + (lot.brochureDownloads || 0), 0), color: "bg-green-500" },
    { label: "Forms", value: mockData.mostViewedLots.reduce((sum, lot) => sum + (lot.formSubmissions || 0), 0), color: "bg-purple-500" },
    { label: "Contact", value: mockData.directIntent.phoneClicks + mockData.directIntent.emailClicks, color: "bg-orange-500" }
  ]



  // Simple bar chart component
  const BarChart = ({ data, title }: { data: typeof engagementData, title: string }) => {
    const maxValue = Math.max(...data.map(item => item.value))
    
    return (
      <div className="space-y-2">
        <div className="text-xs font-medium text-slate-700 dark:text-slate-300">
          {title}
        </div>
        <div className="space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="w-12 text-xs text-slate-600 dark:text-slate-400 truncate">
                {item.label}
              </div>
              <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div 
                  className={`${item.color} h-2 rounded-full transition-all duration-500`}
                  style={{ width: `${maxValue > 0 ? (item.value / maxValue) * 100 : 0}%` }}
                />
              </div>
              <div className="w-6 text-xs text-slate-900 dark:text-slate-100 font-medium text-right">
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Simple donut chart component
  const DonutChart = ({ data, title }: { data: typeof engagementData, title: string }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0)
    let cumulativePercentage = 0
    
    return (
      <div className="space-y-3">
        <div className="text-xs font-medium text-slate-700 dark:text-slate-300">
          {title}
        </div>
        <div className="flex items-center justify-center">
          <div className="relative w-16 h-16">
            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 42 42">
              <circle
                cx="21"
                cy="21"
                r="15.91549430918954"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="2"
                className="text-slate-200 dark:text-slate-700"
              />
              {data.map((item, index) => {
                const percentage = total > 0 ? (item.value / total) * 100 : 0
                const strokeDasharray = `${percentage} ${100 - percentage}`
                const strokeDashoffset = -cumulativePercentage
                const result = (
                  <circle
                    key={index}
                    cx="21"
                    cy="21"
                    r="15.91549430918954"
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    className={item.color.replace('bg-', 'text-')}
                  />
                )
                cumulativePercentage += percentage
                return result
              })}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                {total}
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-1">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${item.color}`} />
                <span className="text-slate-700 dark:text-slate-300">{item.label}</span>
              </div>
              <span className="text-slate-900 dark:text-slate-100 font-medium">
                {total > 0 ? Math.round((item.value / total) * 100) : 0}%
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Activity heatmap for lots
  const ActivityHeatmap = () => {
    const lots = mockData.mostViewedLots
    const maxClicks = Math.max(...lots.map(lot => lot.clicks))
    
    return (
      <div className="space-y-2">
        <div className="text-xs font-medium text-slate-700 dark:text-slate-300">
          Lot Activity Heatmap
        </div>
        <div className="grid grid-cols-3 gap-1">
          {lots.map((lot, index) => {
            const intensity = maxClicks > 0 ? lot.clicks / maxClicks : 0
            const opacity = Math.max(0.1, intensity)
            
            return (
              <div
                key={index}
                className="relative bg-blue-500 rounded p-2 text-center"
                style={{ opacity }}
              >
                <div className="text-xs font-bold text-white">
                  {lot.lotNumber}
                </div>
                <div className="text-xs text-blue-100">
                  {lot.clicks} clicks
                </div>
                {lot.formSubmissions && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full" />
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 border-b border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          Interest Analytics
        </h3>
        <BarChart3 className="w-4 h-4 text-slate-500 dark:text-slate-400" />
      </div>

      {/* Key Metrics Row */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        <div className="text-center">
          <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
            {engagementData[0].value}
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400">Views</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-green-600 dark:text-green-400">
            {engagementData[1].value}
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400">Downloads</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
            {engagementData[2].value}
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400">Forms</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-orange-600 dark:text-orange-400">
            {engagementData[3].value}
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400">Contact</div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-4 mb-4">
        {/* Engagement Distribution */}
        <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
          <DonutChart data={engagementData} title="Engagement Distribution" />
        </div>

        {/* Activity Breakdown */}
        <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
          <BarChart data={engagementData} title="Activity Breakdown" />
        </div>
      </div>

      {/* Lot Activity Heatmap */}
      <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 mb-4">
        <ActivityHeatmap />
      </div>

      {/* Interest Insights */}
      <div className="space-y-3">
        <div className="text-xs font-medium text-slate-700 dark:text-slate-300">
          Key Insights
        </div>
        
        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-2">
            <DollarSign className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
              Price Range Focus
            </span>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-blue-800 dark:text-blue-200">
              Primary interest: {mockData.priceRangeFocus.range}
            </div>
            <div className="flex items-center space-x-4 text-xs text-blue-700 dark:text-blue-300">
              <span>{mockData.priceRangeFocus.views} views</span>
              <span>{mockData.priceRangeFocus.brochures} downloads</span>
            </div>
          </div>
        </div>

        <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span className="text-sm font-medium text-green-900 dark:text-green-100">
              Engagement Trend
            </span>
          </div>
          <div className="text-xs text-green-800 dark:text-green-200">
            High interest in lot {mockData.mostViewedLots[0].lotNumber} with {mockData.mostViewedLots[0].clicks} clicks
            {mockData.mostViewedLots[0].formSubmissions && " and form submission"}
          </div>
        </div>

        {(mockData.directIntent.phoneClicks > 0 || mockData.directIntent.emailClicks > 0) && (
          <div className="bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-2">
              <Phone className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              <span className="text-sm font-medium text-orange-900 dark:text-orange-100">
                Contact Intent
              </span>
            </div>
            <div className="text-xs text-orange-800 dark:text-orange-200">
              Active contact attempts: {mockData.directIntent.phoneClicks} phone, {mockData.directIntent.emailClicks} email
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
