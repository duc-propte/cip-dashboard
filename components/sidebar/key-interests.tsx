"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, DollarSign, MapPin, Maximize, Phone, Mail, Download, FileText, Clock } from "lucide-react"
import { KeyInterestsData } from "@/types"

interface KeyInterestsProps {
  data?: KeyInterestsData
}

export default function KeyInterests({ data }: KeyInterestsProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  
  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId)
    } else {
      newExpanded.add(itemId)
    }
    setExpandedItems(newExpanded)
  }

  // Mock data - in a real app, this would come from props or API
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
        { lotNumber: "B-07", clicks: 2, lastViewed: "2024-12-21T15:45:00Z", size: 265 },
        { lotNumber: "D-15", clicks: 1, lastViewed: "2024-12-20T14:20:00Z", size: 295 },
        { lotNumber: "E-08", clicks: 1, lastViewed: "2024-12-19T11:30:00Z", size: 275 }
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
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    })
  }

  const getFollowUpStatusColor = (status?: string) => {
    switch (status) {
      case 'completed': return "text-green-600 dark:text-green-400"
      case 'contacted': return "text-blue-600 dark:text-blue-400"
      default: return "text-orange-600 dark:text-orange-400"
    }
  }

  const getFollowUpStatusText = (status?: string) => {
    switch (status) {
      case 'completed': return "Follow-up completed"
      case 'contacted': return "Contact attempted"
      default: return "Follow-up pending"
    }
  }

  const InterestItem = ({ 
    id, 
    icon, 
    title, 
    subtitle, 
    children 
  }: { 
    id: string
    icon: React.ReactNode
    title: string
    subtitle: string
    children: React.ReactNode 
  }) => {
    const isExpanded = expandedItems.has(id)
    
    return (
      <div className="border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800">
        <div 
          className="p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
          onClick={() => toggleExpanded(id)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 flex-1 min-w-0">
              <div className="text-slate-600 dark:text-slate-400 flex-shrink-0">
                {icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                  {title}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {subtitle}
                </div>
              </div>
            </div>
            <div className="flex-shrink-0">
              {isExpanded ? 
                <ChevronDown className="w-4 h-4 text-slate-500" /> : 
                <ChevronRight className="w-4 h-4 text-slate-500" />
              }
            </div>
          </div>
        </div>
        
        {isExpanded && (
          <div className="px-3 pb-3 border-t border-slate-200 dark:border-slate-700">
            {children}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="p-4 border-b border-slate-200 dark:border-slate-700">
      <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-3">
        Key Interests
      </h3>

      <div className="space-y-2">
        {/* Price Range Focus */}
        <InterestItem
          id="price-range"
          icon={<DollarSign className="w-4 h-4" />}
          title={`Price range focus: ${mockData.priceRangeFocus.range}`}
          subtitle={`${mockData.priceRangeFocus.views} views, ${mockData.priceRangeFocus.brochures} brochures`}
        >
          <div className="pt-3 space-y-3">
            <div>
              <h4 className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
                Lots in this range:
              </h4>
              <div className="space-y-2">
                {mockData.priceRangeFocus.lots.map((lot, index) => (
                  <div key={index} className="flex items-center justify-between text-xs bg-slate-50 dark:bg-slate-700 p-2 rounded">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-slate-900 dark:text-slate-100">
                        {lot.lotNumber}
                      </span>
                      <span className="text-slate-600 dark:text-slate-400">
                        ${lot.price?.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-slate-600 dark:text-slate-400">
                        {lot.clicks} clicks
                      </span>
                      {lot.brochureDownloads && (
                        <div className="flex items-center space-x-1">
                          <Download className="w-3 h-3 text-blue-500" />
                          <span className="text-blue-600 dark:text-blue-400">{lot.brochureDownloads}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Last activity: {formatDateTime(mockData.priceRangeFocus.lastActivity)}
            </div>
          </div>
        </InterestItem>

        {/* Most Viewed Lots */}
        <InterestItem
          id="viewed-lots"
          icon={<MapPin className="w-4 h-4" />}
          title={`Most viewed lot: ${mockData.mostViewedLots[0].lotNumber}`}
          subtitle={`${mockData.mostViewedLots[0].clicks} clicks`}
        >
          <div className="pt-3 space-y-2">
            <h4 className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
              All viewed lots:
            </h4>
            {mockData.mostViewedLots.map((lot, index) => (
              <div key={index} className="flex items-center justify-between text-xs bg-slate-50 dark:bg-slate-700 p-2 rounded">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-slate-900 dark:text-slate-100">
                    {lot.lotNumber}
                  </span>
                  <span className="text-slate-600 dark:text-slate-400">
                    {lot.size}m²
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-slate-600 dark:text-slate-400">
                    {lot.clicks} clicks
                  </span>
                  {lot.brochureDownloads && (
                    <div className="flex items-center space-x-1">
                      <Download className="w-3 h-3 text-blue-500" />
                      <span className="text-blue-600 dark:text-blue-400">{lot.brochureDownloads}</span>
                    </div>
                  )}
                  {lot.formSubmissions && (
                    <div className="flex items-center space-x-1">
                      <FileText className="w-3 h-3 text-green-500" />
                      <span className="text-green-600 dark:text-green-400">{lot.formSubmissions}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </InterestItem>

        {/* Lot Size Interest */}
        <InterestItem
          id="lot-size"
          icon={<Maximize className="w-4 h-4" />}
          title={`Lot size interest: ${mockData.lotSizeInterest.range}`}
          subtitle={`${mockData.lotSizeInterest.lotsViewed} lots viewed`}
        >
          <div className="pt-3 space-y-2">
            <h4 className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
              Size distribution:
            </h4>
            {mockData.lotSizeInterest.lots.map((lot, index) => (
              <div key={index} className="flex items-center justify-between text-xs bg-slate-50 dark:bg-slate-700 p-2 rounded">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-slate-900 dark:text-slate-100">
                    {lot.lotNumber}
                  </span>
                  <span className="text-slate-600 dark:text-slate-400">
                    {lot.size}m²
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-slate-600 dark:text-slate-400">
                    {lot.clicks} clicks
                  </span>
                  <span className="text-slate-500 dark:text-slate-400">
                    {formatDateTime(lot.lastViewed)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </InterestItem>

        {/* Direct Intent */}
        <InterestItem
          id="direct-intent"
          icon={<Phone className="w-4 h-4" />}
          title={`Direct intent: ${mockData.directIntent.phoneClicks} phone, ${mockData.directIntent.emailClicks} email`}
          subtitle={getFollowUpStatusText(mockData.directIntent.followUpStatus)}
        >
          <div className="pt-3 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              {mockData.directIntent.phoneClicks > 0 && (
                <div className="bg-slate-50 dark:bg-slate-700 p-2 rounded">
                  <div className="flex items-center space-x-2 mb-1">
                    <Phone className="w-3 h-3 text-blue-500" />
                    <span className="text-xs font-medium text-slate-900 dark:text-slate-100">
                      Phone Clicks
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    {mockData.directIntent.phoneClicks} clicks
                  </div>
                  {mockData.directIntent.lastPhoneClick && (
                    <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center space-x-1 mt-1">
                      <Clock className="w-3 h-3" />
                      <span>Last: {formatDateTime(mockData.directIntent.lastPhoneClick)}</span>
                    </div>
                  )}
                </div>
              )}
              
              {mockData.directIntent.emailClicks > 0 && (
                <div className="bg-slate-50 dark:bg-slate-700 p-2 rounded">
                  <div className="flex items-center space-x-2 mb-1">
                    <Mail className="w-3 h-3 text-green-500" />
                    <span className="text-xs font-medium text-slate-900 dark:text-slate-100">
                      Email Clicks
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    {mockData.directIntent.emailClicks} clicks
                  </div>
                  {mockData.directIntent.lastEmailClick && (
                    <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center space-x-1 mt-1">
                      <Clock className="w-3 h-3" />
                      <span>Last: {formatDateTime(mockData.directIntent.lastEmailClick)}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className={`text-xs font-medium ${getFollowUpStatusColor(mockData.directIntent.followUpStatus)}`}>
              Status: {getFollowUpStatusText(mockData.directIntent.followUpStatus)}
            </div>
          </div>
        </InterestItem>
      </div>
    </div>
  )
}
