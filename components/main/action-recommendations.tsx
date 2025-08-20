"use client"

import { useState } from "react"
import { Phone, Mail, Calendar, FileText, AlertTriangle, TrendingUp, Target, Users, Clock, CheckCircle, X } from "lucide-react"
import { ActionRecommendationsData, ActionRecommendation } from "@/types"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

interface ActionRecommendationsProps {
  data?: ActionRecommendationsData
}

export default function ActionRecommendations({ data }: ActionRecommendationsProps) {
  const [dismissedActions, setDismissedActions] = useState<Set<string>>(new Set())

  // Mock data - in a real app, this would come from props or API
  const mockData: ActionRecommendationsData = data || {
    lastUpdated: "2024-12-22T10:30:00Z",
    totalRecommendations: 6,
    recommendations: [
      {
        id: "1",
        title: "High-Intent Follow-up Call",
        description: "User has clicked phone contact twice and viewed premium lots. Strong purchase intent detected.",
        priority: "high",
        category: "follow-up",
        actionType: "call",
        estimatedImpact: 85,
        timeframe: "Within 2 hours",
        basedOn: ["2 phone clicks", "Premium lot views", "High engagement score"],
        suggestedActions: [
          "Call within 2 hours for maximum conversion",
          "Prepare information about lots A-12 and B-07",
          "Have pricing options for 300k-400k range ready"
        ],
        icon: "phone"
      },
      {
        id: "2",
        title: "Send Targeted Property Package",
        description: "User shows strong interest in 250-300m² lots. Send curated property package.",
        priority: "high",
        category: "engagement",
        actionType: "email",
        estimatedImpact: 72,
        timeframe: "Today",
        basedOn: ["Lot size preference", "Multiple property views", "Brochure downloads"],
        suggestedActions: [
          "Send personalized email with 250-300m² lot options",
          "Include virtual tour links",
          "Highlight similar properties to previously viewed lots"
        ],
        icon: "mail"
      },
      {
        id: "3",
        title: "Schedule Site Visit",
        description: "User engagement pattern suggests readiness for site visit. High conversion probability.",
        priority: "medium",
        category: "opportunity",
        actionType: "meeting",
        estimatedImpact: 68,
        timeframe: "This week",
        basedOn: ["Multiple lot views", "Consistent engagement", "Price range alignment"],
        suggestedActions: [
          "Propose site visit for next week",
          "Focus on lots A-12, B-07, and similar properties",
          "Prepare comparative analysis of viewed properties"
        ],
        icon: "calendar"
      },
      {
        id: "4",
        title: "Engagement Drop Alert",
        description: "User activity decreased by 40% in last 3 days. Risk of losing interest.",
        priority: "medium",
        category: "risk",
        actionType: "alert",
        estimatedImpact: 45,
        timeframe: "Today",
        basedOn: ["Decreased activity", "No recent interactions", "Time since last visit"],
        suggestedActions: [
          "Send re-engagement email with new property updates",
          "Offer exclusive preview of new listings",
          "Check if user needs additional information"
        ],
        icon: "alert"
      },
      {
        id: "5",
        title: "Share Market Insights",
        description: "User interested in investment properties. Share relevant market data and trends.",
        priority: "low",
        category: "engagement",
        actionType: "content",
        estimatedImpact: 35,
        timeframe: "This week",
        basedOn: ["Property investment indicators", "Price range analysis", "Engagement patterns"],
        suggestedActions: [
          "Send market report for 300k-400k price range",
          "Include ROI projections for preferred lot sizes",
          "Highlight investment potential of viewed properties"
        ],
        icon: "trending-up"
      },
      {
        id: "6",
        title: "Follow-up on Inquiry",
        description: "User submitted form inquiry 2 days ago. Follow-up needed to maintain momentum.",
        priority: "high",
        category: "follow-up",
        actionType: "call",
        estimatedImpact: 78,
        timeframe: "Today",
        basedOn: ["Form submission", "No response to initial email", "High engagement score"],
        suggestedActions: [
          "Call to discuss submitted inquiry",
          "Address any questions about lot A-12",
          "Offer to schedule property viewing"
        ],
        icon: "phone"
      }
    ]
  }

  const getIcon = (iconName: string) => {
    const iconProps = { className: "w-5 h-5" }
    switch (iconName) {
      case "phone": return <Phone {...iconProps} />
      case "mail": return <Mail {...iconProps} />
      case "calendar": return <Calendar {...iconProps} />
      case "content": return <FileText {...iconProps} />
      case "alert": return <AlertTriangle {...iconProps} />
      case "trending-up": return <TrendingUp {...iconProps} />
      default: return <Target {...iconProps} />
    }
  }

  const getPriorityColor = (priority: ActionRecommendation['priority']) => {
    switch (priority) {
      case 'high': return "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20"
      case 'medium': return "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20"
      case 'low': return "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20"
      default: return "border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800"
    }
  }

  const getPriorityBadgeColor = (priority: ActionRecommendation['priority']) => {
    switch (priority) {
      case 'high': return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
      case 'medium': return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
      case 'low': return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
      default: return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
    }
  }

  const getCategoryIcon = (category: ActionRecommendation['category']) => {
    const iconProps = { className: "w-4 h-4" }
    switch (category) {
      case 'follow-up': return <Phone {...iconProps} />
      case 'engagement': return <Users {...iconProps} />
      case 'opportunity': return <Target {...iconProps} />
      case 'risk': return <AlertTriangle {...iconProps} />
      default: return <Target {...iconProps} />
    }
  }

  const handleDismiss = (actionId: string) => {
    setDismissedActions(prev => new Set([...prev, actionId]))
  }

  const activeRecommendations = mockData.recommendations.filter(rec => !dismissedActions.has(rec.id))

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Next Best Actions
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            AI-powered recommendations based on user behavior and engagement patterns
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-slate-500 dark:text-slate-400">
            {activeRecommendations.length} recommendations
          </span>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        </div>
      </div>

      <Carousel
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {activeRecommendations.map((recommendation) => (
            <CarouselItem key={recommendation.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
              <div 
                className={`relative rounded-lg border p-4 transition-all hover:shadow-md h-full ${getPriorityColor(recommendation.priority)}`}
              >
                {/* Dismiss Button */}
                <button
                  onClick={() => handleDismiss(recommendation.id)}
                  className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Header */}
                <div className="flex items-start space-x-3 mb-3">
                  <div className="flex-shrink-0 p-2 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600">
                    {getIcon(recommendation.icon)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadgeColor(recommendation.priority)}`}>
                        {recommendation.priority.toUpperCase()}
                      </span>
                      <div className="flex items-center space-x-1 text-slate-500 dark:text-slate-400">
                        {getCategoryIcon(recommendation.category)}
                        <span className="text-xs capitalize">{recommendation.category}</span>
                      </div>
                    </div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 line-clamp-2">
                      {recommendation.title}
                    </h3>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                  {recommendation.description}
                </p>

                {/* Metrics */}
                <div className="flex items-center justify-between mb-3 text-xs">
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="w-3 h-3 text-green-500" />
                    <span className="text-slate-600 dark:text-slate-400">Impact:</span>
                    <span className="font-medium text-green-600 dark:text-green-400">{recommendation.estimatedImpact}%</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-blue-500" />
                    <span className="text-slate-600 dark:text-slate-400">{recommendation.timeframe}</span>
                  </div>
                </div>

                {/* Based On */}
                <div className="mb-3">
                  <h4 className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Based on:</h4>
                  <div className="flex flex-wrap gap-1">
                    {recommendation.basedOn.slice(0, 2).map((factor, index) => (
                      <span key={index} className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-xs text-slate-600 dark:text-slate-400 rounded">
                        {factor}
                      </span>
                    ))}
                    {recommendation.basedOn.length > 2 && (
                      <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-xs text-slate-600 dark:text-slate-400 rounded">
                        +{recommendation.basedOn.length - 2} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                <button className="w-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-sm font-medium py-2 px-4 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors flex items-center justify-center space-x-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Take Action</span>
                </button>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>

      {dismissedActions.size > 0 && (
        <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
          <p className="text-xs text-slate-600 dark:text-slate-400">
            {dismissedActions.size} recommendation{dismissedActions.size !== 1 ? 's' : ''} dismissed
          </p>
        </div>
      )}
    </div>
  )
}
