"use client"

import { 
  Trophy, 
  Star, 
  Target, 
  TrendingUp,
  Users,
  Heart,
  Shield,
  DollarSign,
  Clock,
  Zap,
  Award,
  AlertTriangle
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProfileBadgesData, ProfileBadge } from "@/types"

interface ProfileBadgesV2Props {
  data?: ProfileBadgesData
}

export default function ProfileBadgesV2({ data }: ProfileBadgesV2Props) {
  // Enhanced mock data with sales scoring
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
        requirements: ['30 days consecutive engagement'],
        rarity: 'rare',
        points: 500,
        timeline: []
      },
      {
        id: '2',
        name: 'Early Adopter',
        description: 'First to embrace new features and innovations',
        icon: 'star',
        color: '#9333EA',
        category: 'special',
        status: 'earned',
        earnedDate: '2024-12-10T14:00:00Z',
        requirements: ['Use 3 beta features'],
        rarity: 'epic',
        points: 750,
        timeline: []
      },
      {
        id: '3',
        name: 'Community Builder',
        description: 'Building strong network connections',
        icon: 'users',
        color: '#059669',
        category: 'behavior',
        status: 'in_progress',
        progress: {
          current: 7,
          total: 10,
          percentage: 70
        },
        requirements: ['Connect with 10 members'],
        rarity: 'uncommon',
        points: 300,
        timeline: []
      },
      {
        id: '4',
        name: 'Trust Builder',
        description: 'Exceptional reliability and credibility',
        icon: 'shield',
        color: '#0EA5E9',
        category: 'behavior',
        status: 'earned',
        earnedDate: '2024-12-01T16:00:00Z',
        requirements: ['95% positive feedback'],
        rarity: 'rare',
        points: 400,
        timeline: []
      },
      {
        id: '5',
        name: 'Premium Prospect',
        description: 'Shows interest in high-value offerings',
        icon: 'award',
        color: '#F59E0B',
        category: 'milestone',
        status: 'earned',
        earnedDate: '2024-11-25T12:00:00Z',
        requirements: ['Premium feature usage'],
        rarity: 'rare',
        points: 600,
        timeline: []
      }
    ]
  }

  const getBadgeIcon = (icon: string) => {
    switch (icon) {
      case 'trophy': return <Trophy className="w-4 h-4" />
      case 'star': return <Star className="w-4 h-4" />
      case 'target': return <Target className="w-4 h-4" />
      case 'users': return <Users className="w-4 h-4" />
      case 'heart': return <Heart className="w-4 h-4" />
      case 'shield': return <Shield className="w-4 h-4" />
      case 'award': return <Award className="w-4 h-4" />
      default: return <Star className="w-4 h-4" />
    }
  }

  // Calculate sales score based on badges
  const calculateSalesScore = () => {
    const earnedBadges = mockData.badges.filter(b => b.status === 'earned')
    let score = 0
    const factors: string[] = []

    earnedBadges.forEach(badge => {
      switch (badge.id) {
        case '1': // Engagement Champion
          score += 25
          factors.push("High engagement (+25)")
          break
        case '2': // Early Adopter  
          score += 30
          factors.push("Innovation-focused (+30)")
          break
        case '4': // Trust Builder
          score += 20
          factors.push("High reliability (+20)")
          break
        case '5': // Premium Prospect
          score += 35
          factors.push("Premium interest (+35)")
          break
      }
    })

    // In-progress badges add partial score
    const inProgressBadges = mockData.badges.filter(b => b.status === 'in_progress')
    inProgressBadges.forEach(badge => {
      if (badge.progress) {
        const partialScore = Math.round((badge.progress.percentage / 100) * 15)
        score += partialScore
        factors.push(`${badge.name} progress (+${partialScore})`)
      }
    })

    return { score: Math.min(score, 100), factors }
  }

  const { score: salesScore } = calculateSalesScore()

  const getSalesScoreColor = (score: number) => {
    if (score >= 80) return { bg: 'bg-green-500', text: 'text-white', label: 'Hot Lead' }
    if (score >= 60) return { bg: 'bg-yellow-500', text: 'text-white', label: 'Warm Lead' }
    if (score >= 40) return { bg: 'bg-orange-500', text: 'text-white', label: 'Potential' }
    return { bg: 'bg-slate-400', text: 'text-white', label: 'Cold Lead' }
  }

  const scoreColor = getSalesScoreColor(salesScore)

  const getBadgeValue = (badge: ProfileBadge) => {
    switch (badge.id) {
      case '1': return { revenue: "$8,500", conversion: "85%", priority: "High", urgency: "24h" }
      case '2': return { revenue: "$12,000", conversion: "78%", priority: "High", urgency: "48h" }
      case '3': return { revenue: "$6,000", conversion: "65%", priority: "Medium", urgency: "1 week" }
      case '4': return { revenue: "$7,500", conversion: "92%", priority: "Medium", urgency: "72h" }
      case '5': return { revenue: "$15,000", conversion: "70%", priority: "Very High", urgency: "12h" }
      default: return { revenue: "$4,000", conversion: "45%", priority: "Low", urgency: "2 weeks" }
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Very High': return 'bg-red-500 text-white'
      case 'High': return 'bg-orange-500 text-white'
      case 'Medium': return 'bg-yellow-500 text-white'
      case 'Low': return 'bg-slate-400 text-white'
      default: return 'bg-slate-400 text-white'
    }
  }

  return (
    <Card className="w-full bg-white dark:bg-white">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-3">
          <Badge variant="outline" className="text-xs">
            Version 2 - Sales Dashboard
          </Badge>
          <div className={`px-3 py-1 rounded-full ${scoreColor.bg} ${scoreColor.text}`}>
            <span className="text-xs font-bold">{salesScore}/100</span>
          </div>
        </div>
        <CardTitle className="text-lg text-slate-900 dark:text-slate-900">
          Sales Intelligence Dashboard
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Sales Score Overview */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-50 dark:to-purple-50 rounded-lg border border-blue-200 dark:border-blue-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-900">
                Sales Readiness Score
              </span>
            </div>
            <Badge className={`${scoreColor.bg} ${scoreColor.text} text-xs`}>
              {scoreColor.label}
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-900">
                {salesScore}%
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-600">Conversion Likelihood</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-600">
                ${(mockData.totalPoints * 4).toLocaleString()}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-600">Est. Deal Value</div>
            </div>
          </div>
          
          <Progress value={salesScore} className="h-3 mb-2" />
          <div className="text-xs text-slate-600 dark:text-slate-600">
            Based on {mockData.earnedBadges} earned badges and engagement patterns
          </div>
        </div>

        {/* Revenue Potential by Badge */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-900 flex items-center space-x-2">
            <DollarSign className="w-4 h-4 text-green-600" />
            <span>Revenue Opportunities</span>
          </h4>

          {mockData.badges.filter(b => b.status === 'earned').map((badge) => {
            const badgeValue = getBadgeValue(badge)
            return (
              <div key={badge.id} className="p-3 border border-slate-200 dark:border-slate-200 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="p-2 rounded-full"
                      style={{ backgroundColor: `${badge.color}20`, color: badge.color }}
                    >
                      {getBadgeIcon(badge.icon)}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-900 dark:text-slate-900">
                        {badge.name}
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-600">
                        {badge.description}
                      </div>
                    </div>
                  </div>
                  <Badge className={`text-xs ${getPriorityColor(badgeValue.priority)}`}>
                    {badgeValue.priority}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-3 mt-3 p-2 bg-slate-50 dark:bg-slate-50 rounded">
                  <div className="text-center">
                    <div className="text-sm font-bold text-green-600 dark:text-green-600">
                      {badgeValue.revenue}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-600">Avg. Deal</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-blue-600 dark:text-blue-600">
                      {badgeValue.conversion}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-600">Close Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-orange-600 dark:text-orange-600 flex items-center justify-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{badgeValue.urgency}</span>
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-600">Follow-up</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* In-Progress Opportunities */}
        {mockData.badges.some(b => b.status === 'in_progress') && (
          <div className="p-3 bg-yellow-50 dark:bg-yellow-50 rounded-lg border border-yellow-200 dark:border-yellow-200">
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-semibold text-yellow-900 dark:text-yellow-900">
                Emerging Opportunities
              </span>
            </div>
            {mockData.badges.filter(b => b.status === 'in_progress').map(badge => (
              <div key={badge.id} className="mt-2">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-yellow-800 dark:text-yellow-800">{badge.name}</span>
                  <span className="text-yellow-700 dark:text-yellow-700">
                    {badge.progress?.current}/{badge.progress?.total}
                  </span>
                </div>
                <Progress value={badge.progress?.percentage || 0} className="h-2" />
                <div className="text-xs text-yellow-700 dark:text-yellow-700 mt-1">
                  +${Math.round((badge.progress?.percentage || 0) * 30)} potential value increase
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Action Items for Sales Team */}
        <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-50 dark:to-emerald-50 rounded-lg border border-green-200 dark:border-green-200">
          <div className="flex items-center space-x-2 mb-3">
            <Target className="w-5 h-5 text-green-600" />
            <span className="text-sm font-semibold text-green-900 dark:text-green-900">
              Next Best Actions
            </span>
          </div>
          
          <div className="space-y-2">
            {salesScore >= 80 && (
              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
                <div className="text-xs text-slate-700 dark:text-slate-700">
                  <strong>Urgent:</strong> High-value prospect. Schedule premium consultation within 24 hours.
                </div>
              </div>
            )}
            
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
              <div className="text-xs text-slate-700 dark:text-slate-700">
                Leverage &quot;{mockData.badges.find(b => b.status === 'earned' && b.points === Math.max(...mockData.badges.filter(b => b.status === 'earned').map(b => b.points)))?.name}&quot; badge in conversation
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
              <div className="text-xs text-slate-700 dark:text-slate-700">
                Mention referral opportunities for community-focused benefits
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5"></div>
              <div className="text-xs text-slate-700 dark:text-slate-700">
                Prepare premium feature demos based on early adopter status
              </div>
            </div>
          </div>
        </div>

        {/* Sales Consultant Guide */}
        <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-50 dark:to-pink-50 rounded-lg border border-purple-200 dark:border-purple-200">
          <div className="text-sm font-semibold text-purple-900 dark:text-purple-900 mb-2">
            💼 How This Helps Sales Consultants
          </div>
          <div className="text-xs text-purple-800 dark:text-purple-800 space-y-1">
            <p>• <strong>Prioritization:</strong> Focus on badges with highest revenue potential and close rates</p>
            <p>• <strong>Personalization:</strong> Use badge achievements as conversation starters and trust builders</p>
            <p>• <strong>Timing:</strong> Urgency indicators help prioritize follow-up activities</p>
            <p>• <strong>Value Positioning:</strong> Tailor offers based on demonstrated behavior patterns</p>
            <p>• <strong>Risk Reduction:</strong> Trust and reliability badges indicate payment security</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
