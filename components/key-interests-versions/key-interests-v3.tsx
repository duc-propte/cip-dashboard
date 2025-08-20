"use client"

import { DollarSign, MapPin, Maximize, Phone, Download, FileText, BarChart3, Target, MousePointer } from "lucide-react"
import { KeyInterestsData } from "@/types"

interface KeyInterestsProps {
  data?: KeyInterestsData
}

export default function KeyInterestsV3({ data }: KeyInterestsProps) {
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

  // Calculate metrics
  const totalClicks = mockData.mostViewedLots.reduce((sum, lot) => sum + lot.clicks, 0)
  const totalDownloads = mockData.mostViewedLots.reduce((sum, lot) => sum + (lot.brochureDownloads || 0), 0)
  const totalForms = mockData.mostViewedLots.reduce((sum, lot) => sum + (lot.formSubmissions || 0), 0)
  const totalContactAttempts = mockData.directIntent.phoneClicks + mockData.directIntent.emailClicks
  
  const engagementScore = Math.min(100, Math.round(
    (totalClicks * 10 + totalDownloads * 25 + totalForms * 50 + totalContactAttempts * 30) / 2
  ))

  const MetricCard = ({ 
    icon, 
    title, 
    value, 
    unit, 
    trend, 
    color = "blue" 
  }: {
    icon: React.ReactNode
    title: string
    value: number | string
    unit?: string
    trend?: "up" | "down" | "stable"
    color?: "blue" | "green" | "purple" | "orange" | "red"
  }) => {
    const colorClasses = {
      blue: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400",
      green: "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800 text-green-600 dark:text-green-400",
      purple: "bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400",
      orange: "bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800 text-orange-600 dark:text-orange-400",
      red: "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400"
    }

    const trendIcon = trend === "up" ? "↗" : trend === "down" ? "↘" : "→"
    
    return (
      <div className={`rounded-lg border p-3 ${colorClasses[color]}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="p-1 rounded">
            {icon}
          </div>
          {trend && (
            <span className="text-xs font-medium">
              {trendIcon}
            </span>
          )}
        </div>
        <div className="space-y-1">
          <div className="text-lg font-bold text-slate-900 dark:text-slate-100">
            {value}{unit && <span className="text-sm font-normal ml-1">{unit}</span>}
          </div>
          <div className="text-xs font-medium text-slate-600 dark:text-slate-400">
            {title}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 border-b border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          Interest Metrics
        </h3>
        <BarChart3 className="w-4 h-4 text-slate-500 dark:text-slate-400" />
      </div>

      {/* Engagement Score */}
      <div className="mb-4 p-3 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 rounded-lg border border-slate-200 dark:border-slate-600">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
              Engagement Score
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {engagementScore}
            <span className="text-sm text-slate-500 dark:text-slate-400 ml-1">/100</span>
          </div>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${engagementScore}%` }}
          />
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <MetricCard
          icon={<MousePointer className="w-4 h-4" />}
          title="Total Clicks"
          value={totalClicks}
          trend="up"
          color="blue"
        />
        <MetricCard
          icon={<Download className="w-4 h-4" />}
          title="Downloads"
          value={totalDownloads}
          trend="stable"
          color="green"
        />
        <MetricCard
          icon={<FileText className="w-4 h-4" />}
          title="Form Submissions"
          value={totalForms}
          trend="up"
          color="purple"
        />
        <MetricCard
          icon={<Phone className="w-4 h-4" />}
          title="Contact Attempts"
          value={totalContactAttempts}
          trend="up"
          color="orange"
        />
      </div>

      {/* Interest Breakdown */}
      <div className="space-y-3">
        <div className="text-xs font-medium text-slate-700 dark:text-slate-300">
          Interest Breakdown
        </div>
        
        {/* Price Range */}
        <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-3 h-3 text-blue-500" />
            <div>
              <div className="text-xs font-medium text-slate-900 dark:text-slate-100">
                Price Focus: {mockData.priceRangeFocus.range}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400">
                {mockData.priceRangeFocus.views} views • {mockData.priceRangeFocus.brochures} downloads
              </div>
            </div>
          </div>
          <div className="text-xs font-bold text-blue-600 dark:text-blue-400">
            {Math.round((mockData.priceRangeFocus.views / totalClicks) * 100)}%
          </div>
        </div>

        {/* Size Interest */}
        <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded">
          <div className="flex items-center space-x-2">
            <Maximize className="w-3 h-3 text-purple-500" />
            <div>
              <div className="text-xs font-medium text-slate-900 dark:text-slate-100">
                Size Range: {mockData.lotSizeInterest.range}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400">
                {mockData.lotSizeInterest.lotsViewed} lots viewed
              </div>
            </div>
          </div>
          <div className="text-xs font-bold text-purple-600 dark:text-purple-400">
            {Math.round((mockData.lotSizeInterest.lotsViewed / mockData.mostViewedLots.length) * 100)}%
          </div>
        </div>

        {/* Top Lot */}
        <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded">
          <div className="flex items-center space-x-2">
            <MapPin className="w-3 h-3 text-green-500" />
            <div>
              <div className="text-xs font-medium text-slate-900 dark:text-slate-100">
                Most Viewed: Lot {mockData.mostViewedLots[0].lotNumber}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400">
                {mockData.mostViewedLots[0].clicks} clicks • ${mockData.mostViewedLots[0].price?.toLocaleString()}
              </div>
            </div>
          </div>
          <div className="text-xs font-bold text-green-600 dark:text-green-400">
            TOP
          </div>
        </div>
      </div>

      {/* Contact Intent */}
      <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <div className="text-xs font-medium text-slate-700 dark:text-slate-300">
            Contact Intent Level
          </div>
          <div className={`text-xs font-bold px-2 py-1 rounded ${
            totalContactAttempts >= 3 
              ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
              : totalContactAttempts >= 1 
              ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
              : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
          }`}>
            {totalContactAttempts >= 3 ? 'HIGH' : totalContactAttempts >= 1 ? 'MEDIUM' : 'LOW'}
          </div>
        </div>
      </div>
    </div>
  )
}
