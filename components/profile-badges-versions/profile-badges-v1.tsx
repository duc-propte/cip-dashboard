"use client"

import { useState } from "react"
import { 
  Trophy, 
  Star, 
  Target, 
  TrendingUp,
  Users,
  Heart,
  Shield,
  ChevronRight, 
  ChevronDown,
  Lightbulb,
  AlertCircle
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProfileBadgesData, ProfileBadge } from "@/types"

interface ProfileBadgesV1Props {
  data?: ProfileBadgesData
}

export default function ProfileBadgesV1({ data }: ProfileBadgesV1Props) {
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

  // Enhanced mock data with sales insights
  const mockData: ProfileBadgesData = data || {
    totalBadges: 8,
    earnedBadges: 5,
    totalPoints: 2450,
    currentRank: "Gold Tier",
    nextRank: {
      name: "Platinum Tier",
      pointsRequired: 3000,
      pointsToGo: 550
    },
    lastUpdated: '2024-12-20T11:30:00Z',
    badges: [
      {
        id: '1',
        name: 'Engagement Champion',
        description: 'Maintained high engagement for 30 consecutive days',
        icon: 'trophy',
        color: '#FFD700',
        category: 'engagement',
        status: 'earned',
        earnedDate: '2024-12-15T10:00:00Z',
        requirements: ['30 days consecutive engagement', 'Score above 500 daily'],
        rarity: 'rare',
        points: 500,
        timeline: []
      },
      {
        id: '2',
        name: 'Early Adopter',
        description: 'Among the first to try new features',
        icon: 'star',
        color: '#9333EA',
        category: 'special',
        status: 'earned',
        earnedDate: '2024-12-10T14:00:00Z',
        requirements: ['Use 3 beta features', 'Provide feedback'],
        rarity: 'epic',
        points: 750,
        timeline: []
      },
      {
        id: '3',
        name: 'Community Builder',
        description: 'Building strong connections within the community',
        icon: 'users',
        color: '#059669',
        category: 'behavior',
        status: 'in_progress',
        progress: {
          current: 7,
          total: 10,
          percentage: 70
        },
        requirements: ['Connect with 10 members', 'Host 2 events'],
        rarity: 'uncommon',
        points: 300,
        timeline: []
      },
      {
        id: '4',
        name: 'Trust Builder',
        description: 'Exceptional trust and credibility rating',
        icon: 'shield',
        color: '#0EA5E9',
        category: 'behavior',
        status: 'earned',
        earnedDate: '2024-12-01T16:00:00Z',
        requirements: ['95% positive feedback', '6 months activity'],
        rarity: 'rare',
        points: 400,
        timeline: []
      },
      {
        id: '5',
        name: 'Loyalty Legend',
        description: 'Unwavering dedication over time',
        icon: 'heart',
        color: '#DC2626',
        category: 'milestone',
        status: 'locked',
        requirements: ['6 months active', '1000+ engagements'],
        rarity: 'legendary',
        points: 1000,
        timeline: []
      }
    ]
  }

  const getBadgeIcon = (icon: string) => {
    switch (icon) {
      case 'trophy': return <Trophy className="w-5 h-5" />
      case 'star': return <Star className="w-5 h-5" />
      case 'target': return <Target className="w-5 h-5" />
      case 'users': return <Users className="w-5 h-5" />
      case 'heart': return <Heart className="w-5 h-5" />
      case 'shield': return <Shield className="w-5 h-5" />
      default: return <Star className="w-5 h-5" />
    }
  }

  // Sales insight generator based on badge data
  const getSalesInsights = (badge: ProfileBadge) => {
    switch (badge.id) {
      case '1': // Engagement Champion
        return {
          icon: <TrendingUp className="w-4 h-4 text-green-600" />,
          title: "High Conversion Potential",
          description: "Consistent engagement indicates serious interest. This client is 3x more likely to make a purchase decision.",
          action: "Schedule a consultation call within 48 hours while engagement is high."
        }
      case '2': // Early Adopter
        return {
          icon: <Lightbulb className="w-4 h-4 text-purple-600" />,
          title: "Innovation-Driven Client",
          description: "Early adopters are decision makers who value cutting-edge solutions. 85% close rate for premium offerings.",
          action: "Showcase latest features, premium upgrades, and exclusive early-access opportunities."
        }
      case '3': // Community Builder
        return {
          icon: <Users className="w-4 h-4 text-blue-600" />,
          title: "Referral Goldmine",
          description: "Community builders have strong networks. Each converted client typically brings 2-3 referrals.",
          action: "Offer referral incentives and network-based pricing for group purchases."
        }
      case '4': // Trust Builder
        return {
          icon: <Shield className="w-4 h-4 text-cyan-600" />,
          title: "Low-Risk, High-Value",
          description: "High trust rating indicates reliability. 95% payment success rate and minimal support needs.",
          action: "Fast-track approval processes and offer premium service tiers."
        }
      case '5': // Loyalty Legend
        return {
          icon: <Heart className="w-4 h-4 text-red-600" />,
          title: "Lifetime Value Customer",
          description: "Loyal clients have 5x higher lifetime value and are perfect for upselling premium services.",
          action: "Focus on relationship building and long-term value propositions."
        }
      default:
        return {
          icon: <AlertCircle className="w-4 h-4 text-gray-600" />,
          title: "Standard Approach",
          description: "Follow standard sales process for this client segment.",
          action: "Use standard qualification and nurturing sequence."
        }
    }
  }

  const getRarityColor = (rarity: ProfileBadge['rarity']) => {
    switch (rarity) {
      case 'common': return 'border-slate-300'
      case 'uncommon': return 'border-green-400'
      case 'rare': return 'border-blue-400'
      case 'epic': return 'border-purple-400'
      case 'legendary': return 'border-yellow-400'
      default: return 'border-slate-300'
    }
  }

  return (
    <Card className="w-full bg-white dark:bg-white">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-2">
          <Badge variant="outline" className="text-xs">
            Version 1 - Sales Insights
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {mockData.earnedBadges}/{mockData.totalBadges} Earned
          </Badge>
        </div>
        <CardTitle className="text-lg text-slate-900 dark:text-slate-900">
          Profile Badges & Sales Intelligence
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-50 dark:to-purple-50 rounded-lg">
          <div className="text-center">
            <div className="text-lg font-bold text-slate-900 dark:text-slate-900">
              {mockData.totalPoints.toLocaleString()}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-600">Points</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600 dark:text-blue-600">
              {mockData.currentRank}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-600">Tier</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-600 dark:text-green-600">
              {Math.round((mockData.earnedBadges / mockData.totalBadges) * 100)}%
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-600">Complete</div>
          </div>
        </div>

        {/* Progress to Next Tier */}
        {mockData.nextRank && (
          <div className="p-3 bg-amber-50 dark:bg-amber-50 rounded-lg border border-amber-200 dark:border-amber-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-amber-900 dark:text-amber-900">
                Progressing to {mockData.nextRank.name}
              </span>
              <span className="text-xs text-amber-700 dark:text-amber-700">
                {mockData.nextRank.pointsToGo} pts needed
              </span>
            </div>
            <Progress 
              value={(mockData.totalPoints / mockData.nextRank.pointsRequired) * 100} 
              className="h-2"
            />
          </div>
        )}

        {/* Badges with Sales Insights */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-900 flex items-center space-x-2">
            <Trophy className="w-4 h-4 text-amber-600" />
            <span>Badges & Sales Intelligence</span>
          </h4>
          
          {mockData.badges.map((badge) => {
            const isExpanded = expandedBadges.has(badge.id)
            const insights = getSalesInsights(badge)
            const isEarned = badge.status === 'earned'
            
            return (
              <div 
                key={badge.id} 
                className={`rounded-lg border-2 transition-all duration-200 cursor-pointer ${getRarityColor(badge.rarity)} ${
                  isEarned ? 'bg-white dark:bg-white' : 'bg-slate-50 dark:bg-slate-50 opacity-70'
                }`}
                onClick={() => toggleExpanded(badge.id)}
              >
                <div className="p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-3 flex-1">
                      <div 
                        className="p-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: `${badge.color}20`, color: badge.color }}
                      >
                        {getBadgeIcon(badge.icon)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-slate-900 dark:text-slate-900 truncate">
                          {badge.name}
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-600">
                          {badge.description}
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className="text-xs capitalize">
                            {badge.status === 'in_progress' ? 'Active' : badge.status}
                          </Badge>
                          <span className="text-xs text-slate-500 dark:text-slate-500">
                            {badge.points} pts • {badge.rarity}
                          </span>
                        </div>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    )}
                  </div>

                  {/* Progress for in-progress badges */}
                  {badge.status === 'in_progress' && badge.progress && (
                    <div className="mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-600 dark:text-slate-600">Progress</span>
                        <span className="text-slate-600 dark:text-slate-600">
                          {badge.progress.current}/{badge.progress.total}
                        </span>
                      </div>
                      <Progress value={badge.progress.percentage} className="h-1.5" />
                    </div>
                  )}

                  {/* Sales Insights Preview */}
                  {isEarned && (
                    <div className="mt-3 p-2 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-50 dark:to-blue-50 rounded border border-green-200 dark:border-green-200">
                      <div className="flex items-start space-x-2">
                        {insights.icon}
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold text-slate-900 dark:text-slate-900">
                            💡 Sales Insight: {insights.title}
                          </div>
                          <div className="text-xs text-slate-700 dark:text-slate-700 mt-1">
                            {insights.description}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-slate-200 dark:border-slate-200 p-3 bg-slate-50 dark:bg-slate-50">
                    {/* Sales Action Plan */}
                    {isEarned && (
                      <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-50 rounded border border-blue-200 dark:border-blue-200">
                        <div className="text-xs font-bold text-blue-900 dark:text-blue-900 mb-2">
                          🎯 Recommended Sales Action
                        </div>
                        <div className="text-xs text-blue-800 dark:text-blue-800">
                          {insights.action}
                        </div>
                      </div>
                    )}

                    {/* Requirements */}
                    <div>
                      <div className="text-xs font-medium text-slate-700 dark:text-slate-700 mb-2">
                        Achievement Requirements
                      </div>
                      <div className="space-y-1">
                        {badge.requirements.map((req, index) => (
                          <div key={index} className="flex items-center space-x-2 text-xs">
                            <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                            <span className="text-slate-600 dark:text-slate-600">{req}</span>
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

        {/* Sales Consultant Guidance */}
        <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-50 dark:to-pink-50 rounded-lg border border-purple-200 dark:border-purple-200">
          <div className="text-sm font-semibold text-purple-900 dark:text-purple-900 mb-2">
            📊 How This Helps Sales Consultants
          </div>
          <div className="text-xs text-purple-800 dark:text-purple-800 space-y-1">
            <p>• <strong>Qualification:</strong> Badge patterns reveal client motivation and budget capacity</p>
            <p>• <strong>Personalization:</strong> Tailor your approach based on behavioral insights from earned badges</p>
            <p>• <strong>Timing:</strong> Active badges indicate optimal moments for outreach and closing</p>
            <p>• <strong>Risk Assessment:</strong> Badge history predicts payment reliability and lifetime value</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
