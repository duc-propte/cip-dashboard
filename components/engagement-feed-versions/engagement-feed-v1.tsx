"use client"

import { useState } from "react"
import { Clock, MessageCircle, Phone, Mail, Globe, Calendar, User, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EngagementFeedData, EngagementFeedItem } from "@/components/sidebar/engagement-feed"

interface EngagementFeedV1Props {
  data?: EngagementFeedData
}

export default function EngagementFeedV1({ data }: EngagementFeedV1Props) {
  const [selectedItem, setSelectedItem] = useState<string | null>(null)

  // Mock data using same structure as original
  const mockData: EngagementFeedData = data || {
    unreadCount: 5,
    lastUpdated: '2024-12-20T11:45:00Z',
    totalItems: 24,
    items: [
      {
        id: '1',
        timestamp: '2024-12-20T10:30:00Z',
        type: 'interaction',
        channel: 'phone',
        title: 'Inbound Call Received',
        description: 'Customer inquiry about Project Aurora pricing',
        priority: 'high',
        status: 'new',
        metadata: {
          duration: 450,
          contactMethod: 'Direct line',
          outcome: 'Follow-up scheduled'
        }
      },
      {
        id: '2',
        timestamp: '2024-12-20T09:45:00Z',
        type: 'event',
        channel: 'website',
        title: 'Brochure Downloaded',
        description: 'Premium lot specification sheet accessed',
        priority: 'medium',
        status: 'acknowledged',
        metadata: {
          pages: ['Lot 47 Details', 'Pricing Information', 'Floor Plans']
        }
      },
      {
        id: '3',
        timestamp: '2024-12-20T08:15:00Z',
        type: 'milestone',
        channel: 'crm',
        title: 'Engagement Threshold Reached',
        description: 'Customer qualified as hot lead',
        priority: 'high',
        status: 'new',
        metadata: {
          value: 85
        }
      },
      {
        id: '4',
        timestamp: '2024-12-20T07:20:00Z',
        type: 'interaction',
        channel: 'email',
        title: 'Email Campaign Response',
        description: 'Opened holiday promotion email, clicked CTA',
        priority: 'medium',
        status: 'acknowledged',
        metadata: {
          contactMethod: 'Email marketing',
          outcome: 'CTA clicked'
        }
      },
      {
        id: '5',
        timestamp: '2024-12-19T16:45:00Z',
        type: 'alert',
        channel: 'system',
        title: 'Engagement Drop Alert',
        description: 'No activity for 48 hours - follow-up recommended',
        priority: 'medium',
        status: 'resolved'
      },
      {
        id: '6',
        timestamp: '2024-12-19T14:30:00Z',
        type: 'interaction',
        channel: 'website',
        title: 'Virtual Tour Completed',
        description: 'Spent 12 minutes on interactive property tour',
        priority: 'medium',
        status: 'acknowledged',
        metadata: {
          duration: 720,
          pages: ['Virtual Tour', 'Amenities', 'Location Map']
        }
      }
    ]
  }

  const getChannelIcon = (channel: EngagementFeedItem['channel']) => {
    switch (channel) {
      case 'phone':
        return <Phone className="w-4 h-4" />
      case 'email':
        return <Mail className="w-4 h-4" />
      case 'website':
        return <Globe className="w-4 h-4" />
      case 'crm':
        return <MessageCircle className="w-4 h-4" />
      case 'system':
        return <Calendar className="w-4 h-4" />
      default:
        return <MessageCircle className="w-4 h-4" />
    }
  }

  const getChannelColor = (channel: EngagementFeedItem['channel']) => {
    switch (channel) {
      case 'phone':
        return 'text-blue-600 bg-blue-100'
      case 'email':
        return 'text-green-600 bg-green-100'
      case 'website':
        return 'text-purple-600 bg-purple-100'
      case 'crm':
        return 'text-orange-600 bg-orange-100'
      case 'system':
        return 'text-slate-600 bg-slate-100'
      default:
        return 'text-slate-600 bg-slate-100'
    }
  }

  const getTypeIcon = (type: EngagementFeedItem['type']) => {
    switch (type) {
      case 'interaction':
        return '👋'
      case 'event':
        return '📋'
      case 'milestone':
        return '🎯'
      case 'alert':
        return '⚠️'
      default:
        return '📌'
    }
  }

  const getPriorityDot = (priority: EngagementFeedItem['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500'
      case 'medium':
        return 'bg-yellow-500'
      case 'low':
        return 'bg-green-500'
      default:
        return 'bg-slate-500'
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date('2024-12-20T12:00:00Z')
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) {
      return 'Just now'
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`
    }
  }

  const formatFullTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    })
  }

  return (
    <Card className="w-full bg-white dark:bg-white rounded-none shadow-none border-0 border-b border-slate-200 dark:border-slate-200">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-2">
          {mockData.unreadCount > 0 && (
            <Badge variant="destructive" className="text-xs">
              {mockData.unreadCount} New
            </Badge>
          )}
        </div>
        <CardTitle className="text-lg text-slate-900 dark:text-slate-900">
          Engagement Feed
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 dark:bg-slate-50 rounded-lg border border-slate-200 dark:border-slate-200">
          <div className="text-center">
            <div className="text-lg font-bold text-slate-900 dark:text-slate-900">
              {mockData.totalItems}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-600">Total Events</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-red-600 dark:text-red-600">
              {mockData.unreadCount}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-600">Unread</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600 dark:text-blue-600">
              {mockData.items.filter(i => i.priority === 'high').length}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-600">High Priority</div>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Timeline Line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-slate-300"></div>
          
          <div className="space-y-4">
            {mockData.items.map((item) => (
              <div key={item.id} className="relative flex items-start space-x-4">
                {/* Timeline Node */}
                <div className="relative z-10 flex items-center justify-center">
                  <div className={`w-12 h-12 rounded-full border-4 border-white ${getChannelColor(item.channel)} flex items-center justify-center shadow-lg`}>
                    {getChannelIcon(item.channel)}
                  </div>
                  {/* Priority Indicator */}
                  <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full ${getPriorityDot(item.priority)} border-2 border-white`}></div>
                </div>

                {/* Content Card */}
                <div 
                  className={`flex-1 p-4 rounded-lg border transition-all duration-200 cursor-pointer ${
                    selectedItem === item.id 
                      ? 'bg-blue-50 border-blue-200 shadow-md' 
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  } ${item.status === 'new' ? 'ring-2 ring-red-200' : ''}`}
                  onClick={() => setSelectedItem(selectedItem === item.id ? null : item.id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getTypeIcon(item.type)}</span>
                      <div>
                        <div className="text-sm font-semibold text-slate-900 dark:text-slate-900">
                          {item.title}
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-600 flex items-center space-x-2">
                          <Clock className="w-3 h-3" />
                          <span>{formatTime(item.timestamp)}</span>
                          <span>•</span>
                          <span>{formatFullTime(item.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {item.status === 'new' && (
                        <Badge variant="destructive" className="text-xs">New</Badge>
                      )}
                      {item.status === 'acknowledged' && (
                        <Badge variant="secondary" className="text-xs">Seen</Badge>
                      )}
                      {item.status === 'resolved' && (
                        <Badge variant="outline" className="text-xs">Done</Badge>
                      )}
                    </div>
                  </div>

                  <div className="text-sm text-slate-700 dark:text-slate-700 mb-3">
                    {item.description}
                  </div>

                  {/* Expanded Details */}
                  {selectedItem === item.id && (
                    <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-200 space-y-3">
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-slate-500 dark:text-slate-500">Type:</span>
                          <span className="ml-1 font-medium text-slate-900 dark:text-slate-900 capitalize">{item.type}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 dark:text-slate-500">Channel:</span>
                          <span className="ml-1 font-medium text-slate-900 dark:text-slate-900 capitalize">{item.channel}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 dark:text-slate-500">Priority:</span>
                          <span className={`ml-1 font-medium capitalize ${
                            item.priority === 'high' ? 'text-red-600' : 
                            item.priority === 'medium' ? 'text-yellow-600' : 'text-green-600'
                          }`}>
                            {item.priority}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 dark:text-slate-500">Status:</span>
                          <span className="ml-1 font-medium text-slate-900 dark:text-slate-900 capitalize">
                            {item.status || 'Unknown'}
                          </span>
                        </div>
                      </div>

                      {/* Metadata */}
                      {item.metadata && (
                        <div className="p-3 bg-slate-50 dark:bg-slate-50 rounded border border-slate-200 dark:border-slate-200">
                          <div className="text-xs font-medium text-slate-700 dark:text-slate-700 mb-2">
                            Additional Details
                          </div>
                          <div className="space-y-2">
                            {item.metadata.duration && (
                              <div className="flex justify-between text-xs">
                                <span className="text-slate-500 dark:text-slate-500">Duration:</span>
                                <span className="text-slate-900 dark:text-slate-900 font-medium">
                                  {Math.floor(item.metadata.duration / 60)}m {item.metadata.duration % 60}s
                                </span>
                              </div>
                            )}
                            {item.metadata.contactMethod && (
                              <div className="flex justify-between text-xs">
                                <span className="text-slate-500 dark:text-slate-500">Method:</span>
                                <span className="text-slate-900 dark:text-slate-900 font-medium">{item.metadata.contactMethod}</span>
                              </div>
                            )}
                            {item.metadata.outcome && (
                              <div className="flex justify-between text-xs">
                                <span className="text-slate-500 dark:text-slate-500">Outcome:</span>
                                <span className="text-slate-900 dark:text-slate-900 font-medium">{item.metadata.outcome}</span>
                              </div>
                            )}
                            {item.metadata.value && (
                              <div className="flex justify-between text-xs">
                                <span className="text-slate-500 dark:text-slate-500">Score:</span>
                                <span className="text-green-600 dark:text-green-600 font-bold">{item.metadata.value}/100</span>
                              </div>
                            )}
                            {item.metadata.pages && (
                              <div className="text-xs">
                                <span className="text-slate-500 dark:text-slate-500 block mb-1">Pages Visited:</span>
                                <div className="space-y-1">
                                  {item.metadata.pages.map((page, index) => (
                                    <div key={index} className="flex items-center space-x-2 text-slate-900 dark:text-slate-900">
                                      <ArrowRight className="w-3 h-3 text-slate-400" />
                                      <span>{page}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* End of Timeline */}
          <div className="relative flex items-center space-x-4 mt-6">
            <div className="w-12 h-12 rounded-full bg-slate-100 border-4 border-white flex items-center justify-center">
              <User className="w-4 h-4 text-slate-500" />
            </div>
            <div className="text-sm text-slate-500 dark:text-slate-500">
              Timeline started • {mockData.items.length} events total
            </div>
          </div>
        </div>


      </CardContent>
    </Card>
  )
}
