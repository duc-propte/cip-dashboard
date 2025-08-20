"use client"

import { MessageCircle, Phone, Mail, Globe, Calendar, ArrowRight, Star, CheckCircle, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EngagementFeedData, EngagementFeedItem } from "@/components/sidebar/engagement-feed"

interface EngagementFeedV3Props {
  data?: EngagementFeedData
}

export default function EngagementFeedV3({ data }: EngagementFeedV3Props) {
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
        priority: 'low',
        status: 'acknowledged',
        metadata: {
          duration: 720,
          pages: ['Virtual Tour', 'Amenities', 'Location Map']
        }
      },
      {
        id: '7',
        timestamp: '2024-12-19T13:15:00Z',
        type: 'interaction',
        channel: 'phone',
        title: 'Outbound Call Completed',
        description: 'Follow-up call regarding pricing inquiry',
        priority: 'high',
        status: 'resolved',
        metadata: {
          duration: 320,
          outcome: 'Appointment scheduled'
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

  // Group items by status
  const groupedItems = {
    new: mockData.items.filter(item => item.status === 'new'),
    acknowledged: mockData.items.filter(item => item.status === 'acknowledged'),
    resolved: mockData.items.filter(item => item.status === 'resolved')
  }

  const getColumnConfig = (status: string) => {
    switch (status) {
      case 'new':
        return {
          title: 'New Items',
          icon: <AlertCircle className="w-5 h-5 text-red-500" />,
          bg: 'bg-red-50',
          border: 'border-red-200',
          headerBg: 'bg-red-100',
          count: groupedItems.new.length,
          description: 'Requires immediate attention'
        }
      case 'acknowledged':
        return {
          title: 'In Progress',
          icon: <Star className="w-5 h-5 text-yellow-500" />,
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          headerBg: 'bg-yellow-100',
          count: groupedItems.acknowledged.length,
          description: 'Being processed'
        }
      case 'resolved':
        return {
          title: 'Completed',
          icon: <CheckCircle className="w-5 h-5 text-green-500" />,
          bg: 'bg-green-50',
          border: 'border-green-200',
          headerBg: 'bg-green-100',
          count: groupedItems.resolved.length,
          description: 'Actions completed'
        }
      default:
        return {
          title: 'Unknown',
          icon: <AlertCircle className="w-5 h-5 text-slate-500" />,
          bg: 'bg-slate-50',
          border: 'border-slate-200',
          headerBg: 'bg-slate-100',
          count: 0,
          description: 'Status unknown'
        }
    }
  }

  const getSalesWorkflow = (status: string) => {
    switch (status) {
      case 'new':
        return {
          nextAction: 'Review & Respond',
          urgency: 'Immediate',
          color: 'text-red-600',
          tips: ['Call within 15 minutes for phone inquiries', 'Qualify lead urgency', 'Update CRM status']
        }
      case 'acknowledged':
        return {
          nextAction: 'Follow Through',
          urgency: 'Today',
          color: 'text-yellow-600',
          tips: ['Complete promised actions', 'Schedule next touchpoint', 'Update customer on progress']
        }
      case 'resolved':
        return {
          nextAction: 'Monitor & Nurture',
          urgency: 'Ongoing',
          color: 'text-green-600',
          tips: ['Monitor for new activity', 'Add to nurture sequence', 'Schedule future follow-ups']
        }
      default:
        return {
          nextAction: 'Review Status',
          urgency: 'ASAP',
          color: 'text-slate-600',
          tips: ['Determine current status', 'Update tracking', 'Assign appropriate action']
        }
    }
  }

  return (
    <Card className="w-full bg-white dark:bg-white">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-2">
          <Badge variant="outline" className="text-xs">
            Version 3 - Workflow Kanban
          </Badge>
          {mockData.unreadCount > 0 && (
            <Badge variant="destructive" className="text-xs">
              {mockData.unreadCount} New
            </Badge>
          )}
        </div>
        <CardTitle className="text-lg text-slate-900 dark:text-slate-900">
          Engagement Workflow Board
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-3 p-3 bg-slate-50 dark:bg-slate-50 rounded-lg border border-slate-200 dark:border-slate-200">
          <div className="text-center">
            <div className="text-lg font-bold text-slate-900 dark:text-slate-900">
              {mockData.totalItems}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-600">Total Events</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-red-600 dark:text-red-600">
              {groupedItems.new.length}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-600">New</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-yellow-600 dark:text-yellow-600">
              {groupedItems.acknowledged.length}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-600">In Progress</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-600 dark:text-green-600">
              {groupedItems.resolved.length}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-600">Completed</div>
          </div>
        </div>

        {/* Kanban Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['new', 'acknowledged', 'resolved'].map((status) => {
            const config = getColumnConfig(status)
            const workflow = getSalesWorkflow(status)
            const items = groupedItems[status as keyof typeof groupedItems]
            
            return (
              <div key={status} className={`${config.bg} ${config.border} border rounded-lg`}>
                {/* Column Header */}
                <div className={`${config.headerBg} p-3 rounded-t-lg border-b ${config.border}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {config.icon}
                      <span className="font-semibold text-slate-900 dark:text-slate-900">
                        {config.title}
                      </span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {config.count}
                    </Badge>
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-600 mb-2">
                    {config.description}
                  </div>
                  
                  {/* Workflow Info */}
                  <div className="text-xs">
                    <div className={`font-medium ${workflow.color}`}>
                      Next: {workflow.nextAction} • {workflow.urgency}
                    </div>
                  </div>
                </div>

                {/* Column Content */}
                <div className="p-3 space-y-3">
                  {items.length === 0 ? (
                    <div className="text-center py-6 text-slate-500 dark:text-slate-500">
                      <div className="text-2xl mb-1">✨</div>
                      <div className="text-xs">No items</div>
                    </div>
                  ) : (
                    items.map((item) => (
                      <div 
                        key={item.id} 
                        className="bg-white dark:bg-white p-3 rounded-lg border border-slate-200 dark:border-slate-200 hover:shadow-md transition-all duration-200"
                      >
                        {/* Item Header */}
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <div className={`p-1 rounded ${getChannelColor(item.channel)}`}>
                              {getChannelIcon(item.channel)}
                            </div>
                            <div className={`w-2 h-2 rounded-full ${getPriorityDot(item.priority)}`}></div>
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-500">
                            {formatTime(item.timestamp)}
                          </div>
                        </div>

                        {/* Item Content */}
                        <div className="mb-2">
                          <div className="text-sm font-medium text-slate-900 dark:text-slate-900 mb-1">
                            {item.title}
                          </div>
                          <div className="text-xs text-slate-600 dark:text-slate-600">
                            {item.description}
                          </div>
                        </div>

                        {/* Item Footer */}
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-1">
                            <span className="capitalize text-slate-500 dark:text-slate-500">
                              {item.type}
                            </span>
                            <span className="text-slate-400 dark:text-slate-400">•</span>
                            <span className={`capitalize font-medium ${
                              item.priority === 'high' ? 'text-red-600' : 
                              item.priority === 'medium' ? 'text-yellow-600' : 'text-green-600'
                            }`}>
                              {item.priority}
                            </span>
                          </div>
                          
                          {item.metadata?.value && (
                            <div className="text-green-600 dark:text-green-600 font-bold">
                              {item.metadata.value}/100
                            </div>
                          )}
                        </div>

                        {/* Quick Action Hint */}
                        {status === 'new' && (
                          <div className="mt-2 p-2 bg-red-50 dark:bg-red-50 rounded border border-red-200 dark:border-red-200">
                            <div className="text-xs text-red-700 dark:text-red-700 font-medium">
                              ⚡ {item.channel === 'phone' ? 'Call back now' : 'Respond within 1 hour'}
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>


              </div>
            )
          })}
        </div>

        {/* Workflow Flow Indicator */}
        <div className="flex items-center justify-center space-x-4 p-3 bg-gradient-to-r from-red-50 via-yellow-50 to-green-50 dark:from-red-50 dark:via-yellow-50 dark:to-green-50 rounded-lg border border-slate-200 dark:border-slate-200">
          <div className="flex items-center space-x-2 text-sm text-slate-700 dark:text-slate-700">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>New</span>
            <ArrowRight className="w-4 h-4 text-slate-400" />
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>In Progress</span>
            <ArrowRight className="w-4 h-4 text-slate-400" />
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Completed</span>
          </div>
        </div>

        {/* Sales Consultant Guide */}
        <div className="mt-6 p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-50 dark:to-pink-50 rounded-lg border border-purple-200 dark:border-purple-200">
          <div className="text-sm font-semibold text-purple-900 dark:text-purple-900 mb-2">
            🔄 Workflow Benefits for Sales Consultants
          </div>
          <div className="text-xs text-purple-800 dark:text-purple-800 space-y-1">
            <p>• <strong>Clear Workflow:</strong> Visual representation of engagement lifecycle</p>
            <p>• <strong>Status Tracking:</strong> Never lose track of where each interaction stands</p>
            <p>• <strong>Action Prioritization:</strong> Focus on &apos;New&apos; column for immediate actions</p>
            <p>• <strong>Process Efficiency:</strong> Move items through the workflow systematically</p>
            <p>• <strong>Team Collaboration:</strong> Easy to see what colleagues are working on</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
