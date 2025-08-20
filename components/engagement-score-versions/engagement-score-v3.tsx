"use client"

import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis } from "recharts"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Flame, 
  Thermometer, 
  Snowflake,
  Clock,

  TrendingUp,
  TrendingDown,
  Target,
  Zap,
  Star
} from "lucide-react"
import { EngagementScoreData } from "@/types"

interface EngagementScoreV3Props {
  data?: EngagementScoreData
}

export default function EngagementScoreV3({ data }: EngagementScoreV3Props) {
  // Enhanced mock data combining temperature and recency
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

  // Combined scoring algorithm
  const calculateCombinedScore = () => {
    const score = mockData.totalScore
    const recentMomentum = mockData.momentum.find(m => m.period === "24h")?.percentage || 0
    const weeklyMomentum = mockData.momentum.find(m => m.period === "7 days")?.percentage || 0
    
    // Recency calculation (hours since last activity)
    const now = new Date('2024-12-22T12:00:00Z')
    const lastActivity = new Date('2024-12-22T08:30:00Z') // 3.5 hours ago
    const hoursAgo = Math.floor((now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60))
    
    // Temperature scoring (0-100)
    let temperatureScore = 0
    if (score >= 500) temperatureScore += 40
    else if (score >= 300) temperatureScore += 25
    else if (score >= 150) temperatureScore += 15
    else temperatureScore += 5
    
    if (recentMomentum >= 10) temperatureScore += 35
    else if (recentMomentum >= 5) temperatureScore += 20
    else if (recentMomentum >= 0) temperatureScore += 10
    
    if (weeklyMomentum >= 5) temperatureScore += 25
    else if (weeklyMomentum >= 0) temperatureScore += 15
    else temperatureScore += 5
    
    // Recency scoring (0-100, higher is more recent)
    let recencyScore = 0
    if (hoursAgo <= 1) recencyScore = 100
    else if (hoursAgo <= 4) recencyScore = 85
    else if (hoursAgo <= 12) recencyScore = 70
    else if (hoursAgo <= 24) recencyScore = 55
    else if (hoursAgo <= 72) recencyScore = 35
    else if (hoursAgo <= 168) recencyScore = 20
    else recencyScore = 10
    
    // Combined final score (weighted: 60% temperature, 40% recency)
    const finalScore = Math.round(temperatureScore * 0.6 + recencyScore * 0.4)
    
    return {
      temperatureScore,
      recencyScore,
      finalScore,
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

  const combinedData = calculateCombinedScore()

  // Determine overall status based on combined score
  const getOverallStatus = () => {
    const score = combinedData.finalScore
    const isRecent = combinedData.hoursAgo <= 4
    const isHot = combinedData.temperatureScore >= 80
    
    if (score >= 85 && isRecent && isHot) {
      return {
        level: "ultra-hot" as const,
        label: "🔥 Ultra Hot",
        color: "bg-gradient-to-r from-red-600 to-orange-500",
        bgColor: "bg-gradient-to-r from-red-50 to-orange-50",
        textColor: "text-red-800",
        borderColor: "border-red-300",
        urgency: "CRITICAL - Contact NOW",
        icon: <Star className="w-6 h-6 text-red-600" />,
        priority: "Immediate",
        expectedClose: "Within 2 hours",
        dealProbability: 95
      }
    } else if (score >= 70) {
      return {
        level: "hot" as const,
        label: "🔥 Hot Lead",
        color: "bg-red-500",
        bgColor: "bg-red-50",
        textColor: "text-red-700",
        borderColor: "border-red-200",
        urgency: "High Priority - Contact Today",
        icon: <Flame className="w-5 h-5 text-red-500" />,
        priority: "High",
        expectedClose: "Within 24 hours",
        dealProbability: 75
      }
    } else if (score >= 50) {
      return {
        level: "warm" as const,
        label: "🌡️ Warm Lead",
        color: "bg-orange-500",
        bgColor: "bg-orange-50",
        textColor: "text-orange-700",
        borderColor: "border-orange-200",
        urgency: "Medium Priority - Follow up soon",
        icon: <Thermometer className="w-5 h-5 text-orange-500" />,
        priority: "Medium",
        expectedClose: "2-3 days",
        dealProbability: 50
      }
    } else {
      return {
        level: "cold" as const,
        label: "❄️ Cold Lead",
        color: "bg-blue-500",
        bgColor: "bg-blue-50",
        textColor: "text-blue-700",
        borderColor: "border-blue-200",
        urgency: "Low Priority - Nurture needed",
        icon: <Snowflake className="w-5 h-5 text-blue-500" />,
        priority: "Low",
        expectedClose: "1-2 weeks",
        dealProbability: 25
      }
    }
  }

  const status = getOverallStatus()

  // Get specific recommendations based on combined analysis
  const getSmartRecommendations = () => {
    const temp = combinedData.temperatureScore
    const recency = combinedData.recencyScore
    
    if (temp >= 80 && recency >= 85) {
      return {
        immediate: [
          "🚨 URGENT: Call within 15 minutes",
          "💰 Present premium package immediately",
          "✅ Have contract ready to close today"
        ],
        tactical: [
          "Use recent engagement activity as conversation starter",
          "Reference specific pages/content they viewed recently",
          "Create urgency with limited-time premium incentive"
        ]
      }
    } else if (temp >= 80 && recency < 85) {
      return {
        immediate: [
          "📞 Call today - high interest but cooling",
          "🔥 Re-ignite engagement with personalized offer",
          "⚡ Schedule urgent consultation"
        ],
        tactical: [
          "Acknowledge the gap since last interaction",
          "Present new value proposition to re-engage",
          "Offer incentive to restart momentum"
        ]
      }
    } else if (temp < 80 && recency >= 85) {
      return {
        immediate: [
          "📧 Send immediate follow-up while engaged",
          "📋 Share valuable content to build interest",
          "📞 Schedule discovery call within 24h"
        ],
        tactical: [
          "Build on recent engagement momentum",
          "Focus on education and value demonstration",
          "Nurture relationship before pushing for close"
        ]
      }
    } else {
      return {
        immediate: [
          "📚 Initiate nurture sequence",
          "🎯 Focus on value-driven content",
          "📅 Schedule follow-up in 1 week"
        ],
        tactical: [
          "Rebuild engagement with educational content",
          "Segment into long-term nurture campaign",
          "Monitor for re-engagement signals"
        ]
      }
    }
  }

  const recommendations = getSmartRecommendations()

  const chartConfig = {
    score: {
      label: "Score",
      color: status.level === "ultra-hot" ? "#dc2626" : 
             status.level === "hot" ? "#ea580c" :
             status.level === "warm" ? "#d97706" : "#2563eb",
    },
  }

  return (
    <Card className="w-full bg-white dark:bg-white">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-2">
          <Badge variant="outline" className="text-xs">
            Version 3 - Smart Scoring
          </Badge>
          <div className={`px-3 py-1 rounded-full ${status.color} text-white`}>
            <span className="text-xs font-bold">{combinedData.finalScore}/100</span>
          </div>
        </div>
        <CardTitle className="text-lg text-slate-900 dark:text-slate-900">
          Smart Lead Intelligence Dashboard
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Overall Status Card */}
        <div className={`p-4 rounded-lg ${status.bgColor} border ${status.borderColor}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              {status.icon}
              <div>
                <div className="text-xl font-bold text-slate-900 dark:text-slate-900">
                  {status.label}
                </div>
                <div className={`text-sm ${status.textColor}`}>
                  {status.urgency}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-900">
                {mockData.totalScore.toLocaleString()}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-600">
                Engagement Points
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center text-sm">
            <div>
              <div className={`text-lg font-bold ${status.textColor}`}>
                {status.dealProbability}%
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-600">Deal Probability</div>
            </div>
            <div>
              <div className={`text-lg font-bold ${status.textColor}`}>
                {status.expectedClose}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-600">Expected Close</div>
            </div>
            <div>
              <div className={`text-lg font-bold ${status.textColor}`}>
                {status.priority}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-600">Priority Level</div>
            </div>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 bg-red-50 dark:bg-red-50 rounded-lg border border-red-200 dark:border-red-200 text-center">
            <Thermometer className="w-5 h-5 text-red-500 mx-auto mb-1" />
            <div className="text-lg font-bold text-red-700 dark:text-red-700">
              {combinedData.temperatureScore}
            </div>
            <div className="text-xs text-red-600 dark:text-red-600">Temperature</div>
          </div>
          
          <div className="p-3 bg-blue-50 dark:bg-blue-50 rounded-lg border border-blue-200 dark:border-blue-200 text-center">
            <Clock className="w-5 h-5 text-blue-500 mx-auto mb-1" />
            <div className="text-lg font-bold text-blue-700 dark:text-blue-700">
              {combinedData.recencyScore}
            </div>
            <div className="text-xs text-blue-600 dark:text-blue-600">Recency</div>
          </div>
          
          <div className="p-3 bg-purple-50 dark:bg-purple-50 rounded-lg border border-purple-200 dark:border-purple-200 text-center">
            <Star className="w-5 h-5 text-purple-500 mx-auto mb-1" />
            <div className="text-lg font-bold text-purple-700 dark:text-purple-700">
              {combinedData.finalScore}
            </div>
            <div className="text-xs text-purple-600 dark:text-purple-600">Combined</div>
          </div>
        </div>

        {/* Engagement Trend */}
        <div className="p-3 bg-slate-50 dark:bg-slate-50 rounded-lg border border-slate-200 dark:border-slate-200">
          <div className="text-sm font-medium text-slate-900 dark:text-slate-900 mb-2">
            7-Day Engagement Trend
          </div>
          <div className="h-20 mb-2">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <LineChart data={mockData.trendData}>
                <XAxis 
                  dataKey="date" 
                  axisLine={false}
                  tickLine={false}
                  tick={false}
                />
                <YAxis hide />
                <ChartTooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload
                      return (
                        <div className="bg-white border border-slate-200 rounded-lg p-2 shadow-lg">
                          <p className="text-xs font-medium text-slate-900">
                            {data.date}: {data.score} pts
                          </p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke={chartConfig.score.color}
                  strokeWidth={3}
                  dot={{ r: 3, fill: chartConfig.score.color }}
                  activeDot={{ r: 5, stroke: chartConfig.score.color, strokeWidth: 2 }}
                />
              </LineChart>
            </ChartContainer>
          </div>

          <div className="flex justify-between text-xs text-slate-600 dark:text-slate-600">
            <span>Last activity: {combinedData.lastActivity}</span>
            <span>{combinedData.hoursAgo}h ago</span>
          </div>
        </div>

        {/* Smart Recommendations */}
        <div className="space-y-3">
          {/* Immediate Actions */}
          <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-50 dark:to-emerald-50 rounded-lg border border-green-200 dark:border-green-200">
            <div className="flex items-center space-x-2 mb-3">
              <Zap className="w-5 h-5 text-green-600" />
              <span className="text-sm font-semibold text-green-900 dark:text-green-900">
                Immediate Actions Required
              </span>
            </div>
            
            <div className="space-y-2">
              {recommendations.immediate.map((action, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="text-sm text-green-800 dark:text-green-800">
                    {action}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tactical Recommendations */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-50 dark:to-cyan-50 rounded-lg border border-blue-200 dark:border-blue-200">
            <div className="flex items-center space-x-2 mb-3">
              <Target className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-semibold text-blue-900 dark:text-blue-900">
                Tactical Approach
              </span>
            </div>
            
            <div className="space-y-2">
              {recommendations.tactical.map((tactic, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="text-sm text-blue-800 dark:text-blue-800">
                    {tactic}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Momentum Indicators */}
        <div className="grid grid-cols-3 gap-2 text-center">
          {mockData.momentum.map((item, index) => (
            <div key={index} className="p-2 bg-white dark:bg-white rounded border border-slate-200 dark:border-slate-200">
              <div className="text-xs text-slate-500 dark:text-slate-500 mb-1">
                {item.period}
              </div>
              <div className="flex items-center justify-center space-x-1">
                {item.direction === 'increase' ? 
                  <TrendingUp className="w-3 h-3 text-green-500" /> : 
                  <TrendingDown className="w-3 h-3 text-red-500" />
                }
                <span className={`text-sm font-semibold ${item.direction === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
                  {Math.abs(item.percentage)}%
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Sales Consultant Guide */}
        <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-50 dark:to-pink-50 rounded-lg border border-purple-200 dark:border-purple-200">
          <div className="text-sm font-semibold text-purple-900 dark:text-purple-900 mb-2">
            🎯 Smart Scoring Benefits for Sales Consultants
          </div>
          <div className="text-xs text-purple-800 dark:text-purple-800 space-y-1">
            <p>• <strong>Intelligent Prioritization:</strong> Combines engagement strength with timing for optimal results</p>
            <p>• <strong>Dynamic Recommendations:</strong> Actions adapt based on both temperature and recency factors</p>
            <p>• <strong>Precision Timing:</strong> Know exactly when leads are most likely to convert</p>
            <p>• <strong>Risk Mitigation:</strong> Catch cooling leads before they become unresponsive</p>
            <p>• <strong>Resource Optimization:</strong> Deploy your best efforts where they&apos;ll have maximum impact</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
