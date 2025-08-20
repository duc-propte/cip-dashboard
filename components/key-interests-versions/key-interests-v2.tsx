"use client"

import { DollarSign, MapPin, Maximize, Phone, Mail, Clock, ArrowRight } from "lucide-react"
import { KeyInterestsData } from "@/types"

interface KeyInterestsProps {
  data?: KeyInterestsData
}

export default function KeyInterestsV2({ data }: KeyInterestsProps) {
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

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 48) return "Yesterday"
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    })
  }

  // Create timeline events from the data
  const timelineEvents = [
    {
      time: mockData.priceRangeFocus.lastActivity,
      icon: <DollarSign className="w-4 h-4" />,
      title: "Price Range Activity",
      description: `Focused on ${mockData.priceRangeFocus.range} range`,
      details: `${mockData.priceRangeFocus.views} views • ${mockData.priceRangeFocus.brochures} downloads`,
      type: "price"
    },
    {
      time: mockData.directIntent.lastPhoneClick || "",
      icon: <Phone className="w-4 h-4" />,
      title: "Phone Contact Attempt",
      description: "Clicked phone number",
      details: `${mockData.directIntent.phoneClicks} total phone clicks`,
      type: "contact"
    },
    {
      time: mockData.directIntent.lastEmailClick || "",
      icon: <Mail className="w-4 h-4" />,
      title: "Email Contact",
      description: "Clicked email contact",
      details: `${mockData.directIntent.emailClicks} total email clicks`,
      type: "contact"
    },
    {
      time: mockData.mostViewedLots[0].lastViewed,
      icon: <MapPin className="w-4 h-4" />,
      title: "Lot Viewing",
      description: `Viewed lot ${mockData.mostViewedLots[0].lotNumber}`,
      details: `${mockData.mostViewedLots[0].clicks} clicks total`,
      type: "viewing"
    }
  ]
    .filter(event => event.time)
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 4)

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'price': return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30'
      case 'contact': return 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30'
      case 'viewing': return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30'
      default: return 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700'
    }
  }

  return (
    <div className="p-4 border-b border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          Interest Timeline
        </h3>
        <Clock className="w-4 h-4 text-slate-500 dark:text-slate-400" />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-2">
          <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Price Focus</div>
          <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {mockData.priceRangeFocus.range}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {mockData.priceRangeFocus.views} views
          </div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-2">
          <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Top Lot</div>
          <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {mockData.mostViewedLots[0].lotNumber}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {mockData.mostViewedLots[0].clicks} clicks
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-3">
        <div className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
          Recent Activity
        </div>
        
        {timelineEvents.map((event, index) => (
          <div key={index} className="relative">
            {/* Timeline line */}
            {index < timelineEvents.length - 1 && (
              <div className="absolute left-5 top-10 w-px h-8 bg-slate-200 dark:bg-slate-700" />
            )}
            
            <div className="flex items-start space-x-3">
              {/* Icon */}
              <div className={`p-2 rounded-full flex-shrink-0 ${getTypeColor(event.type)}`}>
                {event.icon}
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    {event.title}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {formatDateTime(event.time)}
                  </div>
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  {event.description}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {event.details}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Interest Patterns */}
      <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
        <div className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
          Patterns
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <Maximize className="w-3 h-3 text-purple-500" />
              <span className="text-slate-700 dark:text-slate-300">Size preference</span>
            </div>
            <div className="flex items-center space-x-1 text-slate-600 dark:text-slate-400">
              <span>{mockData.lotSizeInterest.range}</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>
          
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <Phone className="w-3 h-3 text-orange-500" />
              <span className="text-slate-700 dark:text-slate-300">Contact intent</span>
            </div>
            <div className="flex items-center space-x-1 text-slate-600 dark:text-slate-400">
              <span>
                {mockData.directIntent.phoneClicks + mockData.directIntent.emailClicks} attempts
              </span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
