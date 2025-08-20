"use client"

import { Heart, UserX, Zap, Target, Users, ArrowRight, AlertTriangle, CheckCircle, Clock } from "lucide-react"
import { PropensityData, PropensityPrediction } from "@/types"

interface PropensityPredictionsProps {
  data?: PropensityData
}

export default function PropensityPredictionsV3({ data }: PropensityPredictionsProps) {
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

  // Categorize predictions by priority quadrants
  const categorizeByPriority = () => {
    const categories = {
      highUrgentHigh: [] as Array<PropensityPrediction & {effectiveProbability: number}>,      // High probability + High confidence
      highUrgentMedium: [] as Array<PropensityPrediction & {effectiveProbability: number}>,    // High probability + Medium confidence  
      mediumUrgent: [] as Array<PropensityPrediction & {effectiveProbability: number}>,        // Medium probability + High confidence
      lowPriority: [] as Array<PropensityPrediction & {effectiveProbability: number}>          // Low probability or Low confidence
    }

    mockData.predictions.forEach(prediction => {
      const isChurnRisk = prediction.metric === "Churn Risk"
      const effectiveProbability = isChurnRisk ? 100 - prediction.probability : prediction.probability

      if (effectiveProbability >= 80 && prediction.confidence === 'high') {
        categories.highUrgentHigh.push({ ...prediction, effectiveProbability })
      } else if (effectiveProbability >= 70 && prediction.confidence === 'high') {
        categories.highUrgentMedium.push({ ...prediction, effectiveProbability })
      } else if (effectiveProbability >= 60 || prediction.confidence === 'high') {
        categories.mediumUrgent.push({ ...prediction, effectiveProbability })
      } else {
        categories.lowPriority.push({ ...prediction, effectiveProbability })
      }
    })

    return categories
  }

  const categories = categorizeByPriority()

  const PriorityCard = ({ 
    title, 
    items, 
    color, 
    bgColor, 
    icon 
  }: {
    title: string
    items: Array<PropensityPrediction & {effectiveProbability: number}>
    color: string
    bgColor: string
    icon: React.ReactNode
  }) => (
    <div className={`rounded-lg border p-3 ${bgColor}`}>
      <div className="flex items-center space-x-2 mb-3">
        <div className={color}>
          {icon}
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {title}
          </h4>
          <div className="text-xs text-slate-600 dark:text-slate-400">
            {items.length} items
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-2 flex-1 min-w-0">
              <div className="text-slate-600 dark:text-slate-400">
                {getIcon(item.icon)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-slate-900 dark:text-slate-100 truncate">
                  {item.metric}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 truncate">
                  {item.description}
                </div>
              </div>
            </div>
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {item.probability}%
            </div>
          </div>
        ))}
        
        {items.length === 0 && (
          <div className="text-xs text-slate-500 dark:text-slate-400 italic text-center py-2">
            No items in this category
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="p-4 border-b border-slate-200 dark:border-slate-700">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">
        Priority Matrix
      </h3>

      {/* Priority Quadrants */}
      <div className="grid grid-cols-1 gap-3 mb-4">
        <PriorityCard
          title="Critical Actions"
          items={categories.highUrgentHigh}
          color="text-red-600 dark:text-red-400"
          bgColor="bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800"
          icon={<AlertTriangle className="w-4 h-4" />}
        />
        
        <PriorityCard
          title="High Priority"
          items={categories.highUrgentMedium}
          color="text-orange-600 dark:text-orange-400"
          bgColor="bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800"
          icon={<Clock className="w-4 h-4" />}
        />
        
        <PriorityCard
          title="Medium Priority"
          items={categories.mediumUrgent}
          color="text-blue-600 dark:text-blue-400"
          bgColor="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800"
          icon={<Target className="w-4 h-4" />}
        />
        
        <PriorityCard
          title="Monitor"
          items={categories.lowPriority}
          color="text-green-600 dark:text-green-400"
          bgColor="bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800"
          icon={<CheckCircle className="w-4 h-4" />}
        />
      </div>

      {/* Action Summary */}
      <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
        <div className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
          Recommended Actions
        </div>
        
        <div className="space-y-2">
          {categories.highUrgentHigh.length > 0 && (
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-3 h-3 text-red-500 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-slate-700 dark:text-slate-300">
                <span className="font-medium">Immediate attention required:</span> Focus on {categories.highUrgentHigh.map(item => item.metric).join(', ')}
              </div>
            </div>
          )}
          
          {categories.highUrgentMedium.length > 0 && (
            <div className="flex items-start space-x-2">
              <Clock className="w-3 h-3 text-orange-500 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-slate-700 dark:text-slate-300">
                <span className="font-medium">Schedule review:</span> Plan actions for {categories.highUrgentMedium.map(item => item.metric).join(', ')}
              </div>
            </div>
          )}
          
          {categories.mediumUrgent.length > 0 && (
            <div className="flex items-start space-x-2">
              <Target className="w-3 h-3 text-blue-500 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-slate-700 dark:text-slate-300">
                <span className="font-medium">Optimize:</span> Look for improvement opportunities in {categories.mediumUrgent.map(item => item.metric).join(', ')}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Priority Distribution */}
      <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
        <div className="grid grid-cols-4 gap-2 text-center">
          <div>
            <div className="text-sm font-bold text-red-600 dark:text-red-400">
              {categories.highUrgentHigh.length}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400">Critical</div>
          </div>
          <div>
            <div className="text-sm font-bold text-orange-600 dark:text-orange-400">
              {categories.highUrgentMedium.length}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400">High</div>
          </div>
          <div>
            <div className="text-sm font-bold text-blue-600 dark:text-blue-400">
              {categories.mediumUrgent.length}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400">Medium</div>
          </div>
          <div>
            <div className="text-sm font-bold text-green-600 dark:text-green-400">
              {categories.lowPriority.length}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400">Monitor</div>
          </div>
        </div>
      </div>
    </div>
  )
}
