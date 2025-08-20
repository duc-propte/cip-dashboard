"use client"

import { 
  Trophy, 
  Star, 
  Users,
  Heart,
  Shield,
  Award,
  Calendar,
  TrendingUp,
  PhoneCall,
  Mail,
  Gift,
  Crown
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProfileBadgesData, ProfileBadge } from "@/types"

interface ProfileBadgesV3Props {
  data?: ProfileBadgesData
}

export default function ProfileBadgesV3({ data }: ProfileBadgesV3Props) {
  // Enhanced mock data with behavioral insights
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
        description: 'Innovation enthusiast and trend setter',
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
        description: 'Natural networker and relationship builder',
        icon: 'users',
        color: '#059669',
        category: 'behavior',
        status: 'earned',
        earnedDate: '2024-12-05T11:00:00Z',
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
        name: 'VIP Prospect',
        description: 'Premium engagement and high-value potential',
        icon: 'crown',
        color: '#DC2626',
        category: 'milestone',
        status: 'earned',
        earnedDate: '2024-11-28T09:00:00Z',
        requirements: ['Premium interactions'],
        rarity: 'legendary',
        points: 800,
        timeline: []
      }
    ]
  }

  const getBadgeIcon = (icon: string) => {
    switch (icon) {
      case 'trophy': return <Trophy className="w-5 h-5" />
      case 'star': return <Star className="w-5 h-5" />
      case 'users': return <Users className="w-5 h-5" />
      case 'heart': return <Heart className="w-5 h-5" />
      case 'shield': return <Shield className="w-5 h-5" />
      case 'crown': return <Crown className="w-5 h-5" />
      case 'award': return <Award className="w-5 h-5" />
      default: return <Star className="w-5 h-5" />
    }
  }

  // Generate customer persona based on badges
  const getCustomerPersona = () => {
    const earnedBadges = mockData.badges.filter(b => b.status === 'earned')
    
    if (earnedBadges.some(b => b.id === '5')) { // VIP Prospect
      return {
        type: "VIP Decision Maker",
        description: "High-value prospect with executive-level decision authority",
        approach: "White-glove service, executive presentations, premium offerings",
        preferredContact: "Direct phone calls, executive briefings",
        valueProps: ["Exclusive access", "Premium support", "Strategic partnership"],
        riskLevel: "Very Low",
        timeframe: "1-2 weeks"
      }
    }
    
    if (earnedBadges.some(b => b.id === '2')) { // Early Adopter
      return {
        type: "Innovation Leader",
        description: "Forward-thinking professional who influences others",
        approach: "Technology-focused demos, beta access, thought leadership",
        preferredContact: "Email with tech specs, video demonstrations",
        valueProps: ["Cutting-edge features", "First-mover advantage", "Innovation partnership"],
        riskLevel: "Low",
        timeframe: "2-4 weeks"
      }
    }
    
    if (earnedBadges.some(b => b.id === '3')) { // Community Builder
      return {
        type: "Network Influencer",
        description: "Connected professional with strong referral potential",
        approach: "Relationship-building, referral programs, community benefits",
        preferredContact: "Personal meetings, networking events",
        valueProps: ["Network effects", "Referral rewards", "Community status"],
        riskLevel: "Low",
        timeframe: "3-6 weeks"
      }
    }
    
    return {
      type: "Engaged Prospect",
      description: "Active and interested potential customer",
      approach: "Standard sales process with personalized touches",
      preferredContact: "Mixed approach - email and phone",
      valueProps: ["Value demonstration", "ROI focus", "Support quality"],
      riskLevel: "Medium",
      timeframe: "4-8 weeks"
    }
  }

  const persona = getCustomerPersona()

  // Calculate engagement timeline
  const getEngagementMilestones = () => {
    const earnedDates = mockData.badges
      .filter(b => b.status === 'earned' && b.earnedDate)
      .map(b => ({ name: b.name, date: new Date(b.earnedDate!) }))
      .sort((a, b) => a.date.getTime() - b.date.getTime())

    return earnedDates.map((item, index) => ({
      ...item,
      daysSinceFirst: index === 0 ? 0 : Math.floor((item.date.getTime() - earnedDates[0].date.getTime()) / (1000 * 60 * 60 * 24))
    }))
  }

  const milestones = getEngagementMilestones()

  const getRarityGradient = (rarity: ProfileBadge['rarity']) => {
    switch (rarity) {
      case 'common': return 'from-slate-100 to-slate-200'
      case 'uncommon': return 'from-green-100 to-green-200'
      case 'rare': return 'from-blue-100 to-blue-200'
      case 'epic': return 'from-purple-100 to-purple-200'
      case 'legendary': return 'from-yellow-100 to-yellow-200'
      default: return 'from-slate-100 to-slate-200'
    }
  }

  return (
    <Card className="w-full bg-white dark:bg-white">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-3">
          <Badge variant="outline" className="text-xs">
            Version 3 - Customer Intelligence
          </Badge>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="text-xs">
              {mockData.currentRank}
            </Badge>
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">
              {persona.type}
            </Badge>
          </div>
        </div>
        <CardTitle className="text-lg text-slate-900 dark:text-slate-900">
          Customer Intelligence Profile
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Customer Persona Summary */}
        <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-50 dark:to-purple-50 rounded-lg border border-indigo-200 dark:border-indigo-200">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-indigo-600" />
              <span className="text-sm font-semibold text-indigo-900 dark:text-indigo-900">
                Customer Profile
              </span>
            </div>
            <Badge className="bg-indigo-600 text-white text-xs">
              Risk: {persona.riskLevel}
            </Badge>
          </div>
          
          <div className="text-sm text-indigo-800 dark:text-indigo-800 mb-3">
            {persona.description}
          </div>
          
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <div className="font-medium text-indigo-900 dark:text-indigo-900 mb-1">Preferred Contact</div>
              <div className="text-indigo-700 dark:text-indigo-700">{persona.preferredContact}</div>
            </div>
            <div>
              <div className="font-medium text-indigo-900 dark:text-indigo-900 mb-1">Expected Timeframe</div>
              <div className="text-indigo-700 dark:text-indigo-700">{persona.timeframe}</div>
            </div>
          </div>
        </div>

        {/* Badge Showcase - Grid Layout */}
        <div className="grid grid-cols-2 gap-3">
          {mockData.badges.filter(b => b.status === 'earned').map((badge) => (
            <div 
              key={badge.id} 
              className={`p-3 rounded-lg bg-gradient-to-br ${getRarityGradient(badge.rarity)} border border-slate-200 dark:border-slate-200`}
            >
              <div className="flex items-center space-x-2 mb-2">
                <div 
                  className="p-2 rounded-full"
                  style={{ backgroundColor: badge.color, color: 'white' }}
                >
                  {getBadgeIcon(badge.icon)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-slate-900 dark:text-slate-900 truncate">
                    {badge.name}
                  </div>
                  <Badge variant="outline" className="text-xs capitalize mt-1">
                    {badge.rarity}
                  </Badge>
                </div>
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-600">
                {badge.description}
              </div>
              <div className="mt-2 flex justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-500">{badge.points} pts</span>
                <span className="text-slate-500 dark:text-slate-500">
                  {new Date(badge.earnedDate!).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Engagement Timeline */}
        <div className="p-3 bg-slate-50 dark:bg-slate-50 rounded-lg border border-slate-200 dark:border-slate-200">
          <div className="flex items-center space-x-2 mb-3">
            <Calendar className="w-4 h-4 text-slate-600" />
            <span className="text-sm font-semibold text-slate-900 dark:text-slate-900">
              Engagement Journey
            </span>
          </div>
          
          <div className="space-y-2">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-600">
                    {index + 1}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-slate-900 dark:text-slate-900">
                    {milestone.name}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-600">
                    {milestone.daysSinceFirst === 0 ? 'Journey started' : `+${milestone.daysSinceFirst} days`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sales Strategy Recommendations */}
        <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-50 dark:to-emerald-50 rounded-lg border border-green-200 dark:border-green-200">
          <div className="flex items-center space-x-2 mb-3">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span className="text-sm font-semibold text-green-900 dark:text-green-900">
              Recommended Sales Strategy
            </span>
          </div>
          
          <div className="text-sm text-green-800 dark:text-green-800 mb-3">
            <strong>Approach:</strong> {persona.approach}
          </div>
          
          <div className="space-y-2">
            <div>
              <div className="text-xs font-medium text-green-900 dark:text-green-900 mb-1">
                🎯 Key Value Propositions
              </div>
              <div className="text-xs text-green-700 dark:text-green-700">
                {persona.valueProps.join(' • ')}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Strategy */}
        <div className="grid grid-cols-3 gap-2">
          <div className="p-3 bg-blue-50 dark:bg-blue-50 rounded-lg text-center border border-blue-200 dark:border-blue-200">
            <PhoneCall className="w-5 h-5 text-blue-600 mx-auto mb-1" />
            <div className="text-xs font-medium text-blue-900 dark:text-blue-900">Call Priority</div>
            <div className="text-xs text-blue-700 dark:text-blue-700">
              {persona.type === "VIP Decision Maker" ? "Immediate" : "Standard"}
            </div>
          </div>
          
          <div className="p-3 bg-purple-50 dark:bg-purple-50 rounded-lg text-center border border-purple-200 dark:border-purple-200">
            <Mail className="w-5 h-5 text-purple-600 mx-auto mb-1" />
            <div className="text-xs font-medium text-purple-900 dark:text-purple-900">Email Style</div>
            <div className="text-xs text-purple-700 dark:text-purple-700">
              {persona.type === "Innovation Leader" ? "Technical" : "Personal"}
            </div>
          </div>
          
          <div className="p-3 bg-orange-50 dark:bg-orange-50 rounded-lg text-center border border-orange-200 dark:border-orange-200">
            <Gift className="w-5 h-5 text-orange-600 mx-auto mb-1" />
            <div className="text-xs font-medium text-orange-900 dark:text-orange-900">Incentives</div>
            <div className="text-xs text-orange-700 dark:text-orange-700">
              {persona.type === "Network Influencer" ? "Referral" : "Value"}
            </div>
          </div>
        </div>

        {/* Sales Consultant Guide */}
        <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-50 dark:to-pink-50 rounded-lg border border-purple-200 dark:border-purple-200">
          <div className="text-sm font-semibold text-purple-900 dark:text-purple-900 mb-2">
            🎯 How This Helps Sales Consultants
          </div>
          <div className="text-xs text-purple-800 dark:text-purple-800 space-y-1">
            <p>• <strong>Persona Mapping:</strong> Automatic customer profiling based on behavior patterns</p>
            <p>• <strong>Communication Style:</strong> Tailored contact preferences for each customer type</p>
            <p>• <strong>Value Positioning:</strong> Specific value props that resonate with each persona</p>
            <p>• <strong>Timeline Planning:</strong> Engagement journey helps predict next best actions</p>
            <p>• <strong>Risk Assessment:</strong> Trust and engagement badges indicate deal probability</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
