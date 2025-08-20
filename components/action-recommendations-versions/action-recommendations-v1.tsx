"use client"

import { useState } from "react"
import { Phone, Mail, Calendar, FileText, AlertTriangle, TrendingUp, Target, Users, Clock, CheckCircle, Filter, ChevronDown, ArrowUpRight } from "lucide-react"
import { ActionRecommendationsData, ActionRecommendation } from "@/types"

interface ActionRecommendationsV1Props {
  data?: ActionRecommendationsData
}

export default function ActionRecommendationsV1({ data }: ActionRecommendationsV1Props) {
  const [selectedPriority, setSelectedPriority] = useState<'all' | 'high' | 'medium' | 'low'>('all')
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'follow-up' | 'engagement' | 'opportunity' | 'risk'>('all')
  const [completedActions, setCompletedActions] = useState<Set<string>>(new Set())
  const [expandedAction, setExpandedAction] = useState<string | null>(null)

  // Mock data
  const mockData: ActionRecommendationsData = data || {
    lastUpdated: "2024-12-22T10:30:00Z",
    totalRecommendations: 8,
    recommendations: [
      {
        id: "1",
        title: "Urgent: Follow-up on Premium Lot Inquiry",
        description: "User has shown high intent with multiple phone clicks and premium lot views. Immediate action required.",
        priority: "high",
        category: "follow-up",
        actionType: "call",
        estimatedImpact: 92,
        timeframe: "Within 1 hour",
        basedOn: ["3 phone clicks", "Premium lot A-12 viewed 5 times", "Price range 400k+", "High engagement score (89)"],
        suggestedActions: [
          "Call immediately - customer is actively comparing options",
          "Prepare detailed information about lot A-12 and similar properties",
          "Have financing options ready for 400k+ range",
          "Mention limited availability to create urgency"
        ],
        icon: "phone"
      },
      {
        id: "2",
        title: "Send Personalized Property Portfolio",
        description: "Customer preferences identified: 250-300m² lots, family-oriented amenities, proximity to schools.",
        priority: "high",
        category: "engagement",
        actionType: "email",
        estimatedImpact: 78,
        timeframe: "Today",
        basedOn: ["Lot size filter: 250-300m²", "Amenities viewed: playgrounds, schools", "Family composition indicators"],
        suggestedActions: [
          "Create curated selection of family-friendly lots",
          "Include school district information and ratings",
          "Highlight community amenities and safety features",
          "Add testimonials from families in the community"
        ],
        icon: "mail"
      },
      {
        id: "3",
        title: "Schedule Weekend Site Visit",
        description: "Customer behavior suggests readiness for in-person visit. Weekend availability detected.",
        priority: "medium",
        category: "opportunity",
        actionType: "meeting",
        estimatedImpact: 85,
        timeframe: "This week",
        basedOn: ["Weekend browsing pattern", "Virtual tour completed", "Brochure downloaded"],
        suggestedActions: [
          "Propose Saturday or Sunday site visit",
          "Prepare welcome package and site maps",
          "Schedule with senior sales consultant",
          "Arrange transportation if needed"
        ],
        icon: "calendar"
      },
      {
        id: "4",
        title: "Address Pricing Concerns",
        description: "Multiple price comparison activities detected. Customer may have budget concerns.",
        priority: "medium",
        category: "risk",
        actionType: "call",
        estimatedImpact: 65,
        timeframe: "Today",
        basedOn: ["Price filter adjustments", "Competitor website visits", "Lower-priced lot views"],
        suggestedActions: [
          "Call to understand budget constraints",
          "Present financing options and payment plans",
          "Highlight value proposition vs competitors",
          "Offer incentives or flexible terms if appropriate"
        ],
        icon: "alert"
      },
      {
        id: "5",
        title: "Share Market Insights Report",
        description: "Customer interested in investment potential. Provide market analysis and ROI projections.",
        priority: "low",
        category: "engagement",
        actionType: "content",
        estimatedImpact: 45,
        timeframe: "This week",
        basedOn: ["Investment property indicators", "ROI calculator usage", "Market trend page views"],
        suggestedActions: [
          "Send quarterly market report for the area",
          "Include ROI projections for preferred lot sizes",
          "Highlight recent sales and appreciation trends",
          "Invite to investor-focused webinar"
        ],
        icon: "trending-up"
      },
      {
        id: "6",
        title: "Re-engagement Campaign",
        description: "Customer activity decreased 60% in last week. Risk of losing interest without intervention.",
        priority: "medium",
        category: "risk",
        actionType: "email",
        estimatedImpact: 55,
        timeframe: "Today",
        basedOn: ["Activity drop: 60%", "No visits in 5 days", "Email open rate declining"],
        suggestedActions: [
          "Send personalized re-engagement email",
          "Offer exclusive preview of new listings",
          "Include limited-time incentive",
          "Request feedback on current preferences"
        ],
        icon: "mail"
      },
      {
        id: "7",
        title: "Follow-up on Design Consultation",
        description: "Customer expressed interest in custom home designs. Schedule architecture consultation.",
        priority: "high",
        category: "follow-up",
        actionType: "meeting",
        estimatedImpact: 88,
        timeframe: "Within 2 days",
        basedOn: ["Custom home interest", "Design gallery engagement", "Architecture page views"],
        suggestedActions: [
          "Schedule consultation with in-house architect",
          "Prepare design portfolio and lot recommendations",
          "Discuss timeline and budget for custom builds",
          "Present design-build packages"
        ],
        icon: "calendar"
      },
      {
        id: "8",
        title: "Provide Financing Pre-approval Support",
        description: "Customer researching financing options. Assist with pre-approval process.",
        priority: "low",
        category: "opportunity",
        actionType: "content",
        estimatedImpact: 42,
        timeframe: "This week",
        basedOn: ["Financing page views", "Mortgage calculator usage", "Bank comparison research"],
        suggestedActions: [
          "Send financing guide and checklist",
          "Connect with preferred lender partners",
          "Schedule pre-approval consultation",
          "Explain benefits of pre-approval"
        ],
        icon: "trending-up"
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
      case 'high': return "border-l-red-500 bg-red-50 dark:bg-red-900/10"
      case 'medium': return "border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/10"
      case 'low': return "border-l-blue-500 bg-blue-50 dark:bg-blue-900/10"
      default: return "border-l-slate-500 bg-slate-50 dark:bg-slate-800"
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

  const handleComplete = (actionId: string) => {
    setCompletedActions(prev => new Set([...prev, actionId]))
  }

  const toggleExpand = (actionId: string) => {
    setExpandedAction(expandedAction === actionId ? null : actionId)
  }

  const filteredRecommendations = mockData.recommendations.filter(rec => {
    if (completedActions.has(rec.id)) return false
    if (selectedPriority !== 'all' && rec.priority !== selectedPriority) return false
    if (selectedCategory !== 'all' && rec.category !== selectedCategory) return false
    return true
  })

  const priorityCount = (priority: 'high' | 'medium' | 'low') => 
    mockData.recommendations.filter(rec => rec.priority === priority && !completedActions.has(rec.id)).length

  const categoryCount = (category: 'follow-up' | 'engagement' | 'opportunity' | 'risk') => 
    mockData.recommendations.filter(rec => rec.category === category && !completedActions.has(rec.id)).length

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Action Items & Recommendations
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Prioritized action list based on customer behavior analysis
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {filteredRecommendations.length}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">pending actions</div>
          </div>
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        {/* Priority Filter */}
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Priority:</span>
          <div className="flex space-x-1">
            <button
              onClick={() => setSelectedPriority('all')}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                selectedPriority === 'all'
                  ? 'bg-slate-200 dark:bg-slate-600 text-slate-900 dark:text-slate-100'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              All ({mockData.recommendations.length - completedActions.size})
            </button>
            <button
              onClick={() => setSelectedPriority('high')}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                selectedPriority === 'high'
                  ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20'
              }`}
            >
              High ({priorityCount('high')})
            </button>
            <button
              onClick={() => setSelectedPriority('medium')}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                selectedPriority === 'medium'
                  ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
              }`}
            >
              Medium ({priorityCount('medium')})
            </button>
            <button
              onClick={() => setSelectedPriority('low')}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                selectedPriority === 'low'
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
              }`}
            >
              Low ({priorityCount('low')})
            </button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Category:</span>
          <div className="flex space-x-1">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-slate-200 dark:bg-slate-600 text-slate-900 dark:text-slate-100'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              All
            </button>
            {(['follow-up', 'engagement', 'opportunity', 'risk'] as const).map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 text-xs rounded-full transition-colors capitalize ${
                  selectedCategory === category
                    ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20'
                }`}
              >
                {category} ({categoryCount(category)})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Action List */}
      <div className="space-y-4">
        {filteredRecommendations.map((recommendation) => (
          <div 
            key={recommendation.id}
            className={`border-l-4 border border-slate-200 dark:border-slate-700 rounded-lg p-4 transition-all hover:shadow-md ${getPriorityColor(recommendation.priority)}`}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start space-x-3 flex-1">
                <div className="flex-shrink-0 p-2 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600">
                  {getIcon(recommendation.icon)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadgeColor(recommendation.priority)}`}>
                      {recommendation.priority.toUpperCase()}
                    </span>
                    <div className="flex items-center space-x-1 text-slate-500 dark:text-slate-400">
                      {getCategoryIcon(recommendation.category)}
                      <span className="text-xs capitalize">{recommendation.category}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-slate-500 dark:text-slate-400">
                      <Clock className="w-3 h-3" />
                      <span className="text-xs">{recommendation.timeframe}</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">
                    {recommendation.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {recommendation.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <div className="text-right">
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">
                      {recommendation.estimatedImpact}%
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">impact</div>
                </div>
                <button
                  onClick={() => toggleExpand(recommendation.id)}
                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${
                    expandedAction === recommendation.id ? 'rotate-180' : ''
                  }`} />
                </button>
              </div>
            </div>

            {/* Expanded Details */}
            {expandedAction === recommendation.id && (
              <div className="border-t border-slate-200 dark:border-slate-600 pt-4 mt-4 space-y-4">
                {/* Based On */}
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Based on:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {recommendation.basedOn.map((factor, index) => (
                      <div key={index} className="flex items-center space-x-2 p-2 bg-slate-50 dark:bg-slate-700 rounded-lg">
                        <ArrowUpRight className="w-3 h-3 text-slate-500" />
                        <span className="text-xs text-slate-600 dark:text-slate-400">{factor}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Suggested Actions */}
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Suggested actions:</h4>
                  <div className="space-y-2">
                    {recommendation.suggestedActions.map((action, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-sm text-slate-600 dark:text-slate-400">{action}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <div className="flex space-x-3">
                  <button 
                    onClick={() => handleComplete(recommendation.id)}
                    className="flex-1 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-sm font-medium py-2 px-4 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors flex items-center justify-center space-x-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Mark Complete</span>
                  </button>
                  <button className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                    Reschedule
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Completed Actions Summary */}
      {completedActions.size > 0 && (
        <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-700 dark:text-green-300">
              {completedActions.size} action{completedActions.size !== 1 ? 's' : ''} completed today
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
