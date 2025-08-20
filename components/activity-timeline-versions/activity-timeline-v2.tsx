"use client"

import { useState, useMemo, useCallback } from "react"
import { Calendar, Globe, Phone, Mail, ArrowRight, User, Headphones } from "lucide-react"

export default function ActivityTimelineV2() {
  const [selectedTimeFilter, setSelectedTimeFilter] = useState<'week' | 'month'>('week')

  // Generate mock engagement flows
  const generateEngagementFlows = useCallback(() => {
    const flows = []
    const now = new Date()
    const daysToShow = selectedTimeFilter === 'week' ? 7 : 14

    for (let day = 0; day < daysToShow; day++) {
      const date = new Date(now)
      date.setDate(now.getDate() - (daysToShow - day - 1))
      
      // Skip some days
      if (Math.random() > 0.8) continue

      // Generate 1-2 flows per day
      const flowCount = Math.floor(Math.random() * 2) + 1
      
      for (let f = 0; f < flowCount; f++) {
        const startHour = 9 + Math.floor(Math.random() * 8) // 9 AM to 5 PM
        
        // Create a flow with 3-6 touchpoints
        const touchpoints = []
        const touchpointCount = 3 + Math.floor(Math.random() * 4)
        
        let currentTime = new Date(date)
        currentTime.setHours(startHour, Math.floor(Math.random() * 60))
        
        for (let t = 0; t < touchpointCount; t++) {
          const channels = ['website', 'phone', 'email']
          const channel = t === 0 ? 'website' : channels[Math.floor(Math.random() * channels.length)]
          const isCustomerAction = t % 2 === 0 // Alternate between customer and sales actions
          
          touchpoints.push({
            id: `${day}-${f}-${t}`,
            timestamp: new Date(currentTime),
            channel,
            actor: isCustomerAction ? 'customer' : 'sales',
            action: getFlowAction(channel, isCustomerAction),
            outcome: Math.random() > 0.7 ? 'positive' : Math.random() > 0.4 ? 'neutral' : 'negative',
            duration: Math.floor(Math.random() * 30) + 5, // 5-35 minutes
            intensity: Math.floor(Math.random() * 10) + 1
          })
          
          // Add time gap between touchpoints (15 min to 4 hours)
          const gap = 15 + Math.floor(Math.random() * 225)
          currentTime = new Date(currentTime.getTime() + gap * 60000)
        }

        flows.push({
          id: `flow-${day}-${f}`,
          date: date.toISOString().split('T')[0],
          startTime: touchpoints[0].timestamp,
          endTime: touchpoints[touchpoints.length - 1].timestamp,
          touchpoints,
          totalDuration: Math.floor((touchpoints[touchpoints.length - 1].timestamp.getTime() - touchpoints[0].timestamp.getTime()) / 60000),
          customerInitiated: touchpoints[0].actor === 'customer',
          conversionLevel: getConversionLevel(touchpoints),
          engagementScore: calculateEngagementScore(touchpoints)
        })
      }
    }

    return flows.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
  }, [selectedTimeFilter])

  const getFlowAction = (channel: string, isCustomer: boolean) => {
    const actions = {
      website: {
        customer: ['Browsed lot listings', 'Downloaded brochure', 'Used mortgage calculator', 'Viewed virtual tour', 'Checked pricing', 'Read testimonials'],
        sales: ['Sent personalized email', 'Updated lot availability', 'Added to nurture sequence', 'Triggered popup offer']
      },
      phone: {
        customer: ['Called sales office', 'Scheduled appointment', 'Asked about pricing', 'Requested site visit'],
        sales: ['Made follow-up call', 'Conducted consultation', 'Scheduled site visit', 'Provided market update']
      },
      email: {
        customer: ['Opened newsletter', 'Clicked email link', 'Replied with questions', 'Downloaded attachment'],
        sales: ['Sent welcome series', 'Shared lot recommendations', 'Followed up on inquiry', 'Sent market report']
      }
    }
    
    const channelActions = actions[channel as keyof typeof actions]
    const actorActions = channelActions[isCustomer ? 'customer' : 'sales']
    return actorActions[Math.floor(Math.random() * actorActions.length)]
  }

  const getConversionLevel = (touchpoints: Array<{action: string}>) => {
    const highValueActions = touchpoints.filter(tp => 
      tp.action.includes('appointment') || 
      tp.action.includes('visit') || 
      tp.action.includes('consultation') ||
      tp.action.includes('pricing')
    ).length
    
    if (highValueActions >= 2) return 'high'
    if (highValueActions >= 1) return 'medium'
    return 'low'
  }

  const calculateEngagementScore = (touchpoints: Array<{outcome: string, actor: string}>) => {
    const baseScore = touchpoints.length * 10
    const positiveBonus = touchpoints.filter(tp => tp.outcome === 'positive').length * 5
    const customerBonus = touchpoints.filter(tp => tp.actor === 'customer').length * 3
    return Math.min(100, baseScore + positiveBonus + customerBonus)
  }

  const flows = useMemo(() => generateEngagementFlows(), [generateEngagementFlows])

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'website': return <Globe className="w-4 h-4" />
      case 'phone': return <Phone className="w-4 h-4" />
      case 'email': return <Mail className="w-4 h-4" />
      default: return <Globe className="w-4 h-4" />
    }
  }

  const getChannelColor = (channel: string) => {
    switch (channel) {
      case 'website': return 'bg-blue-500 border-blue-500'
      case 'phone': return 'bg-green-500 border-green-500'
      case 'email': return 'bg-orange-500 border-orange-500'
      default: return 'bg-gray-500 border-gray-500'
    }
  }

  const getActorIcon = (actor: string) => {
    return actor === 'customer' ? <User className="w-3 h-3" /> : <Headphones className="w-3 h-3" />
  }

  const getConversionColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-green-600 dark:text-green-400'
      case 'medium': return 'text-yellow-600 dark:text-yellow-400'
      default: return 'text-red-600 dark:text-red-400'
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: true 
    })
  }

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
  }

  // Group flows by date
  const flowsByDate = flows.reduce((acc, flow) => {
    const date = flow.date
    if (!acc[date]) acc[date] = []
    acc[date].push(flow)
    return acc
  }, {} as Record<string, typeof flows>)

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Engagement Flow
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Customer journey touchpoints and interaction patterns
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

      {/* Flow Timeline */}
      <div className="space-y-8">
        {Object.entries(flowsByDate).map(([date, dateFlows]) => (
          <div key={date} className="space-y-4">
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
                {dateFlows.length} flow{dateFlows.length !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Flows for this date */}
            <div className="space-y-6">
              {dateFlows.map((flow) => (
                <div
                  key={flow.id}
                  className="bg-slate-50 dark:bg-slate-750 rounded-lg p-4 border border-slate-200 dark:border-slate-700"
                >
                  {/* Flow Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        flow.customerInitiated ? 'bg-purple-500' : 'bg-blue-500'
                      }`}></div>
                      <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        {formatTime(flow.startTime)} - {formatTime(flow.endTime)}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        ({formatDuration(flow.totalDuration)})
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <div className="text-xs text-slate-500 dark:text-slate-400">Engagement Score</div>
                        <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                          {flow.engagementScore}/100
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs font-medium ${getConversionColor(flow.conversionLevel)}`}>
                        {flow.conversionLevel} intent
                      </div>
                    </div>
                  </div>

                  {/* Flow Diagram */}
                  <div className="relative">
                    <div className="flex items-center space-x-2 overflow-x-auto pb-2">
                      {flow.touchpoints.map((touchpoint, index) => (
                        <div key={touchpoint.id} className="flex items-center space-x-2 flex-shrink-0">
                          {/* Touchpoint Node */}
                          <div className="flex flex-col items-center space-y-1">
                            <div
                              className={`w-12 h-12 rounded-full border-2 flex items-center justify-center ${getChannelColor(touchpoint.channel)} ${
                                touchpoint.actor === 'customer' 
                                  ? 'border-dashed border-4' 
                                  : 'border-solid'
                              }`}
                            >
                              <div className="text-white">
                                {getChannelIcon(touchpoint.channel)}
                              </div>
                            </div>
                            <div className="flex items-center space-x-1">
                              <div className="text-slate-600 dark:text-slate-400">
                                {getActorIcon(touchpoint.actor)}
                              </div>
                              <span className="text-xs text-slate-600 dark:text-slate-400">
                                {touchpoint.actor}
                              </span>
                            </div>
                          </div>

                          {/* Arrow connector */}
                          {index < flow.touchpoints.length - 1 && (
                            <div className="flex items-center space-x-1">
                              <ArrowRight className="w-4 h-4 text-slate-400" />
                              <span className="text-xs text-slate-500 dark:text-slate-400">
                                {Math.floor((flow.touchpoints[index + 1].timestamp.getTime() - touchpoint.timestamp.getTime()) / 60000)}m
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Touchpoint Details */}
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {flow.touchpoints.map((touchpoint, index) => (
                      <div
                        key={touchpoint.id}
                        className={`p-3 rounded border ${
                          touchpoint.outcome === 'positive' ? 'bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800' :
                          touchpoint.outcome === 'negative' ? 'bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800' :
                          'bg-yellow-50 border-yellow-200 dark:bg-yellow-950/30 dark:border-yellow-800'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                            Step {index + 1}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {formatTime(touchpoint.timestamp)}
                          </span>
                        </div>
                        <div className="text-sm text-slate-900 dark:text-slate-100 mb-1">
                          {touchpoint.action}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className={`text-xs px-1 rounded ${
                            touchpoint.actor === 'customer' 
                              ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                              : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                          }`}>
                            {touchpoint.actor}
                          </span>
                          <span className="text-xs text-slate-600 dark:text-slate-400">
                            {touchpoint.duration}m
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Summary Analytics */}
      <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {flows.length}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400">Total Flows</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {flows.filter(f => f.customerInitiated).length}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400">Customer Initiated</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {flows.filter(f => f.conversionLevel === 'high').length}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400">High Intent</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {Math.round(flows.reduce((sum, f) => sum + f.touchpoints.length, 0) / flows.length)}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400">Avg Touchpoints</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {Math.round(flows.reduce((sum, f) => sum + f.engagementScore, 0) / flows.length)}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400">Avg Score</div>
          </div>
        </div>
      </div>
    </div>
  )
}
