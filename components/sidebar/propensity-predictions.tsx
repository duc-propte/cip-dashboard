"use client"

import { useState } from "react"
import { TrendingUp, TrendingDown, Minus, Heart, UserX, Zap, Target, Users, ArrowRight, ChevronDown, ChevronRight, Plus, AlertTriangle } from "lucide-react"
import { PropensityData, PropensityPrediction, ReasoningFactor } from "@/types"

interface PropensityPredictionsProps {
  data?: PropensityData
}

export default function PropensityPredictions({ data }: PropensityPredictionsProps) {
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set())
  
  const toggleExpanded = (index: number) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedItems(newExpanded)
  }

  // Mock data - in a real app, this would come from props or API
  const mockData: PropensityData = data || {
    lastUpdated: "2024-12-22",
    predictions: [
      {
        metric: "Land Purchase Intent",
        description: "Purchase Waurn Ponds land",
        probability: 87.5,
        confidence: "high",
        trend: "increasing",
        icon: "heart",
        reasoning: [
          { factor: "High Lot Engagement", impact: "positive", weight: 35, description: "Consistent daily viewing of Lot 47 and similar lots" },
          { factor: "Finance Calculator Usage", impact: "positive", weight: 25, description: "Multiple pricing calculations in target range" },
          { factor: "Site Inspection Booked", impact: "positive", weight: 20, description: "Scheduled appointment shows serious intent" },
          { factor: "Location Research", impact: "positive", weight: 15, description: "Extensive research on Waurn Ponds area amenities" }
        ],
        keyInsights: [
          "Land viewing engagement increased 45% in past week",
          "Strong correlation with corner lot preferences",
          "Price range matches lot 47 perfectly"
        ]
      },
      {
        metric: "Competition Risk",
        description: "Choose competitor estate",
        probability: 12.8,
        confidence: "medium",
        trend: "decreasing",
        icon: "user-x",
        reasoning: [
          { factor: "Competitor Site Visits", impact: "negative", weight: 15, description: "Visited 2 competitor developments recently" },
          { factor: "Strong Waurn Ponds Interest", impact: "positive", weight: -10, description: "Consistent return visits to our lots" },
          { factor: "Local Preference", impact: "positive", weight: -8, description: "Lives in Geelong, prefers Waurn Ponds location" }
        ],
        keyInsights: [
          "Competition risk decreased by 18% this month",
          "User retention improving across similar profiles",
          "Early intervention strategies showing effectiveness"
        ]
      },
      {
        metric: "Feature Adoption",
        description: "Use new features",
        probability: 73.2,
        confidence: "high",
        trend: "stable",
        icon: "zap",
        reasoning: [
          { factor: "Past Adoption Rate", impact: "positive", weight: 30, description: "Quick adopter of previous features" },
          { factor: "Learning Curve", impact: "negative", weight: -10, description: "Complex features may require training" },
          { factor: "Team Influence", impact: "positive", weight: 15, description: "Team members already using features" }
        ],
        keyInsights: [
          "Historical adoption rate of 78% for new features",
          "Strong correlation with team usage patterns",
          "Training completion rate impacts adoption significantly"
        ]
      },
      {
        metric: "Goal Completion",
        description: "Achieve project goals",
        probability: 91.3,
        confidence: "high",
        trend: "increasing",
        icon: "target",
        reasoning: [
          { factor: "Progress Tracking", impact: "positive", weight: 40, description: "Consistently meeting milestones" },
          { factor: "Resource Availability", impact: "positive", weight: 25, description: "Adequate resources allocated" },
          { factor: "Team Performance", impact: "positive", weight: 20, description: "High-performing team members" },
          { factor: "Timeline Pressure", impact: "negative", weight: -5, description: "Aggressive timeline may impact quality" }
        ],
        keyInsights: [
          "Project is 15% ahead of schedule",
          "Quality metrics remain above threshold",
          "Team satisfaction scores are consistently high"
        ]
      },
      {
        metric: "Team Collaboration",
        description: "Engage with team",
        probability: 68.9,
        confidence: "medium",
        trend: "stable",
        icon: "users",
        reasoning: [
          { factor: "Communication Frequency", impact: "positive", weight: 25, description: "Regular participation in meetings" },
          { factor: "Response Time", impact: "neutral", weight: 0, description: "Average response time to team messages" },
          { factor: "Initiative Taking", impact: "positive", weight: 15, description: "Proactively suggests improvements" },
          { factor: "Workload", impact: "negative", weight: -8, description: "High individual workload limiting collaboration" }
        ],
        keyInsights: [
          "Collaboration increases during project milestones",
          "Most active during morning hours",
          "Prefers asynchronous communication methods"
        ]
      },
      {
        metric: "Next Phase",
        description: "Proceed to next phase",
        probability: 82.1,
        confidence: "high",
        trend: "increasing",
        icon: "arrow-right",
        reasoning: [
          { factor: "Current Phase Success", impact: "positive", weight: 35, description: "Excellent performance in current phase" },
          { factor: "Stakeholder Buy-in", impact: "positive", weight: 25, description: "Strong support from key stakeholders" },
          { factor: "Budget Approval", impact: "positive", weight: 20, description: "Next phase budget approved" },
          { factor: "Resource Constraints", impact: "negative", weight: -8, description: "Some key resources may not be available" }
        ],
        keyInsights: [
          "All success criteria for current phase met",
          "Strong stakeholder satisfaction scores",
          "Resource planning already in progress"
        ]
      }
    ]
  }

  const getIcon = (iconName: string) => {
    const iconProps = { className: "w-3 h-3" }
    switch (iconName) {
      case "heart": return <Heart {...iconProps} />
      case "user-x": return <UserX {...iconProps} />
      case "zap": return <Zap {...iconProps} />
      case "target": return <Target {...iconProps} />
      case "users": return <Users {...iconProps} />
      case "arrow-right": return <ArrowRight {...iconProps} />
      default: return <Target {...iconProps} />
    }
  }

  const getTrendIcon = (trend: PropensityPrediction['trend']) => {
    const iconProps = { className: "w-3 h-3" }
    switch (trend) {
      case 'increasing': return <TrendingUp {...iconProps} className="text-green-500" />
      case 'decreasing': return <TrendingDown {...iconProps} className="text-red-500" />
      default: return <Minus {...iconProps} className="text-slate-500" />
    }
  }

  const getProbabilityColor = (probability: number) => {
    if (probability >= 80) return "text-green-600 dark:text-green-400"
    if (probability >= 60) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  const getProbabilityBgColor = (probability: number) => {
    if (probability >= 80) return "bg-green-100 dark:bg-green-900/20"
    if (probability >= 60) return "bg-yellow-100 dark:bg-yellow-900/20"
    return "bg-red-100 dark:bg-red-900/20"
  }

  const getConfidenceBadge = (confidence: PropensityPrediction['confidence']) => {
    const baseClasses = "px-1.5 py-0.5 rounded text-xs font-medium"
    switch (confidence) {
      case 'high': 
        return `${baseClasses} bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300`
      case 'medium': 
        return `${baseClasses} bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300`
      case 'low': 
        return `${baseClasses} bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300`
      default: 
        return `${baseClasses} bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300`
    }
  }

  const getImpactIcon = (impact: ReasoningFactor['impact']) => {
    const iconProps = { className: "w-3 h-3" }
    switch (impact) {
      case 'positive': return <Plus {...iconProps} className="text-green-500" />
      case 'negative': return <Minus {...iconProps} className="text-red-500" />
      default: return <AlertTriangle {...iconProps} className="text-yellow-500" />
    }
  }

  const getImpactColor = (impact: ReasoningFactor['impact']) => {
    switch (impact) {
      case 'positive': return "text-green-600 dark:text-green-400"
      case 'negative': return "text-red-600 dark:text-red-400"
      default: return "text-yellow-600 dark:text-yellow-400"
    }
  }

  return (
    <div className="p-4 border-b border-slate-200 dark:border-slate-700">
      <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-3">
        Propensity Predictions
      </h3>

      {/* Predictions List */}
      <div className="space-y-2">
        {mockData.predictions.map((prediction, index) => {
          const isExpanded = expandedItems.has(index)
          return (
            <div key={index} className={`rounded-lg transition-all duration-200 ${getProbabilityBgColor(prediction.probability)}`}>
              <div 
                className="p-2 cursor-pointer hover:bg-opacity-80 transition-colors"
                onClick={() => toggleExpanded(index)}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    <div className="text-slate-600 dark:text-slate-400">
                      {getIcon(prediction.icon)}
                    </div>
                    <span className="text-xs font-medium text-slate-900 dark:text-slate-100">
                      {prediction.metric}
                    </span>
                    <div className="flex items-center space-x-1">
                      {getTrendIcon(prediction.trend)}
                      <span className={getConfidenceBadge(prediction.confidence)}>
                        {prediction.confidence}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm font-bold ${getProbabilityColor(prediction.probability)}`}>
                      {prediction.probability}%
                    </span>
                    {isExpanded ? 
                      <ChevronDown className="w-3 h-3 text-slate-500" /> : 
                      <ChevronRight className="w-3 h-3 text-slate-500" />
                    }
                  </div>
                </div>
                
                <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                  {prediction.description}
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1">
                  <div 
                    className={`h-1 rounded-full transition-all duration-300 ${
                      prediction.probability >= 80 ? 'bg-green-500' :
                      prediction.probability >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${prediction.probability}%` }}
                  ></div>
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="px-2 pb-2 space-y-3 border-t border-slate-200 dark:border-slate-700 pt-2 mt-2">
                  {/* Reasoning Factors */}
                  <div>
                    <h4 className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Contributing Factors:
                    </h4>
                    <div className="space-y-1">
                      {prediction.reasoning.map((factor, factorIndex) => (
                        <div key={factorIndex} className="flex items-start justify-between text-xs">
                          <div className="flex items-start space-x-2 flex-1">
                            {getImpactIcon(factor.impact)}
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-slate-700 dark:text-slate-300">
                                {factor.factor}
                              </div>
                              <div className="text-slate-500 dark:text-slate-400 mt-0.5">
                                {factor.description}
                              </div>
                            </div>
                          </div>
                          <span className={`font-semibold ml-2 flex-shrink-0 ${getImpactColor(factor.impact)}`}>
                            {factor.weight > 0 ? '+' : ''}{factor.weight}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Key Insights */}
                  <div>
                    <h4 className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Key Insights:
                    </h4>
                    <div className="space-y-1">
                      {prediction.keyInsights.map((insight, insightIndex) => (
                        <div key={insightIndex} className="text-xs text-slate-600 dark:text-slate-400 flex items-start space-x-1">
                          <span className="text-slate-400 dark:text-slate-500 mt-0.5">•</span>
                          <span>{insight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Last Updated */}
      <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-700">
        <div className="text-xs text-center text-slate-500 dark:text-slate-400">
          Updated {new Date(mockData.lastUpdated).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit' 
          })}
        </div>
      </div>
    </div>
  )
}
