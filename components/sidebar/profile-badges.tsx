"use client"

import { useState } from "react"
import { 
  Trophy, 
  Star, 
  Target, 
  Zap, 
  Crown, 
  Award, 
  Clock, 
  CheckCircle, 
  Circle, 
  XCircle, 
  ChevronRight, 
  ChevronDown,
  Calendar,
  TrendingUp,
  Users,
  Heart,
  Shield,
  Flame,
  Gift
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ProfileBadgesData, ProfileBadge, BadgeTimelineEvent } from "@/types"

interface ProfileBadgesProps {
  data?: ProfileBadgesData
}

export default function ProfileBadges({ data }: ProfileBadgesProps) {
  const [expandedBadges, setExpandedBadges] = useState<Set<string>>(new Set())

  const toggleExpanded = (badgeId: string) => {
    setExpandedBadges(prev => {
      const newSet = new Set(prev)
      if (newSet.has(badgeId)) {
        newSet.delete(badgeId)
      } else {
        newSet.add(badgeId)
      }
      return newSet
    })
  }

  // Mock data - in a real app, this would come from props or API
  const mockData: ProfileBadgesData = data || {
    totalBadges: 12,
    earnedBadges: 8,
    totalPoints: 2450,
    currentRank: "Gold Tier",
    nextRank: {
      name: "Platinum Tier",
      pointsRequired: 3000,
      pointsToGo: 550
    },
    lastUpdated: '2025-08-20T11:30:00Z',
    badges: [
      {
        id: '1',
        name: 'Engagement Champion',
        description: 'Maintained high engagement for 30 consecutive days',
        icon: 'trophy',
        color: '#FFD700',
        category: 'engagement',
        status: 'earned',
        earnedDate: '2025-08-15T10:00:00Z',
        requirements: ['30 days consecutive engagement', 'Score above 500 daily'],
        rarity: 'rare',
        points: 500,
        timeline: [
          {
            id: 't1',
            timestamp: '2025-07-16T09:00:00Z',
            title: 'Challenge Started',
            description: 'Began 30-day engagement challenge',
            type: 'milestone',
            status: 'completed'
          },
          {
            id: 't2',
            timestamp: '2025-07-30T15:30:00Z',
            title: 'Halfway Milestone',
            description: 'Completed 15 days of consistent engagement',
            type: 'milestone',
            status: 'completed',
            points: 100
          },
          {
            id: 't3',
            timestamp: '2025-08-10T12:00:00Z',
            title: 'Final Week',
            description: 'Entered final week with perfect streak',
            type: 'achievement',
            status: 'completed',
            points: 150
          },
          {
            id: 't4',
            timestamp: '2025-08-15T10:00:00Z',
            title: 'Challenge Completed',
            description: 'Successfully completed 30-day engagement challenge',
            type: 'achievement',
            status: 'completed',
            points: 500,
            metadata: {
              value: 100,
              threshold: 100,
              details: 'Perfect completion with bonus points'
            }
          }
        ]
      },
      {
        id: '2',
        name: 'Early Adopter',
        description: 'Among the first to try new features',
        icon: 'star',
        color: '#9333EA',
        category: 'special',
        status: 'earned',
        earnedDate: '2025-07-20T14:00:00Z',
        requirements: ['Use 3 beta features', 'Provide feedback'],
        rarity: 'epic',
        points: 750,
        timeline: [
          {
            id: 't5',
            timestamp: '2025-07-18T10:00:00Z',
            title: 'Beta Access Granted',
            description: 'Received access to new feature preview',
            type: 'milestone',
            status: 'completed'
          },
          {
            id: 't6',
            timestamp: '2025-07-19T16:30:00Z',
            title: 'First Feature Trial',
            description: 'Tested virtual tour enhancement',
            type: 'activity',
            status: 'completed',
            points: 50
          },
          {
            id: 't7',
            timestamp: '2025-07-20T14:00:00Z',
            title: 'Badge Earned',
            description: 'Qualified for Early Adopter status',
            type: 'achievement',
            status: 'completed',
            points: 750
          }
        ]
      },
      {
        id: '3',
        name: 'Community Builder',
        description: 'Build strong connections within the community',
        icon: 'users',
        color: '#059669',
        category: 'behavior',
        status: 'in_progress',
        progress: {
          current: 7,
          total: 10,
          percentage: 70
        },
        requirements: ['Connect with 10 members', 'Host 2 events', 'Mentor 1 new member'],
        rarity: 'uncommon',
        points: 300,
        nextMilestone: {
          title: 'Final Connections',
          requirement: 'Connect with 3 more community members',
          estimatedTime: '2 weeks'
        },
        timeline: [
          {
            id: 't8',
            timestamp: '2025-08-01T10:00:00Z',
            title: 'Started Building',
            description: 'Began community building journey',
            type: 'milestone',
            status: 'completed'
          },
          {
            id: 't9',
            timestamp: '2025-08-10T14:00:00Z',
            title: 'First Event Hosted',
            description: 'Successfully hosted virtual meetup',
            type: 'activity',
            status: 'completed',
            points: 100
          },
          {
            id: 't10',
            timestamp: '2025-08-20T09:00:00Z',
            title: 'Mentorship Begun',
            description: 'Started mentoring new community member',
            type: 'activity',
            status: 'in_progress',
            metadata: {
              current: 1,
              total: 1,
              details: 'Ongoing mentorship program'
            }
          }
        ]
      },
      {
        id: '4',
        name: 'Loyalty Legend',
        description: 'Unwavering dedication over time',
        icon: 'heart',
        color: '#DC2626',
        category: 'milestone',
        status: 'locked',
        requirements: ['6 months active', '1000+ engagements', 'Refer 5 friends'],
        rarity: 'legendary',
        points: 1000,
        timeline: [
          {
            id: 't11',
            timestamp: '2025-08-20T12:00:00Z',
            title: 'Requirements Check',
            description: 'Current progress toward loyalty badge',
            type: 'requirement',
            status: 'pending',
            metadata: {
              details: 'Need 3 more months and 2 more referrals'
            }
          }
        ]
      }
    ]
  }

  const getBadgeIcon = (icon: string) => {
    switch (icon) {
      case 'trophy': return <Trophy className="w-4 h-4" />
      case 'star': return <Star className="w-4 h-4" />
      case 'target': return <Target className="w-4 h-4" />
      case 'zap': return <Zap className="w-4 h-4" />
      case 'crown': return <Crown className="w-4 h-4" />
      case 'award': return <Award className="w-4 h-4" />
      case 'users': return <Users className="w-4 h-4" />
      case 'heart': return <Heart className="w-4 h-4" />
      case 'shield': return <Shield className="w-4 h-4" />
      case 'flame': return <Flame className="w-4 h-4" />
      case 'gift': return <Gift className="w-4 h-4" />
      default: return <Star className="w-4 h-4" />
    }
  }

  const getTimelineIcon = (type: BadgeTimelineEvent['type']) => {
    switch (type) {
      case 'milestone': return <Calendar className="w-3 h-3" />
      case 'activity': return <TrendingUp className="w-3 h-3" />
      case 'achievement': return <Trophy className="w-3 h-3" />
      case 'requirement': return <Target className="w-3 h-3" />
      default: return <Circle className="w-3 h-3" />
    }
  }

  const getStatusIcon = (status: BadgeTimelineEvent['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-3 h-3 text-green-500" />
      case 'in_progress': return <Clock className="w-3 h-3 text-blue-500" />
      case 'pending': return <Circle className="w-3 h-3 text-yellow-500" />
      case 'failed': return <XCircle className="w-3 h-3 text-red-500" />
      default: return <Circle className="w-3 h-3 text-slate-400" />
    }
  }

  const getRarityColor = (rarity: ProfileBadge['rarity']) => {
    switch (rarity) {
      case 'common': return 'border-slate-300 dark:border-slate-600'
      case 'uncommon': return 'border-green-400 dark:border-green-500'
      case 'rare': return 'border-blue-400 dark:border-blue-500'
      case 'epic': return 'border-purple-400 dark:border-purple-500'
      case 'legendary': return 'border-yellow-400 dark:border-yellow-500'
      default: return 'border-slate-300 dark:border-slate-600'
    }
  }

  const getStatusStyle = (status: ProfileBadge['status']) => {
    switch (status) {
      case 'earned':
        return 'bg-white dark:bg-slate-800 opacity-100'
      case 'in_progress':
        return 'bg-white dark:bg-slate-800 opacity-90'
      case 'locked':
        return 'bg-slate-50 dark:bg-slate-900 opacity-60'
      case 'expired':
        return 'bg-red-50 dark:bg-red-900/20 opacity-75'
      default:
        return 'bg-white dark:bg-slate-800 opacity-100'
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date('2025-08-20T12:00:00Z')
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) {
      return 'Just now'
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`
    } else if (diffInMinutes < 10080) {
      return `${Math.floor(diffInMinutes / 1440)}d ago`
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
  }

  return (
    <div className="p-4 border-b border-slate-200 dark:border-slate-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
          Profile Badges
        </h3>
        <Badge variant="secondary" className="text-xs">
          {mockData.earnedBadges}/{mockData.totalBadges}
        </Badge>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 gap-2 mb-4 text-center">
        <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-2">
          <div className="text-lg font-bold text-slate-900 dark:text-slate-100">
            {mockData.totalPoints.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Total Points
          </div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-2">
          <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
            {mockData.currentRank}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Current Rank
          </div>
        </div>
      </div>

      {/* Next Rank Progress */}
      {mockData.nextRank && (
        <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Next: {mockData.nextRank.name}
            </span>
            <span className="text-xs text-slate-600 dark:text-slate-400">
              {mockData.nextRank.pointsToGo} pts to go
            </span>
          </div>
          <Progress 
            value={(mockData.totalPoints / mockData.nextRank.pointsRequired) * 100} 
            className="h-2"
          />
        </div>
      )}

      {/* Badges List */}
      <div className="space-y-2 max-h-[550px] overflow-y-auto scrollbar-hide">
        {mockData.badges.map((badge) => {
          const isExpanded = expandedBadges.has(badge.id)
          return (
            <div 
              key={badge.id} 
              className={`rounded-lg border-2 transition-all duration-200 cursor-pointer ${getRarityColor(badge.rarity)} ${getStatusStyle(badge.status)}`}
              onClick={() => toggleExpanded(badge.id)}
            >
              {/* Badge Header */}
              <div className="p-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div 
                      className="p-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: `${badge.color}20`, color: badge.color }}
                    >
                      {getBadgeIcon(badge.icon)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                        {badge.name}
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">
                        {badge.description}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <Badge 
                      variant={badge.status === 'earned' ? 'default' : badge.status === 'in_progress' ? 'secondary' : 'outline'}
                      className="text-xs capitalize"
                    >
                      {badge.status === 'in_progress' ? 'Active' : badge.status}
                    </Badge>
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Progress Bar for In Progress Badges */}
                {badge.status === 'in_progress' && badge.progress && (
                  <div className="mb-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-600 dark:text-slate-400">Progress</span>
                      <span className="text-slate-600 dark:text-slate-400">
                        {badge.progress.current}/{badge.progress.total}
                      </span>
                    </div>
                    <Progress value={badge.progress.percentage} className="h-1.5" />
                  </div>
                )}

                {/* Badge Info */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-500 dark:text-slate-400 capitalize">
                      {badge.rarity}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400">•</span>
                    <span className="text-slate-500 dark:text-slate-400">
                      {badge.points} pts
                    </span>
                  </div>
                  {badge.earnedDate && (
                    <span className="text-slate-500 dark:text-slate-400">
                      Earned {formatTime(badge.earnedDate)}
                    </span>
                  )}
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="border-t border-slate-200 dark:border-slate-700 p-3 space-y-3">
                  {/* Requirements */}
                  <div>
                    <div className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Requirements
                    </div>
                    <div className="space-y-1">
                      {badge.requirements.map((req, index) => (
                        <div key={index} className="flex items-center space-x-2 text-xs">
                          <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                          <span className="text-slate-600 dark:text-slate-400">{req}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Next Milestone */}
                  {badge.nextMilestone && (
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                      <div className="text-xs font-medium text-blue-700 dark:text-blue-300 mb-1">
                        Next Milestone: {badge.nextMilestone.title}
                      </div>
                      <div className="text-xs text-blue-600 dark:text-blue-400">
                        {badge.nextMilestone.requirement}
                      </div>
                      {badge.nextMilestone.estimatedTime && (
                        <div className="text-xs text-blue-500 dark:text-blue-400 mt-1">
                          Est. {badge.nextMilestone.estimatedTime}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Timeline */}
                  <div>
                    <div className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Achievement Timeline
                    </div>
                    <div className="space-y-2">
                      {badge.timeline.map((event) => (
                        <div key={event.id} className="flex items-start space-x-3">
                          <div className="flex items-center space-x-1 flex-shrink-0">
                            {getStatusIcon(event.status)}
                            <div className="text-slate-400">
                              {getTimelineIcon(event.type)}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <div className="text-xs font-medium text-slate-900 dark:text-slate-100">
                                {event.title}
                              </div>
                              <div className="text-xs text-slate-500 dark:text-slate-400">
                                {formatTime(event.timestamp)}
                              </div>
                            </div>
                            <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                              {event.description}
                            </div>
                            {event.points && (
                              <div className="text-xs font-medium text-green-600 dark:text-green-400">
                                +{event.points} points
                              </div>
                            )}
                            {event.metadata?.details && (
                              <div className="text-xs text-slate-500 dark:text-slate-400 italic">
                                {event.metadata.details}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
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
