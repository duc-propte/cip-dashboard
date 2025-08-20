"use client"

import { useState } from "react"
import { Clock, MessageCircle, Phone, Mail, Globe, Calendar, Filter, ChevronDown, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Types for the engagement feed
export interface EngagementFeedItem {
  id: string
  timestamp: string
  type: 'interaction' | 'event' | 'milestone' | 'alert'
  channel: 'website' | 'phone' | 'email' | 'crm' | 'system'
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  status?: 'new' | 'acknowledged' | 'resolved'
  metadata?: {
    duration?: number
    pages?: string[]
    contactMethod?: string
    outcome?: string
    value?: number
  }
}

export interface EngagementFeedData {
  items: EngagementFeedItem[]
  unreadCount: number
  lastUpdated: string
  totalItems: number
}

interface EngagementFeedProps {
  data?: EngagementFeedData
}

export default function EngagementFeed({ data }: EngagementFeedProps) {
  const [filter, setFilter] = useState<'all' | 'unread' | 'high-priority'>('all')
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
  
  // Mock data - in a real app, this would come from props or API
  const mockData: EngagementFeedData = data || {
    unreadCount: 5,
    lastUpdated: '2025-08-20T11:45:00Z',
    totalItems: 24,
    items: [
      {
        id: '1',
        timestamp: '2025-08-20T10:30:00Z',
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
        timestamp: '2025-08-20T09:45:00Z',
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
        timestamp: '2025-08-20T08:15:00Z',
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
        timestamp: '2025-08-20T07:20:00Z',
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
        timestamp: '2025-08-19T16:45:00Z',
        type: 'alert',
        channel: 'system',
        title: 'Engagement Drop Alert',
        description: 'No activity for 48 hours - follow-up recommended',
        priority: 'medium',
        status: 'resolved'
      },
      {
        id: '6',
        timestamp: '2025-08-19T14:30:00Z',
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
        return <Phone className="w-3 h-3" />
      case 'email':
        return <Mail className="w-3 h-3" />
      case 'website':
        return <Globe className="w-3 h-3" />
      case 'crm':
        return <MessageCircle className="w-3 h-3" />
      case 'system':
        return <Calendar className="w-3 h-3" />
      default:
        return <MessageCircle className="w-3 h-3" />
    }
  }

  const getChannelColor = (channel: EngagementFeedItem['channel']) => {
    switch (channel) {
      case 'phone':
        return 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20'
      case 'email':
        return 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20'
      case 'website':
        return 'text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-900/20'
      case 'crm':
        return 'text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-900/20'
      case 'system':
        return 'text-slate-600 bg-slate-50 dark:text-slate-400 dark:bg-slate-700/50'
      default:
        return 'text-slate-600 bg-slate-50 dark:text-slate-400 dark:bg-slate-700/50'
    }
  }

  const getPriorityColor = (priority: EngagementFeedItem['priority']) => {
    switch (priority) {
      case 'high':
        return 'border-red-200 dark:border-red-800'
      case 'medium':
        return 'border-yellow-200 dark:border-yellow-800'
      case 'low':
        return 'border-green-200 dark:border-green-800'
      default:
        return 'border-slate-200 dark:border-slate-700'
    }
  }

  const getStatusBadge = (status?: EngagementFeedItem['status']) => {
    switch (status) {
      case 'new':
        return <Badge variant="destructive" className="text-xs">New</Badge>
      case 'acknowledged':
        return <Badge variant="secondary" className="text-xs">Seen</Badge>
      case 'resolved':
        return <Badge variant="outline" className="text-xs">Done</Badge>
      default:
        return null
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    // Use August 20, 2025 as the current date
    const now = new Date('2025-08-20T12:00:00Z')
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) {
      return 'Just now'
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`
    } else if (diffInMinutes < 10080) { // Less than 7 days
      return `${Math.floor(diffInMinutes / 1440)}d ago`
    } else {
      // For older dates, show the actual date
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
  }

  const filteredItems = mockData.items.filter(item => {
    switch (filter) {
      case 'unread':
        return item.status === 'new'
      case 'high-priority':
        return item.priority === 'high'
      default:
        return true
    }
  })

  return (
    <div className="p-4 border-b border-slate-200 dark:border-slate-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
            Engagement Feed
          </h3>
          {mockData.unreadCount > 0 && (
            <Badge variant="destructive" className="text-xs px-1.5 py-0.5">
              {mockData.unreadCount}
            </Badge>
          )}
        </div>
        
        {/* Filter Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
              <Filter className="w-3 h-3 mr-1" />
              {filter === 'all' ? 'All' : filter === 'unread' ? 'Unread' : 'Priority'}
              <ChevronDown className="w-3 h-3 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem onClick={() => setFilter('all')}>
              All Items
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter('unread')}>
              Unread Only
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter('high-priority')}>
              High Priority
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-2 mb-3 text-center">
        <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-2">
          <div className="text-lg font-bold text-slate-900 dark:text-slate-100">
            {mockData.totalItems}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Total Events
          </div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-2">
          <div className="text-lg font-bold text-red-600 dark:text-red-400">
            {mockData.unreadCount}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Unread
          </div>
        </div>
      </div>

      {/* Feed Items */}
      <div className="space-y-2 max-h-[450px] overflow-y-auto scrollbar-hide">
        {filteredItems.length === 0 ? (
          <div className="text-center py-4 text-slate-500 dark:text-slate-400 text-sm">
            No items match your filter
          </div>
        ) : (
          filteredItems.map((item) => {
            const isExpanded = expandedItems.has(item.id)
            return (
              <div 
                key={item.id} 
                className={`p-3 rounded-lg border bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all duration-200 cursor-pointer ${getPriorityColor(item.priority)}`}
                onClick={() => toggleExpanded(item.id)}
              >
                {/* Item Header */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    <div className={`p-1 rounded-full ${getChannelColor(item.channel)}`}>
                      {getChannelIcon(item.channel)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                        {item.title}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatTime(item.timestamp)}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-slate-400 transition-transform" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-400 transition-transform" />
                      )}
                    </div>
                  </div>
                  {getStatusBadge(item.status)}
                </div>

                {/* Item Description */}
                <div className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                  {item.description}
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                      Event Details
                    </div>
                    
                    {/* Event Type and Priority */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-slate-500 dark:text-slate-400">Type:</span>
                        <span className="ml-1 capitalize text-slate-900 dark:text-slate-100">{item.type}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 dark:text-slate-400">Priority:</span>
                        <span className={`ml-1 capitalize font-medium ${item.priority === 'high' ? 'text-red-600 dark:text-red-400' : item.priority === 'medium' ? 'text-yellow-600 dark:text-yellow-400' : 'text-green-600 dark:text-green-400'}`}>
                          {item.priority}
                        </span>
                      </div>
                    </div>

                    {/* Full Timestamp */}
                    <div className="text-xs">
                      <span className="text-slate-500 dark:text-slate-400">Full Time:</span>
                      <span className="ml-1 text-slate-900 dark:text-slate-100">
                        {new Date(item.timestamp).toLocaleString()}
                      </span>
                    </div>

                    {/* Metadata Details */}
                    {item.metadata && (
                      <div className="space-y-1">
                        {item.metadata.duration && (
                          <div className="text-xs">
                            <span className="text-slate-500 dark:text-slate-400">Duration:</span>
                            <span className="ml-1 text-slate-900 dark:text-slate-100">
                              {Math.floor(item.metadata.duration / 60)}m {item.metadata.duration % 60}s
                            </span>
                          </div>
                        )}
                        {item.metadata.contactMethod && (
                          <div className="text-xs">
                            <span className="text-slate-500 dark:text-slate-400">Contact Method:</span>
                            <span className="ml-1 text-slate-900 dark:text-slate-100">{item.metadata.contactMethod}</span>
                          </div>
                        )}
                        {item.metadata.outcome && (
                          <div className="text-xs">
                            <span className="text-slate-500 dark:text-slate-400">Outcome:</span>
                            <span className="ml-1 text-slate-900 dark:text-slate-100">{item.metadata.outcome}</span>
                          </div>
                        )}
                        {item.metadata.value && (
                          <div className="text-xs">
                            <span className="text-slate-500 dark:text-slate-400">Engagement Score:</span>
                            <span className="ml-1 font-medium text-green-600 dark:text-green-400">{item.metadata.value}/100</span>
                          </div>
                        )}
                        {item.metadata.pages && (
                          <div className="text-xs">
                            <span className="text-slate-500 dark:text-slate-400">Pages Visited:</span>
                            <div className="mt-1 space-y-1">
                              {item.metadata.pages.map((page, index) => (
                                <div key={index} className="ml-2 text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-700 rounded px-2 py-1">
                                  • {page}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

      {/* Footer */}
      <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-700">
        <div className="text-xs text-center text-slate-500 dark:text-slate-400">
          Last updated: {formatTime(mockData.lastUpdated)}
        </div>
      </div>
    </div>
  )
}
