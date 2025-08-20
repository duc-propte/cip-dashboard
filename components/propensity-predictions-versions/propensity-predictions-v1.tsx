"use client"

import { TrendingUp, TrendingDown, Minus, Heart, UserX, Zap, Target, Users, ArrowRight, Star, AlertCircle } from "lucide-react"
import { PropensityData, PropensityPrediction } from "@/types"

interface PropensityPredictionsProps {
  data?: PropensityData
}

export default function PropensityPredictionsV1({ data }: PropensityPredictionsProps) {
  // Mock data
  const mockData: PropensityData = data || {
    lastUpdated: "2024-12-22",
    predictions: [
      {
        metric: "Project Interest",
        description: "Continue with project",
        probability: 87.5,
        confidence: "high",
        trend: "increasing",
        icon: "heart",
        reasoning: [
          { factor: "High Engagement Score", impact: "positive", weight: 35, description: "User shows consistent daily engagement" },
          { factor: "Feature Usage", impact: "positive", weight: 25, description: "Actively using 8/10 core features" }
        ],
        keyInsights: [
          "User engagement has increased 23% over the last month",
          "Strong correlation with successful project outcomes"
        ]
      },
      {
        metric: "Churn Risk",
        description: "Leave the project",
        probability: 12.8,
        confidence: "medium",
        trend: "decreasing",
        icon: "user-x",
        reasoning: [
          { factor: "Low Recent Activity", impact: "negative", weight: 15, description: "Decreased activity in past 2 weeks" },
          { factor: "Strong Project History", impact: "positive", weight: -10, description: "Long-term engagement with platform" }
        ],
        keyInsights: [
          "Risk decreased by 18% this month",
          "User retention improving across similar profiles"
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
          { factor: "Past Adoption Rate", impact: "positive", weight: 30, description: "Quick adopter of previous features" }
        ],
        keyInsights: [
          "Historical adoption rate of 78% for new features"
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
          { factor: "Progress Tracking", impact: "positive", weight: 40, description: "Consistently meeting milestones" }
        ],
        keyInsights: [
          "Project is 15% ahead of schedule"
        ]
      }
    ]
  }

  const getIcon = (iconName: string) => {
    const iconProps = { className: "w-5 h-5" }
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
    const iconProps = { className: "w-4 h-4" }
    switch (trend) {
      case 'increasing': return <TrendingUp {...iconProps} className="text-green-500" />
      case 'decreasing': return <TrendingDown {...iconProps} className="text-red-500" />
      default: return <Minus {...iconProps} className="text-slate-500" />
    }
  }

  const getScoreGrade = (probability: number) => {
    if (probability >= 90) return { grade: 'A+', color: 'text-green-600 dark:text-green-400' }
    if (probability >= 80) return { grade: 'A', color: 'text-green-600 dark:text-green-400' }
    if (probability >= 70) return { grade: 'B', color: 'text-blue-600 dark:text-blue-400' }
    if (probability >= 60) return { grade: 'C', color: 'text-yellow-600 dark:text-yellow-400' }
    if (probability >= 50) return { grade: 'D', color: 'text-orange-600 dark:text-orange-400' }
    return { grade: 'F', color: 'text-red-600 dark:text-red-400' }
  }

  const getCardBackground = (probability: number, isChurnRisk: boolean = false) => {
    if (isChurnRisk) {
      // For churn risk, lower is better
      if (probability <= 20) return "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/20 border-green-200 dark:border-green-800"
      if (probability <= 40) return "bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950/30 dark:to-yellow-900/20 border-yellow-200 dark:border-yellow-800"
      return "bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/30 dark:to-red-900/20 border-red-200 dark:border-red-800"
    } else {
      // For other metrics, higher is better
      if (probability >= 80) return "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/20 border-green-200 dark:border-green-800"
      if (probability >= 60) return "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20 border-blue-200 dark:border-blue-800"
      if (probability >= 40) return "bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950/30 dark:to-yellow-900/20 border-yellow-200 dark:border-yellow-800"
      return "bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/30 dark:to-red-900/20 border-red-200 dark:border-red-800"
    }
  }

  const getPriorityLevel = (probability: number, isChurnRisk: boolean = false) => {
    if (isChurnRisk) {
      if (probability >= 60) return { level: "HIGH RISK", icon: <AlertCircle className="w-3 h-3" /> }
      if (probability >= 30) return { level: "MEDIUM", icon: <AlertCircle className="w-3 h-3" /> }
      return { level: "LOW RISK", icon: <Star className="w-3 h-3" /> }
    } else {
      if (probability >= 80) return { level: "HIGH", icon: <Star className="w-3 h-3" /> }
      if (probability >= 60) return { level: "MEDIUM", icon: <Target className="w-3 h-3" /> }
      return { level: "LOW", icon: <AlertCircle className="w-3 h-3" /> }
    }
  }

  return (
    <div className="p-4 border-b border-slate-200 dark:border-slate-700">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">
        Propensity Scores
      </h3>

      {/* Score Cards Grid */}
      <div className="grid grid-cols-1 gap-3">
        {mockData.predictions.map((prediction, index) => {
          const isChurnRisk = prediction.metric === "Churn Risk"
          const scoreGrade = getScoreGrade(prediction.probability)
          const priority = getPriorityLevel(prediction.probability, isChurnRisk)
          
          return (
            <div
              key={index}
              className={`rounded-lg border p-3 ${getCardBackground(prediction.probability, isChurnRisk)}`}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="text-slate-700 dark:text-slate-300">
                    {getIcon(prediction.icon)}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {prediction.metric}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">
                      {prediction.description}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {getTrendIcon(prediction.trend)}
                  <div className={`text-xs font-bold px-2 py-1 rounded ${
                    priority.level.includes('HIGH') || priority.level.includes('RISK') 
                      ? 'bg-white/50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                      : 'bg-white/30 dark:bg-slate-700/30 text-slate-600 dark:text-slate-400'
                  }`}>
                    {priority.level}
                  </div>
                </div>
              </div>

              {/* Score Display */}
              <div className="flex items-center justify-between">
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {prediction.probability}%
                  </span>
                  <span className={`text-lg font-bold ${scoreGrade.color}`}>
                    {scoreGrade.grade}
                  </span>
                </div>
                
                <div className="text-right">
                  <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                    Confidence
                  </div>
                  <div className={`text-xs font-semibold px-2 py-1 rounded ${
                    prediction.confidence === 'high' 
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                      : prediction.confidence === 'medium'
                      ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                      : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                  }`}>
                    {prediction.confidence.toUpperCase()}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-3">
                <div className="w-full bg-white/30 dark:bg-slate-700/30 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      isChurnRisk
                        ? prediction.probability <= 20 ? 'bg-green-500' : 
                          prediction.probability <= 40 ? 'bg-yellow-500' : 'bg-red-500'
                        : prediction.probability >= 80 ? 'bg-green-500' :
                          prediction.probability >= 60 ? 'bg-blue-500' :
                          prediction.probability >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${prediction.probability}%` }}
                  />
                </div>
              </div>

              {/* Key Insight */}
              {prediction.keyInsights.length > 0 && (
                <div className="mt-3 pt-2 border-t border-white/20 dark:border-slate-600/20">
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    💡 {prediction.keyInsights[0]}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Summary Stats */}
      <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <div className="text-sm font-bold text-green-600 dark:text-green-400">
              {mockData.predictions.filter(p => p.probability >= 80 && p.metric !== "Churn Risk").length}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400">High Propensity</div>
          </div>
          <div>
            <div className="text-sm font-bold text-red-600 dark:text-red-400">
              {mockData.predictions.filter(p => p.metric === "Churn Risk" && p.probability >= 30).length}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400">At Risk</div>
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {Math.round(mockData.predictions.reduce((sum, p) => sum + p.probability, 0) / mockData.predictions.length)}%
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400">Avg Score</div>
          </div>
        </div>
      </div>
    </div>
  )
}
