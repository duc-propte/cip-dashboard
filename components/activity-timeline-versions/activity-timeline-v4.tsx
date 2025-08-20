"use client"

import { useState, useMemo, useCallback } from "react"
import { Calendar, Globe, Phone, Mail, MapPin, Star, TrendingUp, User, Heart, Eye, Download, MessageCircle } from "lucide-react"

export default function ActivityTimelineV4() {
  const [selectedTimeFilter, setSelectedTimeFilter] = useState<'week' | 'month'>('month')

  // Generate mock customer journey data
  const generateCustomerJourney = useCallback(() => {
    const journeyStages = ['awareness', 'interest', 'consideration', 'intent', 'evaluation', 'purchase']
    const journey = []
    const now = new Date()
    const daysToShow = selectedTimeFilter === 'week' ? 7 : 30

    // Create journey milestones
    let currentStage = 0
    let stageProgress = 0
    
    for (let day = 0; day < daysToShow; day++) {
      const date = new Date(now)
      date.setDate(now.getDate() - (daysToShow - day - 1))
      
      // Skip some days for realistic patterns
      if (Math.random() > 0.7) continue

      // Generate 1-4 activities per day
      const activityCount = 1 + Math.floor(Math.random() * 4)
      
      for (let a = 0; a < activityCount; a++) {
        const timestamp = new Date(date)
        timestamp.setHours(9 + Math.floor(Math.random() * 10), Math.floor(Math.random() * 60))
        
        const channels = ['website', 'phone', 'email']
        const channel = channels[Math.floor(Math.random() * channels.length)]
        
        // Determine if this activity advances the journey stage
        const advancesStage = Math.random() > 0.7 && currentStage < journeyStages.length - 1
        if (advancesStage) {
          currentStage++
          stageProgress = 0
        } else {
          stageProgress += 10 + Math.floor(Math.random() * 20)
        }

        const activity = {
          id: `${day}-${a}`,
          timestamp,
          channel,
          stage: journeyStages[currentStage],
          stageProgress: Math.min(100, stageProgress),
          action: getJourneyAction(journeyStages[currentStage], channel),
          engagementLevel: getEngagementLevel(journeyStages[currentStage]),
          emotionalState: getEmotionalState(journeyStages[currentStage]),
          salesResponse: getSalesResponse(journeyStages[currentStage]),
          conversionProbability: getConversionProbability(currentStage, stageProgress),
          touchpointValue: getTouchpointValue(journeyStages[currentStage], channel),
          nextBestAction: getNextBestAction(journeyStages[currentStage])
        }

        journey.push(activity)
      }
    }

    return journey.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
  }, [selectedTimeFilter])

  const getJourneyAction = (stage: string, channel: string) => {
    const stageActions = {
      awareness: {
        website: ['Discovered through search', 'Viewed homepage', 'Read about project'],
        phone: ['Called after seeing ad', 'Inquired about project'],
        email: ['Opened welcome email', 'Clicked project link']
      },
      interest: {
        website: ['Browsed lot listings', 'Viewed gallery', 'Read testimonials'],
        phone: ['Asked general questions', 'Requested information'],
        email: ['Subscribed to updates', 'Downloaded project info']
      },
      consideration: {
        website: ['Compared lot options', 'Used mortgage calculator', 'Viewed floor plans'],
        phone: ['Discussed requirements', 'Asked about financing'],
        email: ['Requested customization options', 'Asked about timeline']
      },
      intent: {
        website: ['Downloaded brochure', 'Viewed pricing details', 'Checked availability'],
        phone: ['Scheduled site visit', 'Discussed pricing'],
        email: ['Requested detailed quote', 'Asked about next steps']
      },
      evaluation: {
        website: ['Revisited favorite lots', 'Compared financing options', 'Read contract terms'],
        phone: ['Negotiated terms', 'Discussed modifications'],
        email: ['Reviewed proposals', 'Asked legal questions']
      },
      purchase: {
        website: ['Reviewed final details', 'Accessed portal'],
        phone: ['Finalized agreement', 'Scheduled closing'],
        email: ['Signed documents', 'Confirmed purchase']
      }
    }
    
    const actions = stageActions[stage as keyof typeof stageActions]?.[channel as keyof typeof stageActions.awareness] || []
    return actions[Math.floor(Math.random() * actions.length)] || 'Customer activity'
  }

  const getEngagementLevel = (stage: string) => {
    const levels = { awareness: 'low', interest: 'medium', consideration: 'medium', intent: 'high', evaluation: 'high', purchase: 'very_high' }
    return levels[stage as keyof typeof levels] || 'low'
  }

  const getEmotionalState = (stage: string) => {
    const states = { 
      awareness: 'curious', 
      interest: 'interested', 
      consideration: 'analytical', 
      intent: 'excited', 
      evaluation: 'cautious', 
      purchase: 'confident' 
    }
    return states[stage as keyof typeof states] || 'neutral'
  }

  const getSalesResponse = (stage: string) => {
    const responses = {
      awareness: ['Sent welcome information', 'Added to nurture campaign'],
      interest: ['Provided project overview', 'Scheduled consultation'],
      consideration: ['Sent comparison guide', 'Offered site visit'],
      intent: ['Expedited response', 'Assigned specialist'],
      evaluation: ['Provided detailed proposal', 'Addressed concerns'],
      purchase: ['Facilitated process', 'Prepared documentation']
    }
    const stageResponses = responses[stage as keyof typeof responses] || []
    return stageResponses[Math.floor(Math.random() * stageResponses.length)] || 'Standard follow-up'
  }

  const getConversionProbability = (stageIndex: number, progress: number) => {
    const baseProb = [10, 25, 40, 60, 80, 95][stageIndex] || 10
    const progressBonus = Math.floor(progress / 10) * 2
    return Math.min(95, baseProb + progressBonus)
  }

  const getTouchpointValue = (stage: string, channel: string) => {
    const values = { 
      awareness: { website: 5, phone: 15, email: 8 },
      interest: { website: 10, phone: 25, email: 12 },
      consideration: { website: 15, phone: 35, email: 18 },
      intent: { website: 25, phone: 45, email: 30 },
      evaluation: { website: 30, phone: 50, email: 35 },
      purchase: { website: 40, phone: 60, email: 45 }
    }
    return values[stage as keyof typeof values]?.[channel as keyof typeof values.awareness] || 10
  }

  const getNextBestAction = (stage: string) => {
    const actions = {
      awareness: 'Send project overview',
      interest: 'Schedule consultation call',
      consideration: 'Offer site visit',
      intent: 'Provide detailed proposal',
      evaluation: 'Address specific concerns',
      purchase: 'Prepare contracts'
    }
    return actions[stage as keyof typeof actions] || 'Follow up'
  }

  const journey = useMemo(() => generateCustomerJourney(), [generateCustomerJourney])

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'website': return <Globe className="w-4 h-4" />
      case 'phone': return <Phone className="w-4 h-4" />
      case 'email': return <Mail className="w-4 h-4" />
      default: return <Globe className="w-4 h-4" />
    }
  }

  const getStageIcon = (stage: string) => {
    switch (stage) {
      case 'awareness': return <Eye className="w-4 h-4" />
      case 'interest': return <Heart className="w-4 h-4" />
      case 'consideration': return <Star className="w-4 h-4" />
      case 'intent': return <TrendingUp className="w-4 h-4" />
      case 'evaluation': return <Download className="w-4 h-4" />
      case 'purchase': return <MapPin className="w-4 h-4" />
      default: return <User className="w-4 h-4" />
    }
  }

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'awareness': return 'bg-slate-100 border-slate-300 text-slate-700 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-300'
      case 'interest': return 'bg-blue-100 border-blue-300 text-blue-700 dark:bg-blue-950/30 dark:border-blue-600 dark:text-blue-300'
      case 'consideration': return 'bg-purple-100 border-purple-300 text-purple-700 dark:bg-purple-950/30 dark:border-purple-600 dark:text-purple-300'
      case 'intent': return 'bg-yellow-100 border-yellow-300 text-yellow-700 dark:bg-yellow-950/30 dark:border-yellow-600 dark:text-yellow-300'
      case 'evaluation': return 'bg-orange-100 border-orange-300 text-orange-700 dark:bg-orange-950/30 dark:border-orange-600 dark:text-orange-300'
      case 'purchase': return 'bg-green-100 border-green-300 text-green-700 dark:bg-green-950/30 dark:border-green-600 dark:text-green-300'
      default: return 'bg-gray-100 border-gray-300 text-gray-700 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300'
    }
  }

  const getEngagementColor = (level: string) => {
    switch (level) {
      case 'very_high': return 'text-green-600 dark:text-green-400'
      case 'high': return 'text-blue-600 dark:text-blue-400'
      case 'medium': return 'text-yellow-600 dark:text-yellow-400'
      default: return 'text-slate-600 dark:text-slate-400'
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: true 
    })
  }

  // Group by date
  const journeyByDate = journey.reduce((acc, activity) => {
    const date = activity.timestamp.toISOString().split('T')[0]
    if (!acc[date]) acc[date] = []
    acc[date].push(activity)
    return acc
  }, {} as Record<string, typeof journey>)

  // Calculate journey metrics
  const currentStage = journey.length > 0 ? journey[journey.length - 1].stage : 'awareness'
  const avgConversionProb = journey.reduce((sum, a) => sum + a.conversionProbability, 0) / journey.length || 0
  const totalTouchpointValue = journey.reduce((sum, a) => sum + a.touchpointValue, 0)
  const highEngagementActivities = journey.filter(a => ['high', 'very_high'].includes(a.engagementLevel)).length

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Customer Journey
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            End-to-end customer experience tracking and progression analysis
          </p>
        </div>
        
        {/* Time Filter */}
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-slate-500" />
          <div className="flex space-x-1">
            {['week', 'month'].map(filter => (
              <button
                key={filter}
                onClick={() => setSelectedTimeFilter(filter as 'week' | 'month')}
                className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                  selectedTimeFilter === filter
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Journey Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-50 dark:bg-slate-750 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-slate-900 dark:text-slate-100 capitalize">
            {currentStage}
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400">Current Stage</div>
        </div>
        <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
            {Math.round(avgConversionProb)}%
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400">Conversion Probability</div>
        </div>
        <div className="bg-green-50 dark:bg-green-950/30 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-green-600 dark:text-green-400">
            {totalTouchpointValue}
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400">Total Touchpoint Value</div>
        </div>
        <div className="bg-orange-50 dark:bg-orange-950/30 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-orange-600 dark:text-orange-400">
            {highEngagementActivities}
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400">High Engagement</div>
        </div>
      </div>

      {/* Journey Timeline */}
      <div className="space-y-6">
        {Object.entries(journeyByDate).map(([date, activities]) => (
          <div key={date} className="space-y-3">
            {/* Date Header */}
            <div className="flex items-center space-x-3">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {new Date(date).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </h3>
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700"></div>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {activities.length} touchpoint{activities.length !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Activities for this date */}
            <div className="space-y-3">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className={`border rounded-lg p-4 ${getStageColor(activity.stage)}`}
                >
                  <div className="flex items-start justify-between">
                    {/* Activity Details */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="flex items-center space-x-1">
                          {getStageIcon(activity.stage)}
                          <span className="text-sm font-semibold capitalize">
                            {activity.stage}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          {getChannelIcon(activity.channel)}
                          <span className="text-xs text-slate-600 dark:text-slate-400 capitalize">
                            {activity.channel}
                          </span>
                        </div>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {formatTime(activity.timestamp)}
                        </span>
                      </div>
                      
                      <div className="text-sm text-slate-800 dark:text-slate-200 mb-2">
                        {activity.action}
                      </div>
                      
                      <div className="flex items-center space-x-4 text-xs">
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="w-3 h-3" />
                          <span className="text-slate-600 dark:text-slate-400">
                            {activity.salesResponse}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Metrics */}
                    <div className="flex flex-col items-end space-y-2 ml-4">
                      <div className="flex items-center space-x-3">
                        <div className="text-center">
                          <div className="text-lg font-bold text-slate-900 dark:text-slate-100">
                            {activity.conversionProbability}%
                          </div>
                          <div className="text-xs text-slate-600 dark:text-slate-400">
                            Conversion
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                            {activity.touchpointValue}
                          </div>
                          <div className="text-xs text-slate-600 dark:text-slate-400">
                            Value
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className={`text-xs font-medium ${getEngagementColor(activity.engagementLevel)}`}>
                          {activity.engagementLevel.replace('_', ' ')} engagement
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                          {activity.emotionalState}
                        </div>
                      </div>
                      
                      <div className="bg-white dark:bg-slate-700 rounded px-2 py-1 text-xs text-slate-700 dark:text-slate-300 border">
                        Next: {activity.nextBestAction}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Journey Stage Progress */}
      <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Journey Stage Analysis
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {['awareness', 'interest', 'consideration', 'intent', 'evaluation', 'purchase'].map(stage => {
            const stageActivities = journey.filter(a => a.stage === stage)
            const isCurrentStage = stage === currentStage
            
            return (
              <div
                key={stage}
                className={`rounded-lg p-3 border ${
                  isCurrentStage 
                    ? 'bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-600' 
                    : 'bg-slate-50 border-slate-200 dark:bg-slate-750 dark:border-slate-600'
                }`}
              >
                <div className="flex items-center space-x-2 mb-2">
                  {getStageIcon(stage)}
                  <span className={`text-sm font-medium capitalize ${
                    isCurrentStage ? 'text-blue-900 dark:text-blue-100' : 'text-slate-700 dark:text-slate-300'
                  }`}>
                    {stage}
                  </span>
                  {isCurrentStage && (
                    <span className="text-xs bg-blue-500 text-white px-1 rounded">
                      current
                    </span>
                  )}
                </div>
                <div className={`text-lg font-bold ${
                  isCurrentStage ? 'text-blue-600 dark:text-blue-400' : 'text-slate-900 dark:text-slate-100'
                }`}>
                  {stageActivities.length}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  activities
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
