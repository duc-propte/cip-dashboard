"use client"

import { useState } from "react"
import { Phone, Mail, Calendar, FileText, AlertTriangle, TrendingUp, Target, CheckCircle, Play, RotateCcw } from "lucide-react"
import { ActionRecommendationsData, ActionRecommendation } from "@/types"

interface ActionRecommendationsV3Props {
  data?: ActionRecommendationsData
}

interface ScheduledAction extends ActionRecommendation {
  scheduledDate: string
  scheduledTime: string
  status: 'scheduled' | 'overdue' | 'completed' | 'in-progress'
}

export default function ActionRecommendationsV3({ }: ActionRecommendationsV3Props) {
  const [viewMode, setViewMode] = useState<'today' | 'week' | 'month'>('today')
  const [completedActions, setCompletedActions] = useState<Set<string>>(new Set())
  const [inProgressActions, setInProgressActions] = useState<Set<string>>(new Set())

  // Mock scheduled actions data
  const mockScheduledActions: ScheduledAction[] = [
    {
      id: "1",
      title: "High-Priority Follow-up Call",
      description: "Customer showed high purchase intent with multiple premium lot views",
      priority: "high",
      category: "follow-up",
      actionType: "call",
      estimatedImpact: 92,
      timeframe: "Within 1 hour",
      basedOn: ["3 phone clicks", "Premium lot views"],
      suggestedActions: ["Call immediately", "Prepare lot info"],
      icon: "phone",
      scheduledDate: "2024-12-22",
      scheduledTime: "09:00",
      status: "overdue"
    },
    {
      id: "2",
      title: "Send Property Portfolio",
      description: "Curated selection based on family preferences",
      priority: "high",
      category: "engagement",
      actionType: "email",
      estimatedImpact: 78,
      timeframe: "Today",
      basedOn: ["Family indicators", "Lot preferences"],
      suggestedActions: ["Create portfolio", "Include school info"],
      icon: "mail",
      scheduledDate: "2024-12-22",
      scheduledTime: "10:30",
      status: "scheduled"
    },
    {
      id: "3",
      title: "Design Consultation Follow-up",
      description: "Schedule architect meeting for custom home discussion",
      priority: "medium",
      category: "follow-up",
      actionType: "meeting",
      estimatedImpact: 85,
      timeframe: "This week",
      basedOn: ["Custom home interest", "Design gallery views"],
      suggestedActions: ["Schedule consultation", "Prepare portfolio"],
      icon: "calendar",
      scheduledDate: "2024-12-22",
      scheduledTime: "14:00",
      status: "scheduled"
    },
    {
      id: "4",
      title: "Address Pricing Concerns",
      description: "Customer comparing prices across multiple platforms",
      priority: "medium",
      category: "risk",
      actionType: "call",
      estimatedImpact: 65,
      timeframe: "Today",
      basedOn: ["Price comparisons", "Competitor visits"],
      suggestedActions: ["Understand budget", "Present options"],
      icon: "alert",
      scheduledDate: "2024-12-22",
      scheduledTime: "15:30",
      status: "in-progress"
    },
    {
      id: "5",
      title: "Site Visit Scheduling",
      description: "Weekend site visit for interested family",
      priority: "high",
      category: "opportunity",
      actionType: "meeting",
      estimatedImpact: 88,
      timeframe: "This week",
      basedOn: ["Weekend browsing", "Family indicators"],
      suggestedActions: ["Schedule weekend visit", "Prepare materials"],
      icon: "calendar",
      scheduledDate: "2024-12-23",
      scheduledTime: "10:00",
      status: "scheduled"
    },
    {
      id: "6",
      title: "Market Insights Report",
      description: "Investment-focused market analysis for interested buyer",
      priority: "low",
      category: "engagement",
      actionType: "content",
      estimatedImpact: 45,
      timeframe: "This week",
      basedOn: ["Investment interest", "ROI calculations"],
      suggestedActions: ["Send market report", "Include projections"],
      icon: "trending-up",
      scheduledDate: "2024-12-23",
      scheduledTime: "11:30",
      status: "scheduled"
    },
    {
      id: "7",
      title: "Re-engagement Email Campaign",
      description: "Customer activity decreased significantly",
      priority: "medium",
      category: "risk",
      actionType: "email",
      estimatedImpact: 55,
      timeframe: "Today",
      basedOn: ["Activity drop", "No recent engagement"],
      suggestedActions: ["Send re-engagement", "Offer incentives"],
      icon: "mail",
      scheduledDate: "2024-12-24",
      scheduledTime: "09:00",
      status: "scheduled"
    }
  ]

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

  const getStatusColor = (status: ScheduledAction['status']) => {
    switch (status) {
      case 'scheduled': return "border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/20"
      case 'overdue': return "border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-900/20"
      case 'in-progress': return "border-yellow-300 bg-yellow-50 dark:border-yellow-700 dark:bg-yellow-900/20"
      case 'completed': return "border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900/20"
      default: return "border-slate-300 bg-slate-50 dark:border-slate-600 dark:bg-slate-800"
    }
  }

  const getStatusBadge = (status: ScheduledAction['status']) => {
    switch (status) {
      case 'scheduled': return { text: 'Scheduled', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' }
      case 'overdue': return { text: 'Overdue', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' }
      case 'in-progress': return { text: 'In Progress', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' }
      case 'completed': return { text: 'Completed', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' }
      default: return { text: 'Unknown', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' }
    }
  }

  const getPriorityColor = (priority: ActionRecommendation['priority']) => {
    switch (priority) {
      case 'high': return "text-red-600 dark:text-red-400"
      case 'medium': return "text-yellow-600 dark:text-yellow-400"
      case 'low': return "text-blue-600 dark:text-blue-400"
      default: return "text-slate-600 dark:text-slate-400"
    }
  }

  const handleComplete = (actionId: string) => {
    setCompletedActions(prev => new Set([...prev, actionId]))
    setInProgressActions(prev => {
      const newSet = new Set(prev)
      newSet.delete(actionId)
      return newSet
    })
  }

  const handleStartProgress = (actionId: string) => {
    setInProgressActions(prev => new Set([...prev, actionId]))
  }

  const handleReschedule = (actionId: string) => {
    // In a real app, this would open a date/time picker
    console.log("Reschedule action:", actionId)
  }



  const formatTime = (time: string) => {
    const [hour, minute] = time.split(':')
    const hourNum = parseInt(hour)
    const ampm = hourNum >= 12 ? 'PM' : 'AM'
    const displayHour = hourNum % 12 || 12
    return `${displayHour}:${minute} ${ampm}`
  }

  const isToday = (dateString: string) => {
    const today = new Date().toISOString().split('T')[0]
    return dateString === today
  }

  const isTomorrow = (dateString: string) => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return dateString === tomorrow.toISOString().split('T')[0]
  }

  const getDateLabel = (dateString: string) => {
    if (isToday(dateString)) return 'Today'
    if (isTomorrow(dateString)) return 'Tomorrow'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
  }

  const groupActionsByDate = (actions: ScheduledAction[]) => {
    const grouped: Record<string, ScheduledAction[]> = {}
    actions.forEach(action => {
      if (!grouped[action.scheduledDate]) {
        grouped[action.scheduledDate] = []
      }
      grouped[action.scheduledDate].push(action)
    })
    
    // Sort actions within each date by time
    Object.keys(grouped).forEach(date => {
      grouped[date].sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime))
    })
    
    return grouped
  }

  const filteredActions = mockScheduledActions.filter(action => {
    if (completedActions.has(action.id)) return false
    return true
  })

  const groupedActions = groupActionsByDate(filteredActions)
  const sortedDates = Object.keys(groupedActions).sort()

  const todayActions = filteredActions.filter(action => isToday(action.scheduledDate))
  const overdueActions = filteredActions.filter(action => action.status === 'overdue')
  const inProgressCount = filteredActions.filter(action => inProgressActions.has(action.id)).length

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Action Timeline & Scheduler
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Time-based action management with scheduling and progress tracking
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {/* View Mode Toggle */}
          <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
            {(['today', 'week', 'month'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1 text-sm rounded-md transition-colors capitalize ${
                  viewMode === mode
                    ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-slate-100 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <div>
              <div className="text-lg font-bold text-blue-900 dark:text-blue-100">{todayActions.length}</div>
              <div className="text-xs text-blue-700 dark:text-blue-300">Today&apos;s Actions</div>
            </div>
          </div>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <div>
              <div className="text-lg font-bold text-red-900 dark:text-red-100">{overdueActions.length}</div>
              <div className="text-xs text-red-700 dark:text-red-300">Overdue</div>
            </div>
          </div>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Play className="w-5 h-5 text-yellow-600" />
            <div>
              <div className="text-lg font-bold text-yellow-900 dark:text-yellow-100">{inProgressCount}</div>
              <div className="text-xs text-yellow-700 dark:text-yellow-300">In Progress</div>
            </div>
          </div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <div className="text-lg font-bold text-green-900 dark:text-green-100">{completedActions.size}</div>
              <div className="text-xs text-green-700 dark:text-green-300">Completed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-6">
        {sortedDates.map((date, dateIndex) => (
          <div key={date} className="relative">
            {/* Date Header */}
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-slate-400 rounded-full"></div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {getDateLabel(date)}
                </h3>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {groupedActions[date].length} action{groupedActions[date].length !== 1 ? 's' : ''}
                </span>
              </div>
              {isToday(date) && (
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              )}
            </div>

            {/* Timeline Line */}
            {dateIndex < sortedDates.length - 1 && (
              <div className="absolute left-1.5 top-8 bottom-0 w-px bg-slate-200 dark:bg-slate-600"></div>
            )}

            {/* Actions for this date */}
            <div className="ml-8 space-y-4">
              {groupedActions[date].map((action) => {
                const statusBadge = getStatusBadge(
                  completedActions.has(action.id) ? 'completed' :
                  inProgressActions.has(action.id) ? 'in-progress' :
                  action.status
                )
                
                return (
                  <div
                    key={action.id}
                    className={`relative p-4 rounded-lg border-2 transition-all ${
                      completedActions.has(action.id) ? getStatusColor('completed') :
                      inProgressActions.has(action.id) ? getStatusColor('in-progress') :
                      getStatusColor(action.status)
                    }`}
                  >
                    {/* Timeline dot */}
                    <div className="absolute -left-10 top-6 w-3 h-3 bg-white border-2 border-slate-400 rounded-full"></div>
                    
                    {/* Action Content */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className="flex-shrink-0 p-2 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600">
                          {getIcon(action.icon)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                              {formatTime(action.scheduledTime)}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusBadge.color}`}>
                              {statusBadge.text}
                            </span>
                            <span className={`text-xs font-medium uppercase ${getPriorityColor(action.priority)}`}>
                              {action.priority}
                            </span>
                          </div>
                          <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                            {action.title}
                          </h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                            {action.description}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-slate-500 dark:text-slate-400">
                            <div className="flex items-center space-x-1">
                              <TrendingUp className="w-3 h-3 text-green-500" />
                              <span>{action.estimatedImpact}% impact</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Target className="w-3 h-3" />
                              <span className="capitalize">{action.category}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex items-center space-x-2 ml-4">
                        {!completedActions.has(action.id) && !inProgressActions.has(action.id) && (
                          <button
                            onClick={() => handleStartProgress(action.id)}
                            className="p-2 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg transition-colors"
                            title="Start action"
                          >
                            <Play className="w-4 h-4" />
                          </button>
                        )}
                        {inProgressActions.has(action.id) && (
                          <button
                            onClick={() => handleComplete(action.id)}
                            className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                            title="Complete action"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        {!completedActions.has(action.id) && (
                          <button
                            onClick={() => handleReschedule(action.id)}
                            className="p-2 text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
                            title="Reschedule"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {sortedDates.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
            No scheduled actions
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            All actions have been completed or there are no actions scheduled for the selected period.
          </p>
        </div>
      )}
    </div>
  )
}
