"use client"

import { Eye, Search, Calculator, CheckSquare, FileText, ShoppingCart } from "lucide-react"

interface PurchaseCycleStage {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  status: 'completed' | 'current' | 'upcoming'
  completionDate?: string
  estimatedDays?: number
}

interface PurchaseCycleData {
  currentStage: string
  overallProgress: number
  lastUpdated: string
  stages: PurchaseCycleStage[]
}

export default function PurchaseCycle() {
  // Mock data - replace with real data
  const purchaseCycleData: PurchaseCycleData = {
    currentStage: "researching",
    overallProgress: 33,
    lastUpdated: "2024-12-20T11:30:00Z",
    stages: [
      {
        id: "dreaming",
        name: "Land Dreaming",
        description: "Initial interest in land/building dreams",
        icon: <Eye className="w-4 h-4" />,
        status: "completed",
        completionDate: "Dec 15, 2024",
        estimatedDays: 0
      },
      {
        id: "researching",
        name: "Location Research",
        description: "Researching areas, schools, amenities",
        icon: <Search className="w-4 h-4" />,
        status: "current",
        estimatedDays: 14
      },
      {
        id: "financial-planning",
        name: "Land Finance Planning",
        description: "Land loan pre-approval and budgeting",
        icon: <Calculator className="w-4 h-4" />,
        status: "upcoming",
        estimatedDays: 21
      },
      {
        id: "shortlisting",
        name: "Estate Shortlisting",
        description: "Comparing estates and lot options",
        icon: <CheckSquare className="w-4 h-4" />,
        status: "upcoming",
        estimatedDays: 35
      },
      {
        id: "due-diligence",
        name: "Site Inspection",
        description: "Land inspection and soil/title checks",
        icon: <FileText className="w-4 h-4" />,
        status: "upcoming",
        estimatedDays: 49
      },
      {
        id: "purchase-ready",
        name: "Contract Ready",
        description: "Ready to sign land contract",
        icon: <ShoppingCart className="w-4 h-4" />,
        status: "upcoming",
        estimatedDays: 56
      }
    ]
  }

  const getStageColor = (status: PurchaseCycleStage['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-300'
      case 'current':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300'
      case 'upcoming':
        return 'text-slate-400 bg-slate-100 dark:bg-slate-700 dark:text-slate-500'
      default:
        return 'text-slate-400 bg-slate-100 dark:bg-slate-700 dark:text-slate-500'
    }
  }

  const getConnectorColor = (currentStatus: PurchaseCycleStage['status']) => {
    if (currentStatus === 'completed') {
      return 'bg-green-400'
    } else if (currentStatus === 'current') {
      return 'bg-gradient-to-b from-blue-400 to-slate-300'
    } else {
      return 'bg-slate-300'
    }
  }

  const formatEstimatedTime = (days: number) => {
    if (days === 0) return "Complete"
    if (days <= 7) return `${days} days`
    if (days <= 30) return `${Math.ceil(days / 7)} weeks`
    return `${Math.ceil(days / 30)} months`
  }

  return (
    <div className="p-4 border-b border-slate-200 dark:border-slate-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
            Purchase Cycle
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Customer buying journey progress
          </p>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
            {purchaseCycleData.overallProgress}%
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">complete</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${purchaseCycleData.overallProgress}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-1 text-xs text-slate-500 dark:text-slate-400">
          <span>Start</span>
          <span>Purchase Ready</span>
        </div>
      </div>

      {/* Stages */}
      <div className="space-y-4">
        {purchaseCycleData.stages.map((stage, index) => {
          const isLast = index === purchaseCycleData.stages.length - 1
          
          return (
            <div key={stage.id} className="relative">
              {/* Stage Item */}
              <div className="flex items-start space-x-3">
                {/* Icon */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${getStageColor(stage.status)}`}>
                  {stage.icon}
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className={`text-sm font-medium ${
                      stage.status === 'current' ? 'text-blue-900 dark:text-blue-100' :
                      stage.status === 'completed' ? 'text-green-900 dark:text-green-100' :
                      'text-slate-600 dark:text-slate-400'
                    }`}>
                      {stage.name}
                    </h4>
                    {stage.status === 'current' && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                        Current
                      </span>
                    )}
                    {stage.status === 'completed' && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                        ✓ Done
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {stage.description}
                  </p>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {stage.completionDate ? (
                      <span>Completed: {stage.completionDate}</span>
                    ) : stage.estimatedDays !== undefined ? (
                      <span>Est. {formatEstimatedTime(stage.estimatedDays)}</span>
                    ) : null}
                  </div>
                </div>
              </div>

              {/* Connector Line */}
              {!isLast && (
                <div className="absolute left-4 top-8 w-0.5 h-16 -translate-x-0.5">
                  <div className={`w-full h-full ${getConnectorColor(stage.status)}`}></div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Current Stage Insights */}
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <div className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
          Current Focus: {purchaseCycleData.stages.find(s => s.status === 'current')?.name}
        </div>
        <div className="text-xs text-blue-800 dark:text-blue-200">
          Customer is actively gathering information and comparing options. High engagement with property details and pricing.
        </div>
      </div>
    </div>
  )
}
