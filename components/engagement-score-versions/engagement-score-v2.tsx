"use client"

import { ChartTooltip } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { 
  TrendingUp, 
  TrendingDown, 
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Zap,
  Target
} from "lucide-react"
import { EngagementScoreData } from "@/types"

interface EngagementScoreV2Props {
  data?: EngagementScoreData
}

export default function EngagementScoreV2({ data }: EngagementScoreV2Props) {
  // Enhanced mock data with recency analysis
  const mockData: EngagementScoreData = data || {
    totalScore: 547,
    projectName: "Real Estate Project Alpha",
    trendData: [
      { date: "Dec 16", score: 234 },
      { date: "Dec 17", score: 198 },
      { date: "Dec 18", score: 456 },
      { date: "Dec 19", score: 389 },
      { date: "Dec 20", score: 327 },
      { date: "Dec 21", score: 289 },
      { date: "Dec 22", score: 547 }
    ],
    momentum: [
      { period: "24h", percentage: 15.2, direction: "increase" },
      { period: "7 days", percentage: 7.1, direction: "increase" },
      { period: "30 days", percentage: 4.3, direction: "decrease" }
    ]
  }

  // Recency bands calculation
  const calculateRecencyBands = () => {
    const now = new Date('2024-12-22T12:00:00Z')
    const lastActivity = new Date('2024-12-22T08:30:00Z') // 3.5 hours ago
    const hoursAgo = Math.floor((now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60))
    
    // Define recency bands
    const bands = [
      {
        id: 'immediate',
        label: 'Immediate (0-4h)',
        range: '0-4 hours',
        minHours: 0,
        maxHours: 4,
        color: 'bg-red-500',
        bgColor: 'bg-red-50',
        textColor: 'text-red-700',
        borderColor: 'border-red-200',
        urgency: 'Critical',
        action: 'Call now',
        priority: 'Highest',
        conversion: 85,
        description: 'Peak engagement window - highest conversion probability'
      },
      {
        id: 'recent',
        label: 'Recent (4-24h)',
        range: '4-24 hours',
        minHours: 4,
        maxHours: 24,
        color: 'bg-orange-500',
        bgColor: 'bg-orange-50',
        textColor: 'text-orange-700',
        borderColor: 'border-orange-200',
        urgency: 'High',
        action: 'Follow up today',
        priority: 'High',
        conversion: 65,
        description: 'Strong engagement momentum - high conversion potential'
      },
      {
        id: 'warm',
        label: 'Warm (1-3 days)',
        range: '1-3 days',
        minHours: 24,
        maxHours: 72,
        color: 'bg-yellow-500',
        bgColor: 'bg-yellow-50',
        textColor: 'text-yellow-700',
        borderColor: 'border-yellow-200',
        urgency: 'Medium',
        action: 'Schedule call',
        priority: 'Medium',
        conversion: 45,
        description: 'Interest still present - good time for structured follow-up'
      },
      {
        id: 'cooling',
        label: 'Cooling (3-7 days)',
        range: '3-7 days',
        minHours: 72,
        maxHours: 168,
        color: 'bg-blue-500',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-700',
        borderColor: 'border-blue-200',
        urgency: 'Low',
        action: 'Re-engage',
        priority: 'Medium',
        conversion: 25,
        description: 'Interest waning - requires re-engagement strategy'
      },
      {
        id: 'cold',
        label: 'Cold (7+ days)',
        range: '7+ days',
        minHours: 168,
        maxHours: Infinity,
        color: 'bg-slate-500',
        bgColor: 'bg-slate-50',
        textColor: 'text-slate-700',
        borderColor: 'border-slate-200',
        urgency: 'Very Low',
        action: 'Nurture',
        priority: 'Low',
        conversion: 10,
        description: 'Low engagement - focus on value-driven nurture campaigns'
      }
    ]

    // Find current band
    const currentBand = bands.find(band => 
      hoursAgo >= band.minHours && hoursAgo < band.maxHours
    ) || bands[bands.length - 1]

    return {
      currentBand,
      allBands: bands,
      hoursAgo,
      lastActivity: lastActivity.toLocaleString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      })
    }
  }

  const recencyData = calculateRecencyBands()

  // Activity pattern analysis
  const getActivityPattern = () => {
    const recentScores = mockData.trendData.slice(-7)
    const averageScore = recentScores.reduce((sum, item) => sum + item.score, 0) / recentScores.length
    const trend = recentScores[recentScores.length - 1].score > recentScores[0].score ? 'increasing' : 'decreasing'
    
    return {
      averageScore: Math.round(averageScore),
      trend,
      consistency: recentScores.length >= 5 ? 'High' : 'Medium',
      peakDays: recentScores.filter(item => item.score > averageScore * 1.2).length
    }
  }

  const activityPattern = getActivityPattern()

  // Chart data for recency visualization
  const chartData = recencyData.allBands.slice(0, 4).map(band => ({
    name: band.label.split(' (')[0],
    conversion: band.conversion,
    color: band.color.replace('bg-', '#').replace('-500', '')
  }))

  const getStatusIcon = (urgency: string) => {
    switch (urgency) {
      case 'Critical': return <AlertCircle className="w-4 h-4 text-red-500" />
      case 'High': return <Zap className="w-4 h-4 text-orange-500" />
      case 'Medium': return <CheckCircle className="w-4 h-4 text-yellow-500" />
      case 'Low': return <Clock className="w-4 h-4 text-blue-500" />
      default: return <XCircle className="w-4 h-4 text-slate-500" />
    }
  }

  const getRecommendations = () => {
    const band = recencyData.currentBand
    switch (band.id) {
      case 'immediate':
        return [
          "🔥 URGENT: Contact within next 30 minutes",
          "📞 Direct phone call - highest success rate",
          "🎯 Present premium options immediately",
          "⚡ Prepare to close deal today"
        ]
      case 'recent':
        return [
          "📞 Call within next 4 hours",
          "📧 Send follow-up email with personalized content",
          "📅 Schedule consultation for tomorrow",
          "🎁 Offer limited-time incentive"
        ]
      case 'warm':
        return [
          "📧 Send value-focused email sequence",
          "📞 Schedule call within 2 days",
          "📋 Share case studies and testimonials",
          "🎯 Address potential objections"
        ]
      case 'cooling':
        return [
          "🎯 Re-engagement campaign with new value prop",
          "📚 Send educational content",
          "🤝 Offer consultation or assessment",
          "⏰ Check back in 3-5 days"
        ]
      case 'cold':
        return [
          "📚 Add to long-term nurture sequence",
          "📰 Share market insights and trends",
          "🎁 Offer valuable free resource",
          "📅 Schedule quarterly check-ins"
        ]
      default:
        return [
          "📞 Contact customer to assess current interest",
          "📧 Send personalized follow-up message"
        ]
    }
  }

  return (
    <Card className="w-full bg-white dark:bg-white">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-2">
          <Badge variant="outline" className="text-xs">
            Version 2 - Recency Analysis
          </Badge>
          <div className={`px-3 py-1 rounded-full ${recencyData.currentBand.color} text-white`}>
            <span className="text-xs font-bold">{recencyData.currentBand.urgency}</span>
          </div>
        </div>
        <CardTitle className="text-lg text-slate-900 dark:text-slate-900">
          Engagement Score & Recency Bands
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Current Recency Status */}
        <div className={`p-4 rounded-lg ${recencyData.currentBand.bgColor} border ${recencyData.currentBand.borderColor}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              {getStatusIcon(recencyData.currentBand.urgency)}
              <div>
                <div className="text-lg font-bold text-slate-900 dark:text-slate-900">
                  {recencyData.currentBand.label}
                </div>
                <div className={`text-sm ${recencyData.currentBand.textColor}`}>
                  Last activity: {recencyData.lastActivity}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-900">
                {mockData.totalScore.toLocaleString()}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-600">
                Engagement Score
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center text-sm">
            <div>
              <div className={`font-bold ${recencyData.currentBand.textColor}`}>
                {recencyData.hoursAgo}h ago
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-600">Last Activity</div>
            </div>
            <div>
              <div className={`font-bold ${recencyData.currentBand.textColor}`}>
                {recencyData.currentBand.conversion}%
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-600">Conversion Rate</div>
            </div>
            <div>
              <div className={`font-bold ${recencyData.currentBand.textColor}`}>
                {recencyData.currentBand.priority}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-600">Priority Level</div>
            </div>
          </div>
        </div>

        {/* Recency Bands Chart */}
        <div className="p-3 bg-slate-50 dark:bg-slate-50 rounded-lg border border-slate-200 dark:border-slate-200">
          <div className="text-sm font-medium text-slate-900 dark:text-slate-900 mb-3">
            Conversion Rate by Recency Band
          </div>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10 }}
                />
                <YAxis hide />
                <ChartTooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload
                      return (
                        <div className="bg-white border border-slate-200 rounded-lg p-2 shadow-lg">
                          <p className="text-xs font-medium text-slate-900">
                            {data.name}: {data.conversion}% conversion
                          </p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Bar 
                  dataKey="conversion" 
                  fill="#3b82f6"
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activity Pattern Analysis */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-blue-50 dark:bg-blue-50 rounded-lg border border-blue-200 dark:border-blue-200">
            <div className="text-sm font-medium text-blue-900 dark:text-blue-900 mb-2">
              Activity Pattern
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-blue-700 dark:text-blue-700">7-day average:</span>
                <span className="font-bold text-blue-900 dark:text-blue-900">{activityPattern.averageScore}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700 dark:text-blue-700">Trend:</span>
                <div className="flex items-center space-x-1">
                  {activityPattern.trend === 'increasing' ? 
                    <TrendingUp className="w-3 h-3 text-green-500" /> : 
                    <TrendingDown className="w-3 h-3 text-red-500" />
                  }
                  <span className="font-bold text-blue-900 dark:text-blue-900 capitalize">
                    {activityPattern.trend}
                  </span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700 dark:text-blue-700">Consistency:</span>
                <span className="font-bold text-blue-900 dark:text-blue-900">{activityPattern.consistency}</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-green-50 dark:bg-green-50 rounded-lg border border-green-200 dark:border-green-200">
            <div className="text-sm font-medium text-green-900 dark:text-green-900 mb-2">
              Engagement Health
            </div>
            <div className="space-y-2">
              <div className="text-xs text-green-700 dark:text-green-700 mb-1">
                Recency Score
              </div>
              <Progress 
                value={Math.max(0, 100 - (recencyData.hoursAgo * 2))} 
                className="h-2 mb-2" 
              />
              <div className="text-xs text-green-700 dark:text-green-700">
                {activityPattern.peakDays} peak days this week
              </div>
            </div>
          </div>
        </div>

        {/* All Recency Bands Overview */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-slate-900 dark:text-slate-900">
            Recency Band Framework
          </div>
          {recencyData.allBands.slice(0, 4).map((band) => (
            <div 
              key={band.id} 
              className={`p-2 rounded border ${band.id === recencyData.currentBand.id ? `${band.bgColor} ${band.borderColor}` : 'bg-white border-slate-200'}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded ${band.color}`}></div>
                  <div className="text-sm font-medium text-slate-900 dark:text-slate-900">
                    {band.label}
                  </div>
                  {band.id === recencyData.currentBand.id && (
                    <Badge variant="secondary" className="text-xs">Current</Badge>
                  )}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-600">
                  {band.conversion}% conversion • {band.action}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Recommendations */}
        <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-50 dark:to-emerald-50 rounded-lg border border-green-200 dark:border-green-200">
          <div className="flex items-center space-x-2 mb-3">
            <Target className="w-5 h-5 text-green-600" />
            <span className="text-sm font-semibold text-green-900 dark:text-green-900">
              Recommended Actions for {recencyData.currentBand.label.split(' (')[0]} Band
            </span>
          </div>
          
          <div className="space-y-2">
            {getRecommendations().map((action, index) => (
              <div key={index} className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="text-sm text-green-800 dark:text-green-800">
                  {action}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sales Consultant Guide */}
        <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-50 dark:to-pink-50 rounded-lg border border-purple-200 dark:border-purple-200">
          <div className="text-sm font-semibold text-purple-900 dark:text-purple-900 mb-2">
            ⏰ How Recency Bands Help Sales Consultants
          </div>
          <div className="text-xs text-purple-800 dark:text-purple-800 space-y-1">
            <p>• <strong>Timing Optimization:</strong> Contact leads when they&apos;re most likely to respond</p>
            <p>• <strong>Priority Management:</strong> Focus immediate attention on time-sensitive opportunities</p>
            <p>• <strong>Conversion Prediction:</strong> Know expected success rates for each time window</p>
            <p>• <strong>Resource Allocation:</strong> Deploy best salespeople to highest-probability windows</p>
            <p>• <strong>Follow-up Strategy:</strong> Tailor approach based on how much time has passed</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
