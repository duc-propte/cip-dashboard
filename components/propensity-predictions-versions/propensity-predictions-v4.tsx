"use client"

import { TrendingUp, TrendingDown, Minus, Heart, UserX, Zap, Target, Users, ArrowRight, ArrowDown } from "lucide-react"
import { PropensityData, PropensityPrediction } from "@/types"

interface PropensityPredictionsProps {
  data?: PropensityData
}

export default function PropensityPredictionsV4({ data }: PropensityPredictionsProps) {
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
        reasoning: [],
        keyInsights: ["User engagement has increased 23% over the last month"]
      },
      {
        metric: "Feature Adoption",
        description: "Use new features",
        probability: 73.2,
        confidence: "high",
        trend: "stable",
        icon: "zap",
        reasoning: [],
        keyInsights: ["Historical adoption rate of 78% for new features"]
      },
      {
        metric: "Team Collaboration",
        description: "Engage with team",
        probability: 68.9,
        confidence: "medium",
        trend: "stable",
        icon: "users",
        reasoning: [],
        keyInsights: ["Collaboration increases during project milestones"]
      },
      {
        metric: "Goal Completion",
        description: "Achieve project goals",
        probability: 91.3,
        confidence: "high",
        trend: "increasing",
        icon: "target",
        reasoning: [],
        keyInsights: ["Project is 15% ahead of schedule"]
      },
      {
        metric: "Next Phase",
        description: "Proceed to next phase",
        probability: 82.1,
        confidence: "high",
        trend: "increasing",
        icon: "arrow-right",
        reasoning: [],
        keyInsights: ["All success criteria for current phase met"]
      }
    ]
  }

  const getIcon = (iconName: string) => {
    const iconProps = { className: "w-4 h-4" }
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
    switch (trend) {
      case 'increasing': return <TrendingUp className="w-3 h-3 text-green-500" />
      case 'decreasing': return <TrendingDown className="w-3 h-3 text-red-500" />
      default: return <Minus className="w-3 h-3 text-slate-500" />
    }
  }

  // Sort predictions by probability for funnel effect
  const sortedPredictions = [...mockData.predictions]
    .filter(p => p.metric !== "Churn Risk")
    .sort((a, b) => b.probability - a.probability)

  // Funnel stage component
  const FunnelStage = ({ 
    prediction, 
    index, 
    total 
  }: { 
    prediction: PropensityPrediction; 
    index: number; 
    total: number; 
  }) => {
    const widthPercentage = 100 - (index * 15) // Gradually decrease width
    const minWidth = 40 // Minimum width percentage
    const actualWidth = Math.max(minWidth, widthPercentage)
    
    const getColor = (probability: number) => {
      if (probability >= 85) return "bg-gradient-to-r from-green-400 to-green-600"
      if (probability >= 75) return "bg-gradient-to-r from-blue-400 to-blue-600"
      if (probability >= 65) return "bg-gradient-to-r from-yellow-400 to-yellow-600"
      return "bg-gradient-to-r from-orange-400 to-orange-600"
    }

    return (
      <div className="flex flex-col items-center mb-3">
        {/* Funnel Stage */}
        <div 
          className={`${getColor(prediction.probability)} rounded-lg p-3 text-white relative shadow-lg`}
          style={{ width: `${actualWidth}%` }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="text-white">
                {getIcon(prediction.icon)}
              </div>
              <div>
                <div className="text-sm font-semibold">
                  {prediction.metric}
                </div>
                <div className="text-xs opacity-90">
                  {prediction.description}
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-lg font-bold">
                {prediction.probability}%
              </div>
              <div className="flex items-center space-x-1">
                {getTrendIcon(prediction.trend)}
                <span className="text-xs opacity-90">
                  {prediction.confidence}
                </span>
              </div>
            </div>
          </div>
          
          {/* Progress bar within stage */}
          <div className="mt-2 w-full bg-white/20 rounded-full h-1.5">
            <div 
              className="bg-white h-1.5 rounded-full transition-all duration-1000"
              style={{ width: `${prediction.probability}%` }}
            />
          </div>
        </div>
        
        {/* Arrow connector */}
        {index < total - 1 && (
          <ArrowDown className="w-4 h-4 text-slate-400 dark:text-slate-500 my-1" />
        )}
      </div>
    )
  }

  // Calculate funnel metrics
  const averageProbability = sortedPredictions.reduce((sum, p) => sum + p.probability, 0) / sortedPredictions.length
  const highConfidenceCount = sortedPredictions.filter(p => p.confidence === 'high').length
  const improvingTrends = sortedPredictions.filter(p => p.trend === 'increasing').length

  return (
    <div className="p-4 border-b border-slate-200 dark:border-slate-700">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">
        Propensity Funnel
      </h3>

      {/* Funnel Visualization */}
      <div className="mb-6">
        {sortedPredictions.map((prediction, index) => (
          <FunnelStage
            key={prediction.metric}
            prediction={prediction}
            index={index}
            total={sortedPredictions.length}
          />
        ))}
      </div>

      {/* Funnel Insights */}
      <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 mb-4">
        <div className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
          Funnel Analysis
        </div>
        <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex justify-between">
            <span>Top Stage:</span>
            <span className="font-medium text-slate-900 dark:text-slate-100">
              {sortedPredictions[0]?.metric} ({sortedPredictions[0]?.probability}%)
            </span>
          </div>
          <div className="flex justify-between">
            <span>Bottleneck:</span>
            <span className="font-medium text-slate-900 dark:text-slate-100">
              {sortedPredictions[sortedPredictions.length - 1]?.metric} ({sortedPredictions[sortedPredictions.length - 1]?.probability}%)
            </span>
          </div>
          <div className="flex justify-between">
            <span>Conversion Rate:</span>
            <span className="font-medium text-slate-900 dark:text-slate-100">
              {Math.round((sortedPredictions[sortedPredictions.length - 1]?.probability / sortedPredictions[0]?.probability) * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* Stage Performance */}
      <div className="space-y-2">
        <div className="text-xs font-medium text-slate-700 dark:text-slate-300">
          Stage Performance
        </div>
        {sortedPredictions.map((prediction, index) => (
          <div key={prediction.metric} className="flex items-center justify-between py-2 border-b border-slate-200 dark:border-slate-700 last:border-b-0">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-slate-300 dark:bg-slate-600 flex items-center justify-center text-xs font-bold text-white">
                {index + 1}
              </div>
              <span className="text-xs text-slate-700 dark:text-slate-300">
                {prediction.metric}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-medium text-slate-900 dark:text-slate-100">
                {prediction.probability}%
              </span>
              {getTrendIcon(prediction.trend)}
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {Math.round(averageProbability)}%
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400">
              Avg Score
            </div>
          </div>
          <div>
            <div className="text-sm font-bold text-blue-600 dark:text-blue-400">
              {highConfidenceCount}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400">
              High Confidence
            </div>
          </div>
          <div>
            <div className="text-sm font-bold text-green-600 dark:text-green-400">
              {improvingTrends}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400">
              Improving
            </div>
          </div>
        </div>
      </div>

      {/* Key Insights */}
      <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
        <div className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
          Key Insights
        </div>
        <div className="space-y-1">
          {sortedPredictions[0]?.keyInsights.slice(0, 2).map((insight, index) => (
            <div key={index} className="text-xs text-slate-600 dark:text-slate-400 flex items-start space-x-1">
              <span className="text-slate-400 dark:text-slate-500 mt-0.5">•</span>
              <span>{insight}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
