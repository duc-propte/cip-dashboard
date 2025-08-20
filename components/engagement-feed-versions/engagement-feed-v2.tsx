"use client"

import { useState } from "react"
import { Clock, MessageCircle, Phone, Mail, Globe, Calendar, SortDesc, Filter, AlertTriangle, Zap, Info } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { EngagementFeedData, EngagementFeedItem } from "@/components/sidebar/engagement-feed"

interface EngagementFeedV2Props {
  data?: EngagementFeedData
}

export default function EngagementFeedV2({ data }: EngagementFeedV2Props) {
  const [sortBy, setSortBy] = useState<'priority' | 'time' | 'channel'>('priority')
  const [filterBy, setFilterBy] = useState<'all' | 'high' | 'unread'>('all')

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
      }
    ]
  }

  const getChannelIcon = (channel: EngagementFeedItem['channel']) => {
    switch (channel) {
      case 'phone':
        return <Phone className="w-5 h-5" />
      case 'email':
        return <Mail className="w-5 h-5" />
      case 'website':
        return <Globe className="w-5 h-5" />
      case 'crm':
        return <MessageCircle className="w-5 h-5" />
      case 'system':
        return <Calendar className="w-5 h-5" />
      default:
        return <MessageCircle className="w-5 h-5" />
    }
  }

  const getChannelColor = (channel: EngagementFeedItem['channel']) => {
    switch (channel) {
      case 'phone':
        return 'text-blue-600 bg-blue-100 border-blue-200'
      case 'email':
        return 'text-green-600 bg-green-100 border-green-200'
      case 'website':
        return 'text-purple-600 bg-purple-100 border-purple-200'
      case 'crm':
        return 'text-orange-600 bg-orange-100 border-orange-200'
      case 'system':
        return 'text-slate-600 bg-slate-100 border-slate-200'
      default:
        return 'text-slate-600 bg-slate-100 border-slate-200'
    }
  }

  const getPriorityStyle = (priority: EngagementFeedItem['priority']) => {
    switch (priority) {
      case 'high':
        return {
          border: 'border-l-4 border-l-red-500',
          bg: 'bg-red-50',
          icon: <AlertTriangle className="w-4 h-4 text-red-500" />,
          badge: 'bg-red-500 text-white',
          text: 'text-red-700'
        }
      case 'medium':
        return {
          border: 'border-l-4 border-l-yellow-500',
          bg: 'bg-yellow-50',
          icon: <Zap className="w-4 h-4 text-yellow-500" />,
          badge: 'bg-yellow-500 text-white',
          text: 'text-yellow-700'
        }
      case 'low':
        return {
          border: 'border-l-4 border-l-green-500',
          bg: 'bg-green-50',
          icon: <Info className="w-4 h-4 text-green-500" />,
          badge: 'bg-green-500 text-white',
          text: 'text-green-700'
        }
      default:
        return {
          border: 'border-l-4 border-l-slate-500',
          bg: 'bg-slate-50',
          icon: <Info className="w-4 h-4 text-slate-500" />,
          badge: 'bg-slate-500 text-white',
          text: 'text-slate-700'
        }
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

  const getSalesActionRecommendation = (item: EngagementFeedItem) => {
    if (item.priority === 'high' && item.status === 'new') {
      if (item.channel === 'phone') {
        return { action: 'Call back immediately', urgency: 'Within 15 minutes', color: 'text-red-600' }
      } else if (item.type === 'milestone') {
        return { action: 'Schedule consultation', urgency: 'Today', color: 'text-red-600' }
      }
    } else if (item.priority === 'medium') {
      return { action: 'Follow up via email', urgency: 'Within 24 hours', color: 'text-yellow-600' }
    }
    return { action: 'Monitor for changes', urgency: 'Check weekly', color: 'text-green-600' }
  }

  // Sorting logic
  const getSortedItems = () => {
    let items = [...mockData.items]
    
    // Filter first
    if (filterBy === 'high') {
      items = items.filter(item => item.priority === 'high')
    } else if (filterBy === 'unread') {
      items = items.filter(item => item.status === 'new')
    }
    
    // Then sort
    switch (sortBy) {
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        items.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority])
        break
      case 'time':
        items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        break
      case 'channel':
        items.sort((a, b) => a.channel.localeCompare(b.channel))
        break
    }
    
    return items
  }

  const sortedItems = getSortedItems()

  return (
    <Card className="w-full bg-white dark:bg-white">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-2">
          <Badge variant="outline" className="text-xs">
            Version 2 - Priority Cards
          </Badge>
          {mockData.unreadCount > 0 && (
            <Badge variant="destructive" className="text-xs">
              {mockData.unreadCount} New
            </Badge>
          )}
        </div>
        <CardTitle className="text-lg text-slate-900 dark:text-slate-900">
          Engagement Feed - Priority View
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Controls */}
        <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-50 rounded-lg border border-slate-200 dark:border-slate-200">
          <div className="grid grid-cols-3 gap-3 text-center text-sm">
            <div>
              <div className="text-lg font-bold text-slate-900 dark:text-slate-900">{mockData.totalItems}</div>
              <div className="text-xs text-slate-600 dark:text-slate-600">Total</div>
            </div>
            <div>
              <div className="text-lg font-bold text-red-600 dark:text-red-600">
                {mockData.items.filter(i => i.priority === 'high').length}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-600">High Priority</div>
            </div>
            <div>
              <div className="text-lg font-bold text-orange-600 dark:text-orange-600">
                {mockData.items.filter(i => i.status === 'new').length}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-600">Unread</div>
            </div>
          </div>

          <div className="flex space-x-2">
            {/* Sort Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="text-xs">
                  <SortDesc className="w-3 h-3 mr-1" />
                  {sortBy === 'priority' ? 'Priority' : sortBy === 'time' ? 'Time' : 'Channel'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSortBy('priority')}>
                  Sort by Priority
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('time')}>
                  Sort by Time
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('channel')}>
                  Sort by Channel
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Filter Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="text-xs">
                  <Filter className="w-3 h-3 mr-1" />
                  {filterBy === 'all' ? 'All' : filterBy === 'high' ? 'High' : 'Unread'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setFilterBy('all')}>
                  Show All
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterBy('high')}>
                  High Priority Only
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterBy('unread')}>
                  Unread Only
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedItems.map((item) => {
            const priorityStyle = getPriorityStyle(item.priority)
            const channelStyle = getChannelColor(item.channel)
            const actionRec = getSalesActionRecommendation(item)
            
            return (
              <div 
                key={item.id} 
                className={`${priorityStyle.border} ${priorityStyle.bg} rounded-lg p-4 hover:shadow-md transition-all duration-200`}
              >
                {/* Card Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg border ${channelStyle}`}>
                      {getChannelIcon(item.channel)}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-slate-900 dark:text-slate-900">
                        {item.title}
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-600 flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatTime(item.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className={`px-2 py-1 rounded-full text-xs font-bold ${priorityStyle.badge}`}>
                      {item.priority.toUpperCase()}
                    </div>
                    {priorityStyle.icon}
                  </div>
                </div>

                {/* Description */}
                <div className="text-sm text-slate-700 dark:text-slate-700 mb-3">
                  {item.description}
                </div>

                {/* Metadata Summary */}
                {item.metadata && (
                  <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                    {item.metadata.duration && (
                      <div className="text-slate-600 dark:text-slate-600">
                        Duration: <span className="font-medium text-slate-900 dark:text-slate-900">
                          {Math.floor(item.metadata.duration / 60)}m {item.metadata.duration % 60}s
                        </span>
                      </div>
                    )}
                    {item.metadata.value && (
                      <div className="text-slate-600 dark:text-slate-600">
                        Score: <span className="font-bold text-green-600 dark:text-green-600">
                          {item.metadata.value}/100
                        </span>
                      </div>
                    )}
                    {item.metadata.outcome && (
                      <div className="text-slate-600 dark:text-slate-600 col-span-2">
                        Outcome: <span className="font-medium text-slate-900 dark:text-slate-900">
                          {item.metadata.outcome}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Status and Action */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-200">
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
                    <span className="text-xs text-slate-500 dark:text-slate-500 capitalize">
                      {item.type} • {item.channel}
                    </span>
                  </div>
                </div>

                {/* Sales Action Recommendation */}
                <div className={`mt-3 p-2 bg-white dark:bg-white rounded border border-slate-200 dark:border-slate-200`}>
                  <div className="text-xs font-semibold text-slate-900 dark:text-slate-900 mb-1">
                    💡 Recommended Action
                  </div>
                  <div className={`text-xs ${actionRec.color}`}>
                    <strong>{actionRec.action}</strong> • {actionRec.urgency}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* No Results */}
        {sortedItems.length === 0 && (
          <div className="text-center py-8 text-slate-500 dark:text-slate-500">
            <div className="text-4xl mb-2">📭</div>
            <div className="text-sm font-medium">No items match your filters</div>
            <div className="text-xs">Try adjusting your filter or sort settings</div>
          </div>
        )}

        {/* Sales Consultant Guide */}
        <div className="mt-6 p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-50 dark:to-pink-50 rounded-lg border border-purple-200 dark:border-purple-200">
          <div className="text-sm font-semibold text-purple-900 dark:text-purple-900 mb-2">
            🎯 Priority Cards Benefits for Sales Consultants
          </div>
          <div className="text-xs text-purple-800 dark:text-purple-800 space-y-1">
            <p>• <strong>Priority Sorting:</strong> Focus on high-impact activities first</p>
            <p>• <strong>Visual Hierarchy:</strong> Color-coded priority levels for quick scanning</p>
            <p>• <strong>Action Guidance:</strong> Built-in recommendations for each engagement</p>
            <p>• <strong>Flexible Filtering:</strong> Show only what needs immediate attention</p>
            <p>• <strong>Dense Information:</strong> Card format shows more details at a glance</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
