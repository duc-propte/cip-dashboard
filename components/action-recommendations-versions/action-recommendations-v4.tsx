"use client"

import { useState } from "react"
import { Phone, Mail, Calendar, FileText, AlertTriangle, TrendingUp, Target, CheckCircle, X, DollarSign, Zap, Star, Phone as PhoneIcon, Mail as MailIcon, Calendar as CalendarIcon } from "lucide-react"
import { ActionRecommendationsData, ActionRecommendation } from "@/types"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

interface EnhancedActionRecommendation extends ActionRecommendation {
  dealValue?: number
  conversionLikelihood?: number
  urgencyScore?: number
  customerMood?: 'hot' | 'warm' | 'cold'
  nextBestAction?: string
  competitorThreat?: boolean
  salesInsight?: string
}

interface ActionRecommendationsV4Props {
  data?: ActionRecommendationsData
}

export default function ActionRecommendationsV4({}: ActionRecommendationsV4Props) {
  const [dismissedActions, setDismissedActions] = useState<Set<string>>(new Set())
  const [takenActions, setTakenActions] = useState<Set<string>>(new Set())

  // Enhanced mock data with sales insights
  const mockData = {
    lastUpdated: "2024-12-22T10:30:00Z",
    totalRecommendations: 6,
    recommendations: [
      {
        id: "1",
        title: "🔥 Strike While Iron's Hot",
        description: "Customer John clicked phone number 3 times and spent 12 minutes on premium lot pages. High buyer intent detected!",
        priority: "high",
        category: "follow-up",
        actionType: "call",
        estimatedImpact: 92,
        timeframe: "Next 30 minutes",
        basedOn: ["3 phone clicks", "12min on premium lots", "Price calculator used 4x", "Viewed similar sold properties"],
        suggestedActions: [
          "Call immediately while interest is peak",
          "Have lot A-12 details ready - their favorite",
          "Mention the 2 similar properties that sold this week",
          "Prepare financing options for 380-420k range"
        ],
        icon: "phone",
        dealValue: 395000,
        conversionLikelihood: 85,
        urgencyScore: 95,
        customerMood: "hot" as const,
        nextBestAction: "If no answer: Send personalized text with lot A-12 virtual tour link",
        competitorThreat: false,
        salesInsight: "Customer behavior matches our 'ready-to-buy' profile. Similar customers convert 78% when contacted within 1 hour."
      },
      {
        id: "2",
        title: "💰 High-Value Lead Warming Up",
        description: "Sarah has been comparing premium lots for 3 days. Budget signals indicate 450k+ range. Family-focused browsing pattern.",
        priority: "high",
        category: "engagement",
        actionType: "email",
        estimatedImpact: 78,
        timeframe: "Today",
        basedOn: ["Premium lot focus", "Family amenities research", "School district searches", "Financing calculator: 450k range"],
        suggestedActions: [
          "Send personalized family-focused property package",
          "Include school ratings and safety statistics",
          "Highlight community playground and family events",
          "Add testimonial from the Johnson family (similar profile)"
        ],
        icon: "mail",
        dealValue: 465000,
        conversionLikelihood: 72,
        urgencyScore: 75,
        customerMood: "warm" as const,
        nextBestAction: "Follow up with call in 2 days if email opened but no response",
        competitorThreat: true,
        salesInsight: "High-value family buyers take 2-3 weeks to decide. Early personalized engagement increases win rate by 45%."
      },
      {
        id: "3",
        title: "⚠️ Competitor Alert - Act Fast",
        description: "Mike visited 2 competitor sites after viewing our lots. Risk of losing to competitor. Last active 6 hours ago.",
        priority: "high",
        category: "risk",
        actionType: "call",
        estimatedImpact: 88,
        timeframe: "Within 2 hours",
        basedOn: ["Competitor site visits", "Price comparison behavior", "Decreased activity", "Previous high engagement"],
        suggestedActions: [
          "Call to understand concerns or questions",
          "Highlight our unique advantages vs competitors",
          "Offer exclusive incentive (free landscape package)",
          "Schedule urgent site visit for this weekend"
        ],
        icon: "alert",
        dealValue: 320000,
        conversionLikelihood: 45,
        urgencyScore: 90,
        customerMood: "cold" as const,
        nextBestAction: "If unreachable: Send competitive advantage comparison via email",
        competitorThreat: true,
        salesInsight: "Customers visiting competitors have 60% higher chance of buying elsewhere if not contacted within 4 hours."
      },
      {
        id: "4",
        title: "🎯 Perfect Timing for Site Visit",
        description: "Emma completed virtual tour and downloaded brochure. Weekend browsing pattern suggests availability for site visit.",
        priority: "medium",
        category: "opportunity",
        actionType: "meeting",
        estimatedImpact: 82,
        timeframe: "This week",
        basedOn: ["Virtual tour completed", "Brochure download", "Weekend browsing", "Lot comparison activity"],
        suggestedActions: [
          "Propose Saturday morning site visit",
          "Prepare personalized lot comparison sheet",
          "Book our best sales consultant",
          "Arrange transportation if needed"
        ],
        icon: "calendar",
        dealValue: 285000,
        conversionLikelihood: 68,
        urgencyScore: 60,
        customerMood: "warm" as const,
        nextBestAction: "If site visit declined: Offer virtual one-on-one consultation",
        competitorThreat: false,
        salesInsight: "Customers who do site visits convert at 85% rate. Best conversion time is Saturday 10-11 AM."
      },
      {
        id: "5",
        title: "📈 Investment Buyer Needs ROI Data",
        description: "David researching investment potential. Multiple ROI calculator uses. Interested in rental yield prospects.",
        priority: "medium",
        category: "engagement",
        actionType: "content",
        estimatedImpact: 65,
        timeframe: "Today",
        basedOn: ["ROI calculator usage", "Investment research", "Rental market searches", "Property value trends"],
        suggestedActions: [
          "Send comprehensive investment package",
          "Include 5-year ROI projections for preferred lots",
          "Add rental market analysis for the area",
          "Offer consultation with investment specialist"
        ],
        icon: "trending-up",
        dealValue: 340000,
        conversionLikelihood: 55,
        urgencyScore: 45,
        customerMood: "warm" as const,
        nextBestAction: "Schedule investment-focused consultation call",
        competitorThreat: false,
        salesInsight: "Investment buyers take longer but have higher average deal values. Focus on data and long-term value."
      },
      {
        id: "6",
        title: "🔄 Re-engage Promising Lead",
        description: "Lisa was highly engaged last week but activity dropped 70%. Previous high interest in starter homes 250-300k range.",
        priority: "medium",
        category: "risk",
        actionType: "email",
        estimatedImpact: 48,
        timeframe: "Today",
        basedOn: ["Previous high engagement", "70% activity drop", "Budget range identified", "No recent contact"],
        suggestedActions: [
          "Send 'New properties in your range' email",
          "Include 2-3 new starter home options",
          "Add limited-time incentive message",
          "Request feedback on current needs"
        ],
        icon: "mail",
        dealValue: 275000,
        conversionLikelihood: 35,
        urgencyScore: 55,
        customerMood: "cold" as const,
        nextBestAction: "If no response in 3 days: Try phone call with soft approach",
        competitorThreat: false,
        salesInsight: "Re-engaged leads convert at 25% rate but often become referral sources even if they don't buy."
      }
    ] as EnhancedActionRecommendation[]
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

  const getMoodColor = (mood: 'hot' | 'warm' | 'cold') => {
    switch (mood) {
      case 'hot': return "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20"
      case 'warm': return "border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20"
      case 'cold': return "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20"
      default: return "border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800"
    }
  }

  const getMoodBadge = (mood: 'hot' | 'warm' | 'cold') => {
    switch (mood) {
      case 'hot': return { text: '🔥 HOT', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' }
      case 'warm': return { text: '🌡️ WARM', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' }
      case 'cold': return { text: '❄️ COLD', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' }
      default: return { text: 'UNKNOWN', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' }
    }
  }

  const getActionButton = (actionType: string) => {
    switch (actionType) {
      case 'call':
        return { icon: <PhoneIcon className="w-4 h-4" />, text: 'Call Now', color: 'bg-green-600 hover:bg-green-700' }
      case 'email':
        return { icon: <MailIcon className="w-4 h-4" />, text: 'Send Email', color: 'bg-blue-600 hover:bg-blue-700' }
      case 'meeting':
        return { icon: <CalendarIcon className="w-4 h-4" />, text: 'Schedule', color: 'bg-purple-600 hover:bg-purple-700' }
      default:
        return { icon: <CheckCircle className="w-4 h-4" />, text: 'Take Action', color: 'bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 dark:text-slate-900' }
    }
  }

  const handleDismiss = (actionId: string) => {
    setDismissedActions(prev => new Set([...prev, actionId]))
  }

  const handleTakeAction = (actionId: string) => {
    setTakenActions(prev => new Set([...prev, actionId]))
  }

  const activeRecommendations = mockData.recommendations.filter(rec => !dismissedActions.has(rec.id) && !takenActions.has(rec.id))

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            🎯 Next Best Actions
          </h2>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {activeRecommendations.length} Active Actions
            </div>
          </div>
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
          {activeRecommendations.map((recommendation) => {
            const moodBadge = getMoodBadge(recommendation.customerMood || 'warm')
            const actionButton = getActionButton(recommendation.actionType)
            
            return (
              <CarouselItem key={recommendation.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/2">
                <div 
                  className={`relative rounded-lg border-2 p-3 transition-all hover:shadow-lg h-full ${getMoodColor(recommendation.customerMood || 'warm')}`}
                >
                  {/* Enhanced Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="flex-shrink-0 p-2 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600">
                        {getIcon(recommendation.icon)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${moodBadge.color}`}>
                            {moodBadge.text}
                          </span>
                          {recommendation.competitorThreat && (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">
                              ⚠️ COMPETITOR RISK
                            </span>
                          )}
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">
                          {recommendation.title}
                        </h3>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDismiss(recommendation.id)}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors ml-2"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Deal Intelligence */}
                  <div className="grid grid-cols-3 gap-3 mb-4 p-3 bg-white/50 dark:bg-slate-700/50 rounded-lg">
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <DollarSign className="w-3 h-3 text-green-600" />
                        <span className="text-sm font-bold text-green-600">
                          ${(recommendation.dealValue! / 1000).toFixed(0)}K
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">Deal Value</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <Target className="w-3 h-3 text-blue-600" />
                        <span className="text-sm font-bold text-blue-600">
                          {recommendation.conversionLikelihood}%
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">Win Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <Zap className="w-3 h-3 text-orange-600" />
                        <span className="text-sm font-bold text-orange-600">
                          {recommendation.urgencyScore}
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">Urgency</div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-700 dark:text-slate-300 mb-2 leading-relaxed">
                    {recommendation.description}
                  </p>

                  {/* Sales Insight */}
                  <div className="mb-3 p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <Star className="w-3 h-3 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-xs font-medium text-blue-800 dark:text-blue-200 mb-1">Sales Insight</div>
                        <p className="text-xs text-blue-700 dark:text-blue-300">{recommendation.salesInsight}</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <button 
                      onClick={() => handleTakeAction(recommendation.id)}
                      className={`w-full text-white text-xs font-medium py-2 px-3 rounded-lg transition-colors flex items-center justify-center space-x-2 ${actionButton.color}`}
                    >
                      {actionButton.icon}
                      <span>{actionButton.text}</span>
                      <span className="text-xs opacity-75">({recommendation.timeframe})</span>
                    </button>
                    

                  </div>
                </div>
              </CarouselItem>
            )
          })}
        </CarouselContent>
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>

      {/* Action Summary */}
      {(dismissedActions.size > 0 || takenActions.size > 0) && (
        <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {takenActions.size > 0 && (
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700 dark:text-green-300">
                    {takenActions.size} action{takenActions.size !== 1 ? 's' : ''} taken
                  </span>
                </div>
              )}
              {dismissedActions.size > 0 && (
                <div className="flex items-center space-x-2">
                  <X className="w-4 h-4 text-slate-500" />
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {dismissedActions.size} dismissed
                  </span>
                </div>
              )}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Pipeline value secured: <span className="font-medium text-green-600">
                ${(Array.from(takenActions).reduce((sum, id) => {
                  const action = mockData.recommendations.find(r => r.id === id)
                  return sum + (action?.dealValue || 0)
                }, 0) / 1000).toFixed(0)}K
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
