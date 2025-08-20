"use client"

import { useState, useMemo, useCallback } from "react"
import { Calendar, Globe, Phone, Mail, Clock, AlertTriangle, CheckCircle, Timer } from "lucide-react"

export default function ActivityTimelineV3() {
  const [selectedTimeFilter, setSelectedTimeFilter] = useState<'week' | 'month'>('week')

  // Generate mock response time data
  const generateResponseData = useCallback(() => {
    const responses = []
    const now = new Date()
    const daysToShow = selectedTimeFilter === 'week' ? 7 : 21

    for (let day = 0; day < daysToShow; day++) {
      const date = new Date(now)
      date.setDate(now.getDate() - (daysToShow - day - 1))
      
      // Generate 2-8 customer actions per day
      const actionCount = 2 + Math.floor(Math.random() * 7)
      
      for (let a = 0; a < actionCount; a++) {
        const actionTime = new Date(date)
        actionTime.setHours(9 + Math.floor(Math.random() * 10), Math.floor(Math.random() * 60))
        
        const channels = ['website', 'phone', 'email']
        const channel = channels[Math.floor(Math.random() * channels.length)]
        
        // Simulate response time (or lack thereof)
        const hasResponse = Math.random() > 0.2 // 80% get responses
        let responseTime = null
        let responseChannel = null
        let salesAction = null
        
        if (hasResponse) {
          // Response time varies by channel and time of day
          const baseResponseTime = channel === 'phone' ? 30 : channel === 'email' ? 120 : 60
          const variability = Math.random() * 300 // 0-5 hours variation
          responseTime = Math.floor(baseResponseTime + variability)
          
          // Response might be on same or different channel
          const responseChannels = ['website', 'phone', 'email']
          responseChannel = Math.random() > 0.7 ? responseChannels[Math.floor(Math.random() * responseChannels.length)] : channel
          
          salesAction = getSalesAction(responseChannel, responseTime)
        }

        responses.push({
          id: `${day}-${a}`,
          customerAction: {
            timestamp: actionTime,
            channel,
            action: getCustomerAction(channel),
            urgency: getUrgencyLevel(channel),
            intent: getIntentLevel()
          },
          salesResponse: hasResponse ? {
            timestamp: new Date(actionTime.getTime() + responseTime! * 60000),
            channel: responseChannel!,
            action: salesAction!,
            responseTime: responseTime!
          } : null,
          status: getResponseStatus(hasResponse, responseTime),
          businessImpact: getBusinessImpact(hasResponse, responseTime, getIntentLevel())
        })
      }
    }

    return responses.sort((a, b) => 
      new Date(a.customerAction.timestamp).getTime() - new Date(b.customerAction.timestamp).getTime()
    )
  }, [selectedTimeFilter])

  const getCustomerAction = (channel: string) => {
    const actions = {
      website: ['Downloaded brochure', 'Used mortgage calculator', 'Viewed lot details', 'Submitted contact form', 'Browsed pricing', 'Watched virtual tour'],
      phone: ['Called sales office', 'Left voicemail', 'Requested callback', 'Asked about availability'],
      email: ['Replied to newsletter', 'Clicked email link', 'Requested information', 'Asked pricing question']
    }
    
    const channelActions = actions[channel as keyof typeof actions] || actions.website
    return channelActions[Math.floor(Math.random() * channelActions.length)]
  }

  const getSalesAction = (channel: string, responseTime: number) => {
    const urgentActions = {
      website: ['Called immediately', 'Sent priority email', 'Triggered popup'],
      phone: ['Returned call', 'Scheduled appointment', 'Sent follow-up'],
      email: ['Sent personalized response', 'Scheduled call', 'Provided information']
    }
    
    const normalActions = {
      website: ['Added to nurture sequence', 'Sent automated email', 'Updated in CRM'],
      phone: ['Added to callback list', 'Sent information email', 'Scheduled follow-up'],
      email: ['Sent templated response', 'Added to newsletter', 'Forwarded to specialist']
    }
    
    const actionSet = responseTime <= 60 ? urgentActions : normalActions
    const channelActions = actionSet[channel as keyof typeof actionSet] || actionSet.email
    return channelActions[Math.floor(Math.random() * channelActions.length)]
  }

  const getUrgencyLevel = (channel: string) => {
    if (channel === 'phone') return Math.random() > 0.3 ? 'high' : 'medium'
    if (channel === 'email') return Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low'
    return Math.random() > 0.5 ? 'medium' : 'low'
  }

  const getIntentLevel = () => {
    const random = Math.random()
    if (random > 0.8) return 'high'
    if (random > 0.5) return 'medium'
    return 'low'
  }

  const getResponseStatus = (hasResponse: boolean, responseTime: number | null) => {
    if (!hasResponse) return 'no_response'
    if (responseTime! <= 30) return 'excellent'
    if (responseTime! <= 60) return 'good'
    if (responseTime! <= 180) return 'acceptable'
    return 'poor'
  }

  const getBusinessImpact = (hasResponse: boolean, responseTime: number | null, intent: string) => {
    if (!hasResponse && intent === 'high') return 'critical'
    if (!hasResponse && intent === 'medium') return 'high'
    if (responseTime && responseTime > 240 && intent === 'high') return 'high'
    if (responseTime && responseTime > 120) return 'medium'
    return 'low'
  }

  const responses = useMemo(() => generateResponseData(), [generateResponseData])

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
      case 'website': return 'text-blue-600 dark:text-blue-400'
      case 'phone': return 'text-green-600 dark:text-green-400'
      case 'email': return 'text-orange-600 dark:text-orange-400'
      default: return 'text-gray-600 dark:text-gray-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'good': return <CheckCircle className="w-4 h-4 text-blue-500" />
      case 'acceptable': return <Clock className="w-4 h-4 text-yellow-500" />
      case 'poor': return <Timer className="w-4 h-4 text-orange-500" />
      case 'no_response': return <AlertTriangle className="w-4 h-4 text-red-500" />
      default: return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800'
      case 'good': return 'bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800'
      case 'acceptable': return 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950/30 dark:border-yellow-800'
      case 'poor': return 'bg-orange-50 border-orange-200 dark:bg-orange-950/30 dark:border-orange-800'
      case 'no_response': return 'bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800'
      default: return 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700'
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'critical': return 'text-red-600 dark:text-red-400 font-bold'
      case 'high': return 'text-orange-600 dark:text-orange-400 font-medium'
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

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
  }

  // Group by date
  const responsesByDate = responses.reduce((acc, response) => {
    const date = response.customerAction.timestamp.toISOString().split('T')[0]
    if (!acc[date]) acc[date] = []
    acc[date].push(response)
    return acc
  }, {} as Record<string, typeof responses>)

  // Calculate metrics
  const totalResponses = responses.filter(r => r.salesResponse).length
  const avgResponseTime = responses.filter(r => r.salesResponse).reduce((sum, r) => sum + r.salesResponse!.responseTime, 0) / totalResponses || 0
  const criticalIssues = responses.filter(r => r.businessImpact === 'critical').length
  const excellentResponses = responses.filter(r => r.status === 'excellent').length

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Response Time Analysis
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Sales team responsiveness and customer follow-up tracking
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

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-50 dark:bg-slate-750 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {Math.round(avgResponseTime)}m
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400">Avg Response Time</div>
        </div>
        <div className="bg-green-50 dark:bg-green-950/30 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {excellentResponses}
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400">Excellent Responses</div>
        </div>
        <div className="bg-red-50 dark:bg-red-950/30 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            {criticalIssues}
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400">Critical Issues</div>
        </div>
        <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {Math.round((totalResponses / responses.length) * 100)}%
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400">Response Rate</div>
        </div>
      </div>

      {/* Response Timeline */}
      <div className="space-y-6">
        {Object.entries(responsesByDate).map(([date, dateResponses]) => (
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
                {dateResponses.length} interactions
              </span>
            </div>

            {/* Responses for this date */}
            <div className="space-y-2">
              {dateResponses.map((response) => (
                <div
                  key={response.id}
                  className={`border rounded-lg p-4 ${getStatusColor(response.status)}`}
                >
                  <div className="flex items-start justify-between">
                    {/* Customer Action */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className={getChannelColor(response.customerAction.channel)}>
                          {getChannelIcon(response.customerAction.channel)}
                        </div>
                        <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          Customer Action
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {formatTime(response.customerAction.timestamp)}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          response.customerAction.urgency === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                          response.customerAction.urgency === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                          'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                        }`}>
                          {response.customerAction.urgency} urgency
                        </span>
                      </div>
                      <div className="text-sm text-slate-700 dark:text-slate-300 mb-2">
                        {response.customerAction.action}
                      </div>
                      
                      {/* Sales Response */}
                      {response.salesResponse ? (
                        <div className="ml-4 pl-4 border-l-2 border-slate-300 dark:border-slate-600">
                          <div className="flex items-center space-x-2 mb-1">
                            <div className={getChannelColor(response.salesResponse.channel)}>
                              {getChannelIcon(response.salesResponse.channel)}
                            </div>
                            <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                              Sales Response
                            </span>
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              {formatTime(response.salesResponse.timestamp)}
                            </span>
                          </div>
                          <div className="text-sm text-slate-700 dark:text-slate-300">
                            {response.salesResponse.action}
                          </div>
                        </div>
                      ) : (
                        <div className="ml-4 pl-4 border-l-2 border-red-300 dark:border-red-600">
                          <span className="text-sm text-red-600 dark:text-red-400 font-medium">
                            No response yet
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Status and Metrics */}
                    <div className="flex flex-col items-end space-y-2 ml-4">
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(response.status)}
                        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                          {response.status.replace('_', ' ')}
                        </span>
                      </div>
                      
                      {response.salesResponse && (
                        <div className="text-xs text-slate-600 dark:text-slate-400">
                          {formatDuration(response.salesResponse.responseTime)} response
                        </div>
                      )}
                      
                      <div className={`text-xs ${getImpactColor(response.businessImpact)}`}>
                        {response.businessImpact} impact
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Performance Summary */}
      <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Performance Breakdown
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Response Time Distribution */}
          <div>
            <h4 className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-3">
              Response Time Distribution
            </h4>
            <div className="space-y-2">
              {[
                { status: 'excellent', label: 'Excellent (≤30m)', count: responses.filter(r => r.status === 'excellent').length },
                { status: 'good', label: 'Good (≤1h)', count: responses.filter(r => r.status === 'good').length },
                { status: 'acceptable', label: 'Acceptable (≤3h)', count: responses.filter(r => r.status === 'acceptable').length },
                { status: 'poor', label: 'Poor (>3h)', count: responses.filter(r => r.status === 'poor').length },
                { status: 'no_response', label: 'No Response', count: responses.filter(r => r.status === 'no_response').length }
              ].map(item => (
                <div key={item.status} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(item.status)}
                    <span className="text-xs text-slate-700 dark:text-slate-300">{item.label}</span>
                  </div>
                  <span className="text-xs font-medium text-slate-900 dark:text-slate-100">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Business Impact */}
          <div>
            <h4 className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-3">
              Business Impact
            </h4>
            <div className="space-y-2">
              {[
                { impact: 'critical', label: 'Critical', count: responses.filter(r => r.businessImpact === 'critical').length },
                { impact: 'high', label: 'High', count: responses.filter(r => r.businessImpact === 'high').length },
                { impact: 'medium', label: 'Medium', count: responses.filter(r => r.businessImpact === 'medium').length },
                { impact: 'low', label: 'Low', count: responses.filter(r => r.businessImpact === 'low').length }
              ].map(item => (
                <div key={item.impact} className="flex items-center justify-between">
                  <span className={`text-xs ${getImpactColor(item.impact)}`}>{item.label}</span>
                  <span className="text-xs font-medium text-slate-900 dark:text-slate-100">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
