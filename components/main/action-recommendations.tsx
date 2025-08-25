"use client"

import { useState } from "react"
import { Phone, Mail, Calendar, FileText, AlertTriangle, TrendingUp, Target, Users, Clock, CheckCircle, X, ChevronLeft, ChevronRight } from "lucide-react"
import { ActionRecommendationsData, ActionRecommendation } from "@/types"

interface PersonalizedPopupContent {
  headline: string
  subheading: string
  bulletPoints: string[]
  ctaButton: string
  secondaryCta: string
  urgencyText: string
  personalizedNote: string
}

interface PopupOption {
  id: string
  name: string
  description: string
  content: PersonalizedPopupContent
}

interface EnhancedActionRecommendation extends ActionRecommendation {
  popupOptions?: PopupOption[]
}
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
  const [modalPreview, setModalPreview] = useState<string | null>(null)
  const [currentPopupOption, setCurrentPopupOption] = useState<number>(0)

  // Mock data - in a real app, this would come from props or API
  const mockData: ActionRecommendationsData = data || {
    lastUpdated: "2024-12-22T10:30:00Z",
    totalRecommendations: 7,
    recommendations: [
      {
        id: "7",
        title: "Deploy Personalized Website Popup",
        description: "Customer shows high intent for Waurn Ponds lots. Deploy targeted popup with personalized messaging to capture immediate interest.",
        priority: "high",
        category: "engagement",
        actionType: "content",
        estimatedImpact: 72,
        timeframe: "Within 1 hour",
        basedOn: ["Multiple Lot 47 views", "High session duration", "Return visitor behavior"],
        suggestedActions: [
          "Deploy personalized popup when viewing Waurn Ponds lots",
          "Include immediate contact and booking options",
          "Display personalized lot recommendations",
          "Show limited-time Waurn Ponds incentives"
        ],
        icon: "content",
        popupOptions: [
          {
            id: "family-focused",
            name: "Family-Focused Appeal",
            description: "Emphasizes family benefits and neighborhood features",
            content: {
              headline: "🏡 Waurn Ponds Estate - Your Dream Home Awaits!",
              subheading: "Based on your browsing, these lots match your family needs perfectly",
              bulletPoints: [
                "✅ Premium corner lots from 650-750m²",
                "✅ Family-friendly precinct near playground",
                "✅ $485k-$520k range matches your searches",
                "✅ Ready to build with all services connected",
                "🎁 Book this week: Free $15,000 landscape package"
              ],
              ctaButton: "Book Site Visit This Weekend",
              secondaryCta: "Download Waurn Ponds Estate Guide",
              urgencyText: "Only 5 premium lots remaining in this release",
              personalizedNote: "Hi John! We've reserved information about lots that match your family-focused search criteria."
            }
          },
          {
            id: "investment-focused",
            name: "Investment Opportunity",
            description: "Highlights investment potential and ROI",
            content: {
              headline: "💰 Waurn Ponds Investment Opportunity",
              subheading: "High-growth area with excellent capital appreciation potential",
              bulletPoints: [
                "📈 Geelong's fastest growing suburb - 12% annual growth",
                "🏗️ Major infrastructure developments planned",
                "💎 Premium lots in high-demand location",
                "🎯 Strong rental yield potential",
                "⚡ Ready to build - immediate returns possible"
              ],
              ctaButton: "Get Investment Analysis",
              secondaryCta: "Download ROI Report",
              urgencyText: "Prime investment opportunities selling fast",
              personalizedNote: "John, based on your research into property values, this presents an excellent investment opportunity."
            }
          }
        ]
      },
      {
        id: "1",
        title: "High-Intent Waurn Ponds Follow-up Call",
        description: "User has clicked phone contact twice and viewed Waurn Ponds premium lots. Strong land purchase intent detected.",
        priority: "high",
        category: "follow-up",
        actionType: "call",
        estimatedImpact: 85,
        timeframe: "Within 2 hours",
        basedOn: ["2 phone clicks", "Waurn Ponds premium lot views", "High engagement score"],
        suggestedActions: [
          "Call within 2 hours for maximum conversion",
          "Prepare information about Waurn Ponds lots 47 and 52",
          "Have pricing options for $485k-$520k range ready"
        ],
        icon: "phone"
      },
      {
        id: "2",
        title: "Send Targeted Waurn Ponds Package",
        description: "User shows strong interest in 650-750m² lots. Send curated Waurn Ponds estate package.",
        priority: "high",
        category: "engagement",
        actionType: "email",
        estimatedImpact: 72,
        timeframe: "Today",
        basedOn: ["Lot size preference", "Multiple property views", "Brochure downloads"],
        suggestedActions: [
          "Send personalized email with 650-750m² Waurn Ponds lot options",
          "Include Waurn Ponds virtual tour links",
          "Highlight estate master plan and playground precinct proximity"
        ],
        icon: "mail"
      },
      {
        id: "3",
        title: "Schedule Waurn Ponds Site Visit",
        description: "User engagement pattern suggests readiness for Waurn Ponds site inspection. High land purchase probability.",
        priority: "medium",
        category: "opportunity",
        actionType: "meeting",
        estimatedImpact: 68,
        timeframe: "This week",
        basedOn: ["Multiple lot views", "Consistent engagement", "Price range alignment"],
        suggestedActions: [
          "Propose Waurn Ponds site visit for next week",
          "Focus on lots 47, 52, and similar corner positions",
          "Prepare comparative analysis of viewed Waurn Ponds lots"
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

  const showPopupModal = (actionId: string) => {
    setModalPreview(actionId)
    setCurrentPopupOption(0) // Reset to first option when opening modal
  }

  const closePopupModal = () => {
    setModalPreview(null)
    setCurrentPopupOption(0)
  }

  const nextPopupOption = (maxOptions: number) => {
    setCurrentPopupOption(prev => (prev + 1) % maxOptions)
  }

  const previousPopupOption = (maxOptions: number) => {
    setCurrentPopupOption(prev => (prev - 1 + maxOptions) % maxOptions)
  }

  const activeRecommendations = mockData.recommendations.filter(rec => !dismissedActions.has(rec.id))

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Next Best Actions
          </h2>
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



                {/* Action Buttons */}
                <div className="space-y-2">
                  <button className="w-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-sm font-medium py-2 px-4 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors flex items-center justify-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Take Action</span>
                  </button>
                  
                  {/* Preview Button for Popup Actions */}
                  {(recommendation as EnhancedActionRecommendation).popupOptions && (
                    <button 
                      onClick={() => showPopupModal(recommendation.id)}
                      className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 text-sm font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Preview Popup</span>
                    </button>
                  )}
                </div>
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

      {/* Popup Preview Modal */}
      {modalPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closePopupModal}
          />
          
          {/* Modal Content - Simulating Website Popup */}
          <div className="relative z-10 w-full max-w-lg mx-4">
            {(() => {
              const previewRecommendation = mockData.recommendations.find(r => r.id === modalPreview) as EnhancedActionRecommendation;
              if (!previewRecommendation?.popupOptions) return null;

              const currentOption = previewRecommendation.popupOptions[currentPopupOption];
              const totalOptions = previewRecommendation.popupOptions.length;
              
              return (
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-in zoom-in-95 duration-200">
                  {/* Close Button */}
                  <button
                    onClick={closePopupModal}
                    className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 flex items-center justify-center transition-colors"
                  >
                    <X className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  </button>

                  {/* Popup Options Header */}
                  <div className="bg-slate-50 dark:bg-slate-900 px-6 py-3 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {currentOption.name}
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          {currentOption.description}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => previousPopupOption(totalOptions)}
                          className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 flex items-center justify-center transition-colors"
                          disabled={totalOptions <= 1}
                        >
                          <ChevronLeft className="w-3 h-3" />
                        </button>
                        <span className="text-xs text-slate-600 dark:text-slate-400">
                          {currentPopupOption + 1}/{totalOptions}
                        </span>
                        <button
                          onClick={() => nextPopupOption(totalOptions)}
                          className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 flex items-center justify-center transition-colors"
                          disabled={totalOptions <= 1}
                        >
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Popup Header */}
                  <div className="p-6 pb-4">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2 pr-8">
                      {currentOption.content.headline}
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {currentOption.content.subheading}
                    </p>
                  </div>

                  {/* Features List */}
                  <div className="px-6 pb-4">
                    <div className="space-y-2">
                      {currentOption.content.bulletPoints.map((point, idx) => (
                        <div key={idx} className="flex items-start space-x-2">
                          <span className="text-green-600 text-sm mt-0.5">•</span>
                          <span className="text-sm text-slate-700 dark:text-slate-300">{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Urgency Text */}
                  <div className="px-6 pb-4">
                    <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3">
                      <p className="text-sm text-orange-700 dark:text-orange-300 font-medium text-center">
                        ⏰ {currentOption.content.urgencyText}
                      </p>
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="px-6 pb-4 space-y-3">
                    <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors">
                      {currentOption.content.ctaButton}
                    </button>
                    <button className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-medium py-2 px-4 rounded-lg transition-colors">
                      {currentOption.content.secondaryCta}
                    </button>
                  </div>

                  {/* Personalized Note */}
                  <div className="px-6 pb-6">
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                      <p className="text-sm text-blue-700 dark:text-blue-300 italic">
                        💬 {currentOption.content.personalizedNote}
                      </p>
                    </div>
                  </div>

                  {/* Website-like Footer */}
                  <div className="bg-slate-50 dark:bg-slate-900 px-6 py-3 border-t border-slate-200 dark:border-slate-700">
                    <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                      🏡 Waurn Ponds Estate • Real Estate Excellence
                    </p>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  )
}
