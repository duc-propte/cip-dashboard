"use client"

import { TrendingUp, TrendingDown, Minus, Heart, UserX, Zap, Target, Users, ArrowRight } from "lucide-react"
import { PropensityData, PropensityPrediction } from "@/types"

interface PropensityPredictionsProps {
  data?: PropensityData
}

export default function PropensityPredictionsV2({ data }: PropensityPredictionsProps) {
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
        metric: "Churn Risk",
        description: "Leave the project",
        probability: 12.8,
        confidence: "medium",
        trend: "decreasing",
        icon: "user-x",
        reasoning: [],
        keyInsights: ["Risk decreased by 18% this month"]
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
        metric: "Goal Completion",
        description: "Achieve project goals",
        probability: 91.3,
        confidence: "high",
        trend: "increasing",
        icon: "target",
        reasoning: [],
        keyInsights: ["Project is 15% ahead of schedule"]
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

  // Gauge chart component
  const GaugeChart = ({ 
    value, 
    label, 
    isRisk = false 
  }: { 
    value: number; 
    label: string; 
    isRisk?: boolean;
  }) => {
    const radius = 30
    const strokeWidth = 6
    const circumference = 2 * Math.PI * radius
    const strokeDasharray = circumference * 0.75 // 3/4 circle
    const strokeDashoffset = strokeDasharray - (strokeDasharray * value) / 100

    // Color based on value and whether it's a risk metric
    const getColor = () => {
      if (isRisk) {
        // For risk metrics, lower is better
        if (value <= 20) return "#10b981" // green
        if (value <= 40) return "#f59e0b" // yellow
        return "#ef4444" // red
      } else {
        // For positive metrics, higher is better
        if (value >= 80) return "#10b981" // green
        if (value >= 60) return "#3b82f6" // blue
        if (value >= 40) return "#f59e0b" // yellow
        return "#ef4444" // red
      }
    }

    return (
      <div className="flex flex-col items-center">
        <div className="relative">
          <svg width="80" height="80" viewBox="0 0 80 80" className="transform -rotate-90">
            {/* Background arc */}
            <circle
              cx="40"
              cy="40"
              r={radius}
              fill="transparent"
              stroke="currentColor"
              strokeWidth={strokeWidth}
              strokeDasharray={strokeDasharray}
              strokeDashoffset="0"
              strokeLinecap="round"
              className="text-slate-200 dark:text-slate-700"
            />
            {/* Progress arc */}
            <circle
              cx="40"
              cy="40"
              r={radius}
              fill="transparent"
              stroke={getColor()}
              strokeWidth={strokeWidth}
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          {/* Center value */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {value}%
            </span>
          </div>
        </div>
        <div className="text-xs text-center text-slate-600 dark:text-slate-400 mt-1">
          {label}
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 border-b border-slate-200 dark:border-slate-700">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">
        Propensity Gauges
      </h3>

      {/* Gauge Charts Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {mockData.predictions.map((prediction, index) => (
          <GaugeChart
            key={index}
            value={prediction.probability}
            label={prediction.metric}
            isRisk={prediction.metric === "Churn Risk"}
          />
        ))}
      </div>

      {/* Detailed List */}
      <div className="space-y-2">
        {mockData.predictions.map((prediction, index) => {
          const isChurnRisk = prediction.metric === "Churn Risk"
          
          return (
            <div
              key={index}
              className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 border border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="text-slate-600 dark:text-slate-400">
                    {getIcon(prediction.icon)}
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      {prediction.metric}
                    </span>
                    <div className="text-xs text-slate-600 dark:text-slate-400">
                      {prediction.description}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {getTrendIcon(prediction.trend)}
                  <span className={`text-lg font-bold ${
                    isChurnRisk
                      ? prediction.probability <= 20 ? 'text-green-600 dark:text-green-400' :
                        prediction.probability <= 40 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'
                      : prediction.probability >= 80 ? 'text-green-600 dark:text-green-400' :
                        prediction.probability >= 60 ? 'text-blue-600 dark:text-blue-400' :
                        prediction.probability >= 40 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {prediction.probability}%
                  </span>
                </div>
              </div>

              {/* Confidence indicator */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Confidence:</span>
                  <div className="flex space-x-1">
                    {[1, 2, 3].map((level) => (
                      <div
                        key={level}
                        className={`w-2 h-2 rounded-full ${
                          (prediction.confidence === 'high' && level <= 3) ||
                          (prediction.confidence === 'medium' && level <= 2) ||
                          (prediction.confidence === 'low' && level <= 1)
                            ? 'bg-blue-500'
                            : 'bg-slate-300 dark:bg-slate-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    {prediction.confidence}
                  </span>
                </div>
              </div>

              {/* Key insight */}
              {prediction.keyInsights.length > 0 && (
                <div className="mt-2 text-xs text-slate-600 dark:text-slate-400 italic">
                  {prediction.keyInsights[0]}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Performance Overview */}
      <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
        <div className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
          Performance Overview
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center">
            <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {mockData.predictions.filter(p => 
                p.metric !== "Churn Risk" ? p.probability >= 70 : p.probability <= 30
              ).length}/{mockData.predictions.length}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400">
              Good Performance
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {mockData.predictions.filter(p => p.confidence === 'high').length}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400">
              High Confidence
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
