"use client"

import { useState } from "react"
import { Clock, MessageCircle, Phone, Mail, Globe, Calendar, User, ArrowRight, ChevronDown, ChevronRight, MousePointer, Eye, Download } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EngagementFeedData, EngagementFeedItem } from "@/components/sidebar/engagement-feed"

interface EngagementFeedV4Props {
  data?: EngagementFeedData
}

interface SubActivity {
  id: string
  timestamp: string
  action: string
  description: string
  duration?: number
  value?: string
  icon?: React.ReactNode
}

export default function EngagementFeedV4({ data }: EngagementFeedV4Props) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(itemId)) {
        newSet.delete(itemId)
      } else {
        newSet.add(itemId)
      }
      return newSet
    })
  }

  // Mock data with enhanced sub-activities
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

  // Generate sub-activities for each engagement item
  const getSubActivities = (item: EngagementFeedItem): SubActivity[] => {
    const baseTime = new Date(item.timestamp).getTime()
    
    switch (item.id) {
      case '1': // Phone call
        return [
          {
            id: '1-1',
            timestamp: new Date(baseTime).toISOString(),
            action: 'Call Initiated',
            description: 'Incoming call detected from customer',
            icon: <Phone className="w-3 h-3" />
          },
          {
            id: '1-2',
            timestamp: new Date(baseTime + 30000).toISOString(),
            action: 'Call Connected',
            description: 'Sales representative answered call',
            duration: 30,
            icon: <User className="w-3 h-3" />
          },
          {
            id: '1-3',
            timestamp: new Date(baseTime + 120000).toISOString(),
            action: 'Interest Expressed',
            description: 'Customer inquired about Project Aurora pricing',
            icon: <MessageCircle className="w-3 h-3" />
          },
          {
            id: '1-4',
            timestamp: new Date(baseTime + 300000).toISOString(),
            action: 'Information Provided',
            description: 'Shared pricing details and availability',
            icon: <Download className="w-3 h-3" />
          },
          {
            id: '1-5',
            timestamp: new Date(baseTime + 420000).toISOString(),
            action: 'Follow-up Scheduled',
            description: 'Appointment set for property viewing',
            value: 'Dec 21, 2:00 PM',
            icon: <Calendar className="w-3 h-3" />
          },
          {
            id: '1-6',
            timestamp: new Date(baseTime + 450000).toISOString(),
            action: 'Call Ended',
            description: 'Call completed successfully',
            duration: 450,
            icon: <Phone className="w-3 h-3" />
          }
        ]
      
      case '2': // Website brochure download
        return [
          {
            id: '2-1',
            timestamp: new Date(baseTime).toISOString(),
            action: 'Page Visited',
            description: 'Landed on Lot 47 details page',
            icon: <Globe className="w-3 h-3" />
          },
          {
            id: '2-2',
            timestamp: new Date(baseTime + 45000).toISOString(),
            action: 'Content Viewed',
            description: 'Scrolled through pricing information',
            duration: 45,
            icon: <Eye className="w-3 h-3" />
          },
          {
            id: '2-3',
            timestamp: new Date(baseTime + 120000).toISOString(),
            action: 'Floor Plans Accessed',
            description: 'Opened interactive floor plan viewer',
            icon: <MousePointer className="w-3 h-3" />
          },
          {
            id: '2-4',
            timestamp: new Date(baseTime + 180000).toISOString(),
            action: 'Download Initiated',
            description: 'Clicked download premium specification sheet',
            icon: <Download className="w-3 h-3" />
          },
          {
            id: '2-5',
            timestamp: new Date(baseTime + 185000).toISOString(),
            action: 'Form Completed',
            description: 'Provided contact details for download',
            icon: <User className="w-3 h-3" />
          },
          {
            id: '2-6',
            timestamp: new Date(baseTime + 190000).toISOString(),
            action: 'Download Completed',
            description: 'PDF specification sheet downloaded',
            value: 'lot-47-specs.pdf',
            icon: <Download className="w-3 h-3" />
          }
        ]
      
      case '3': // Milestone reached
        return [
          {
            id: '3-1',
            timestamp: new Date(baseTime - 300000).toISOString(),
            action: 'Scoring Updated',
            description: 'Multiple interactions logged',
            value: '65/100',
            icon: <MessageCircle className="w-3 h-3" />
          },
          {
            id: '3-2',
            timestamp: new Date(baseTime - 120000).toISOString(),
            action: 'Behavioral Analysis',
            description: 'High-intent signals detected',
            icon: <Eye className="w-3 h-3" />
          },
          {
            id: '3-3',
            timestamp: new Date(baseTime).toISOString(),
            action: 'Threshold Reached',
            description: 'Engagement score crossed 85 points',
            value: '85/100',
            icon: <ArrowRight className="w-3 h-3" />
          },
          {
            id: '3-4',
            timestamp: new Date(baseTime + 5000).toISOString(),
            action: 'Status Updated',
            description: 'Customer classified as hot lead',
            icon: <User className="w-3 h-3" />
          },
          {
            id: '3-5',
            timestamp: new Date(baseTime + 10000).toISOString(),
            action: 'Alert Triggered',
            description: 'Sales team notified of hot lead',
            icon: <Calendar className="w-3 h-3" />
          }
        ]
      
      case '4': // Email campaign
        return [
          {
            id: '4-1',
            timestamp: new Date(baseTime).toISOString(),
            action: 'Email Delivered',
            description: 'Holiday promotion email sent successfully',
            icon: <Mail className="w-3 h-3" />
          },
          {
            id: '4-2',
            timestamp: new Date(baseTime + 120000).toISOString(),
            action: 'Email Opened',
            description: 'Customer opened the email',
            icon: <Eye className="w-3 h-3" />
          },
          {
            id: '4-3',
            timestamp: new Date(baseTime + 180000).toISOString(),
            action: 'Content Engagement',
            description: 'Spent time reading promotional content',
            duration: 45,
            icon: <MousePointer className="w-3 h-3" />
          },
          {
            id: '4-4',
            timestamp: new Date(baseTime + 240000).toISOString(),
            action: 'CTA Clicked',
            description: 'Clicked "Learn More" call-to-action',
            value: 'holiday-special',
            icon: <MousePointer className="w-3 h-3" />
          }
        ]
      
      default:
        return [
          {
            id: `${item.id}-1`,
            timestamp: item.timestamp,
            action: 'Activity Logged',
            description: 'Engagement activity recorded',
            icon: <MessageCircle className="w-3 h-3" />
          }
        ]
    }
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

  const formatSubTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      second: '2-digit',
      hour12: true 
    })
  }

  return (
    <Card className="w-full bg-white dark:bg-white rounded-none shadow-none border-0 border-b border-slate-200 dark:border-slate-200">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-slate-900 dark:text-slate-100">
          Engagement Feed
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-2">
        {/* Enhanced Timeline */}
        <div className="relative">
          {/* Vertical Timeline Line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-slate-300"></div>
          
          <div className="space-y-2">
            {mockData.items.map((item) => {
              const isExpanded = expandedItems.has(item.id)
              const subActivities = getSubActivities(item)
              
              return (
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
                  <div className="flex-1">
                    <div 
                      className={`p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
                        isExpanded
                          ? 'bg-blue-50 border-blue-200 shadow-md' 
                          : 'bg-white border-slate-200 hover:bg-slate-50'
                      } ${item.status === 'new' ? 'ring-2 ring-red-200' : ''}`}
                      onClick={() => toggleExpanded(item.id)}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{getTypeIcon(item.type)}</span>
                          <div>
                            <div className="text-sm font-semibold text-slate-900 dark:text-slate-900">
                              {item.title}
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
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                      </div>

                      <div className="text-sm text-slate-700 dark:text-slate-700 mb-2">
                        {item.description}
                      </div>

                      <div className="text-xs text-slate-600 dark:text-slate-600 flex items-center space-x-2">
                        <Clock className="w-3 h-3" />
                        <span>{formatTime(item.timestamp)}</span>
                        <span>•</span>
                        <span>{subActivities.length} activities</span>
                      </div>
                    </div>

                    {/* Sub-Timeline */}
                    {isExpanded && (
                      <div className="mt-2 relative">
                        {/* Sub-timeline line */}
                        <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-slate-300"></div>
                        
                        <div className="space-y-2">
                          {subActivities.map((subActivity) => (
                            <div key={subActivity.id} className="relative flex items-start space-x-2">
                              {/* Sub-timeline node */}
                              <div className="relative z-10 w-6 h-6 bg-white border-2 border-slate-300 rounded-full flex items-center justify-center">
                                {subActivity.icon}
                              </div>
                              
                              {/* Sub-activity content */}
                              <div className="flex-1 pb-1">
                                <div className="flex items-center justify-between mb-1">
                                  <div className="text-xs font-medium text-slate-900 dark:text-slate-900">
                                    {subActivity.action}
                                  </div>
                                  <div className="text-xs text-slate-500 dark:text-slate-500">
                                    {formatSubTime(subActivity.timestamp)}
                                  </div>
                                </div>
                                <div className="text-xs text-slate-600 dark:text-slate-600 mb-1">
                                  {subActivity.description}
                                </div>
                                {(subActivity.duration || subActivity.value) && (
                                  <div className="flex items-center space-x-3 text-xs">
                                    {subActivity.duration && (
                                      <span className="text-blue-600 dark:text-blue-600 font-medium">
                                        {subActivity.duration}s duration
                                      </span>
                                    )}
                                    {subActivity.value && (
                                      <span className="text-green-600 dark:text-green-600 font-medium">
                                        {subActivity.value}
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>


        </div>


      </CardContent>
    </Card>
  )
}
