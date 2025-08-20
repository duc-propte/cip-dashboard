"use client"

import { useState } from "react"
import { Phone, Mail, Calendar, FileText, AlertTriangle, TrendingUp, Target, Users, Clock, CheckCircle, MoreHorizontal, Plus } from "lucide-react"
import { ActionRecommendationsData, ActionRecommendation } from "@/types"

interface ActionRecommendationsV2Props {
  data?: ActionRecommendationsData
}

export default function ActionRecommendationsV2({ data }: ActionRecommendationsV2Props) {
  const [completedActions, setCompletedActions] = useState<Set<string>>(new Set())
  const [draggedItem, setDraggedItem] = useState<string | null>(null)

  // Mock data
  const mockData: ActionRecommendationsData = data || {
    lastUpdated: "2024-12-22T10:30:00Z",
    totalRecommendations: 10,
    recommendations: [
      {
        id: "1",
        title: "Urgent: Follow-up on Premium Lot Inquiry",
        description: "Customer clicked phone 3 times, viewed premium lots. High purchase intent.",
        priority: "high",
        category: "follow-up",
        actionType: "call",
        estimatedImpact: 92,
        timeframe: "Within 1 hour",
        basedOn: ["3 phone clicks", "Premium lot views", "High engagement"],
        suggestedActions: ["Call immediately", "Prepare lot information", "Have financing ready"],
        icon: "phone"
      },
      {
        id: "2",
        title: "Follow-up on Design Consultation",
        description: "Customer expressed interest in custom home designs.",
        priority: "high",
        category: "follow-up",
        actionType: "meeting",
        estimatedImpact: 88,
        timeframe: "Within 2 days",
        basedOn: ["Custom home interest", "Design gallery views"],
        suggestedActions: ["Schedule architect consultation", "Prepare design portfolio"],
        icon: "calendar"
      },
      {
        id: "3",
        title: "Send Personalized Property Portfolio",
        description: "Customer preferences: 250-300m² lots, family amenities.",
        priority: "high",
        category: "engagement",
        actionType: "email",
        estimatedImpact: 78,
        timeframe: "Today",
        basedOn: ["Lot size preference", "Family indicators"],
        suggestedActions: ["Create curated selection", "Include school info"],
        icon: "mail"
      },
      {
        id: "4",
        title: "Share Market Insights Report",
        description: "Customer interested in investment potential and ROI.",
        priority: "low",
        category: "engagement",
        actionType: "content",
        estimatedImpact: 45,
        timeframe: "This week",
        basedOn: ["Investment indicators", "ROI calculator usage"],
        suggestedActions: ["Send market report", "Include ROI projections"],
        icon: "trending-up"
      },
      {
        id: "5",
        title: "Re-engagement Campaign",
        description: "Activity decreased 60%. Risk of losing interest.",
        priority: "medium",
        category: "engagement",
        actionType: "email",
        estimatedImpact: 55,
        timeframe: "Today",
        basedOn: ["Activity drop", "No recent visits"],
        suggestedActions: ["Send re-engagement email", "Offer preview"],
        icon: "mail"
      },
      {
        id: "6",
        title: "Schedule Weekend Site Visit",
        description: "Customer ready for in-person visit. Weekend availability.",
        priority: "medium",
        category: "opportunity",
        actionType: "meeting",
        estimatedImpact: 85,
        timeframe: "This week",
        basedOn: ["Weekend browsing", "Virtual tour completed"],
        suggestedActions: ["Propose weekend visit", "Prepare welcome package"],
        icon: "calendar"
      },
      {
        id: "7",
        title: "Provide Financing Pre-approval",
        description: "Customer researching financing options actively.",
        priority: "low",
        category: "opportunity",
        actionType: "content",
        estimatedImpact: 42,
        timeframe: "This week",
        basedOn: ["Financing research", "Mortgage calculator usage"],
        suggestedActions: ["Send financing guide", "Connect with lenders"],
        icon: "trending-up"
      },
      {
        id: "8",
        title: "Address Pricing Concerns",
        description: "Multiple price comparisons. Possible budget concerns.",
        priority: "medium",
        category: "risk",
        actionType: "call",
        estimatedImpact: 65,
        timeframe: "Today",
        basedOn: ["Price comparisons", "Competitor visits"],
        suggestedActions: ["Understand budget", "Present financing options"],
        icon: "alert"
      },
      {
        id: "9",
        title: "Competitor Analysis Alert",
        description: "Customer visited 3+ competitor websites recently.",
        priority: "high",
        category: "risk",
        actionType: "call",
        estimatedImpact: 70,
        timeframe: "Today",
        basedOn: ["Competitor website visits", "Price comparison"],
        suggestedActions: ["Call to address concerns", "Highlight advantages"],
        icon: "alert"
      }
    ]
  }

  const getIcon = (iconName: string) => {
    const iconProps = { className: "w-4 h-4" }
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
      case 'high': return "border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-900/20"
      case 'medium': return "border-yellow-300 bg-yellow-50 dark:border-yellow-700 dark:bg-yellow-900/20"
      case 'low': return "border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/20"
      default: return "border-slate-300 bg-slate-50 dark:border-slate-600 dark:bg-slate-800"
    }
  }

  const getPriorityDot = (priority: ActionRecommendation['priority']) => {
    switch (priority) {
      case 'high': return "bg-red-500"
      case 'medium': return "bg-yellow-500"
      case 'low': return "bg-blue-500"
      default: return "bg-slate-500"
    }
  }

  const getCategoryInfo = (category: ActionRecommendation['category']) => {
    switch (category) {
      case 'follow-up':
        return { 
          title: 'Follow-up Actions', 
          icon: <Phone className="w-5 h-5" />, 
          color: 'bg-green-100 dark:bg-green-900/30',
          textColor: 'text-green-700 dark:text-green-300'
        }
      case 'engagement':
        return { 
          title: 'Engagement', 
          icon: <Users className="w-5 h-5" />, 
          color: 'bg-blue-100 dark:bg-blue-900/30',
          textColor: 'text-blue-700 dark:text-blue-300'
        }
      case 'opportunity':
        return { 
          title: 'Opportunities', 
          icon: <Target className="w-5 h-5" />, 
          color: 'bg-purple-100 dark:bg-purple-900/30',
          textColor: 'text-purple-700 dark:text-purple-300'
        }
      case 'risk':
        return { 
          title: 'Risk Management', 
          icon: <AlertTriangle className="w-5 h-5" />, 
          color: 'bg-orange-100 dark:bg-orange-900/30',
          textColor: 'text-orange-700 dark:text-orange-300'
        }
      default:
        return { 
          title: 'Other', 
          icon: <Target className="w-5 h-5" />, 
          color: 'bg-slate-100 dark:bg-slate-800',
          textColor: 'text-slate-700 dark:text-slate-300'
        }
    }
  }

  const handleComplete = (actionId: string) => {
    setCompletedActions(prev => new Set([...prev, actionId]))
  }

  const categories = ['follow-up', 'engagement', 'opportunity', 'risk'] as const
  const activeRecommendations = mockData.recommendations.filter(rec => !completedActions.has(rec.id))
  
  const getRecommendationsByCategory = (category: ActionRecommendation['category']) => {
    return activeRecommendations.filter(rec => rec.category === category)
  }

  const handleDragStart = (e: React.DragEvent, actionId: string) => {
    setDraggedItem(actionId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    // In a real app, you would update the item's category here
    setDraggedItem(null)
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Action Pipeline
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Kanban-style workflow for managing customer actions by category
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {activeRecommendations.length}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">active actions</div>
          </div>
          <button className="flex items-center space-x-2 px-3 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-sm font-medium rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors">
            <Plus className="w-4 h-4" />
            <span>Add Action</span>
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => {
          const categoryInfo = getCategoryInfo(category)
          const categoryRecommendations = getRecommendationsByCategory(category)
          
          return (
            <div 
              key={category}
              className="bg-slate-50 dark:bg-slate-750 rounded-lg p-4"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e)}
            >
              {/* Column Header */}
              <div className={`flex items-center justify-between p-3 rounded-lg mb-4 ${categoryInfo.color}`}>
                <div className="flex items-center space-x-2">
                  <div className={categoryInfo.textColor}>
                    {categoryInfo.icon}
                  </div>
                  <div>
                    <h3 className={`font-semibold text-sm ${categoryInfo.textColor}`}>
                      {categoryInfo.title}
                    </h3>
                    <p className={`text-xs ${categoryInfo.textColor} opacity-75`}>
                      {categoryRecommendations.length} actions
                    </p>
                  </div>
                </div>
                <MoreHorizontal className={`w-4 h-4 ${categoryInfo.textColor}`} />
              </div>

              {/* Action Cards */}
              <div className="space-y-3">
                {categoryRecommendations.map((recommendation) => (
                  <div
                    key={recommendation.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, recommendation.id)}
                    className={`p-4 rounded-lg border-2 transition-all cursor-move hover:shadow-md ${
                      draggedItem === recommendation.id ? 'opacity-50' : ''
                    } ${getPriorityColor(recommendation.priority)}`}
                  >
                    {/* Card Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${getPriorityDot(recommendation.priority)}`}></div>
                        <div className="p-1.5 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600">
                          {getIcon(recommendation.icon)}
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="w-3 h-3 text-green-500" />
                        <span className="text-xs font-medium text-green-600 dark:text-green-400">
                          {recommendation.estimatedImpact}%
                        </span>
                      </div>
                    </div>

                    {/* Title & Description */}
                    <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100 mb-2 line-clamp-2">
                      {recommendation.title}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                      {recommendation.description}
                    </p>

                    {/* Timeframe */}
                    <div className="flex items-center space-x-1 mb-3">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {recommendation.timeframe}
                      </span>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {recommendation.basedOn.slice(0, 2).map((factor, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-white dark:bg-slate-700 text-xs text-slate-600 dark:text-slate-400 rounded border border-slate-200 dark:border-slate-600"
                        >
                          {factor.length > 15 ? `${factor.substring(0, 15)}...` : factor}
                        </span>
                      ))}
                      {recommendation.basedOn.length > 2 && (
                        <span className="px-2 py-1 bg-white dark:bg-slate-700 text-xs text-slate-600 dark:text-slate-400 rounded border border-slate-200 dark:border-slate-600">
                          +{recommendation.basedOn.length - 2}
                        </span>
                      )}
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => handleComplete(recommendation.id)}
                      className="w-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-medium py-2 px-3 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors flex items-center justify-center space-x-1"
                    >
                      <CheckCircle className="w-3 h-3" />
                      <span>Complete</span>
                    </button>
                  </div>
                ))}

                {/* Add New Action Card */}
                <button className="w-full p-4 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg text-slate-500 dark:text-slate-400 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors flex items-center justify-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span className="text-sm">Add {categoryInfo.title.toLowerCase()}</span>
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
        {categories.map((category) => {
          const categoryRecommendations = getRecommendationsByCategory(category)
          const highPriority = categoryRecommendations.filter(r => r.priority === 'high').length
          const avgImpact = categoryRecommendations.length > 0 
            ? Math.round(categoryRecommendations.reduce((sum, r) => sum + r.estimatedImpact, 0) / categoryRecommendations.length)
            : 0
          
          return (
            <div key={category} className="text-center p-3 bg-slate-50 dark:bg-slate-750 rounded-lg">
              <div className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {categoryRecommendations.length}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 capitalize mb-1">
                {category.replace('-', ' ')}
              </div>
              <div className="flex items-center justify-center space-x-2 text-xs">
                <span className="text-red-600 dark:text-red-400">{highPriority} high</span>
                <span className="text-slate-400">•</span>
                <span className="text-green-600 dark:text-green-400">{avgImpact}% avg</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Completed Actions */}
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
