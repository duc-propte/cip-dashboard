"use client"

import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis } from "recharts"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Flame, 
  Thermometer, 
  Snowflake,
  Target,
  AlertTriangle
} from "lucide-react"
import { EngagementScoreData, MomentumChange } from "@/types"

interface EngagementScoreV1Props {
  data?: EngagementScoreData
}

export default function EngagementScoreV1({ data }: EngagementScoreV1Props) {
  // Enhanced mock data with lead temperature calculation
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

  // Lead temperature calculation based on score and momentum
  const calculateLeadTemperature = () => {
    const score = mockData.totalScore
    const recentMomentum = mockData.momentum.find(m => m.period === "24h")?.percentage || 0
    const weeklyMomentum = mockData.momentum.find(m => m.period === "7 days")?.percentage || 0
    
    // Temperature scoring algorithm
    let temperatureScore = 0
    
    // Base score contribution (40% weight)
    if (score >= 500) temperatureScore += 40
    else if (score >= 300) temperatureScore += 25
    else if (score >= 150) temperatureScore += 15
    else temperatureScore += 5
    
    // Recent momentum contribution (35% weight)
    if (recentMomentum >= 10) temperatureScore += 35
    else if (recentMomentum >= 5) temperatureScore += 20
    else if (recentMomentum >= 0) temperatureScore += 10
    else temperatureScore += 0
    
    // Weekly trend contribution (25% weight)
    if (weeklyMomentum >= 5) temperatureScore += 25
    else if (weeklyMomentum >= 0) temperatureScore += 15
    else temperatureScore += 5
    
    // Determine temperature
    if (temperatureScore >= 80) {
      return {
        level: "hot" as const,
        score: temperatureScore,
        color: "bg-red-500",
        textColor: "text-red-700",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        icon: <Flame className="w-5 h-5 text-red-500" />,
        label: "Hot Lead",
        urgency: "Immediate action required",
        priority: "High"
      }
    } else if (temperatureScore >= 50) {
      return {
        level: "warm" as const,
        score: temperatureScore,
        color: "bg-orange-500",
        textColor: "text-orange-700",
        bgColor: "bg-orange-50",
        borderColor: "border-orange-200",
        icon: <Thermometer className="w-5 h-5 text-orange-500" />,
        label: "Warm Lead",
        urgency: "Follow up within 24-48 hours",
        priority: "Medium"
      }
    } else {
      return {
        level: "cold" as const,
        score: temperatureScore,
        color: "bg-blue-500",
        textColor: "text-blue-700",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        icon: <Snowflake className="w-5 h-5 text-blue-500" />,
        label: "Cold Lead",
        urgency: "Nurture with educational content",
        priority: "Low"
      }
    }
  }

  const temperature = calculateLeadTemperature()

  const getActionRecommendations = () => {
    switch (temperature.level) {
      case "hot":
        return [
          "📞 Call immediately - lead is ready to convert",
          "🎯 Present premium options and close",
          "⚡ Schedule site visit within 24 hours",
          "💼 Prepare contract and financing options"
        ]
      case "warm":
        return [
          "📧 Send personalized follow-up email",
          "📅 Schedule consultation call",
          "📋 Share detailed property information",
          "🤝 Build relationship and address concerns"
        ]
      case "cold":
        return [
          "📚 Send educational content and market insights",
          "📱 Add to nurture email sequence",
          "🎯 Focus on value proposition",
          "⏰ Check back in 1-2 weeks"
        ]
    }
  }

  const getMomentumIcon = (direction: MomentumChange['direction']) => {
    switch (direction) {
      case 'increase':
        return <TrendingUp className="w-3 h-3 text-green-500" />
      case 'decrease':
        return <TrendingDown className="w-3 h-3 text-red-500" />
      default:
        return <Minus className="w-3 h-3 text-slate-500" />
    }
  }

  const getMomentumColor = (direction: MomentumChange['direction']) => {
    switch (direction) {
      case 'increase':
        return 'text-green-600'
      case 'decrease':
        return 'text-red-600'
      default:
        return 'text-slate-600'
    }
  }

  const chartConfig = {
    score: {
      label: "Score",
      color: temperature.level === "hot" ? "#ef4444" : temperature.level === "warm" ? "#f97316" : "#3b82f6",
    },
  }

  return (
    <Card className="w-full bg-white dark:bg-white">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-2">
          <Badge variant="outline" className="text-xs">
            Version 1 - Lead Temperature
          </Badge>
          <div className={`px-3 py-1 rounded-full ${temperature.color} text-white`}>
            <span className="text-xs font-bold">{temperature.label}</span>
          </div>
        </div>
        <CardTitle className="text-lg text-slate-900 dark:text-slate-900">
          Engagement Score & Lead Temperature
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Temperature Overview */}
        <div className={`p-4 rounded-lg ${temperature.bgColor} border ${temperature.borderColor}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              {temperature.icon}
              <div>
                <div className="text-lg font-bold text-slate-900 dark:text-slate-900">
                  {temperature.label}
                </div>
                <div className={`text-sm ${temperature.textColor}`}>
                  Temperature Score: {temperature.score}/100
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

          <div className={`text-sm ${temperature.textColor} mb-2`}>
            <AlertTriangle className="w-4 h-4 inline mr-1" />
            {temperature.urgency}
          </div>
          
          <Badge className={`${temperature.color} text-white text-xs`}>
            Priority: {temperature.priority}
          </Badge>
        </div>

        {/* Engagement Trend Chart */}
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

          {/* Momentum Indicators */}
          <div className="grid grid-cols-3 gap-2 text-center">
            {mockData.momentum.map((item, index) => (
              <div key={index} className="p-2 bg-white dark:bg-white rounded border border-slate-200 dark:border-slate-200">
                <div className="text-xs text-slate-500 dark:text-slate-500 mb-1">
                  {item.period}
                </div>
                <div className="flex items-center justify-center space-x-1">
                  {getMomentumIcon(item.direction)}
                  <span className={`text-sm font-semibold ${getMomentumColor(item.direction)}`}>
                    {Math.abs(item.percentage)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Recommendations */}
        <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-50 dark:to-emerald-50 rounded-lg border border-green-200 dark:border-green-200">
          <div className="flex items-center space-x-2 mb-3">
            <Target className="w-5 h-5 text-green-600" />
            <span className="text-sm font-semibold text-green-900 dark:text-green-900">
              Recommended Actions for {temperature.label}
            </span>
          </div>
          
          <div className="space-y-2">
            {getActionRecommendations().map((action, index) => (
              <div key={index} className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="text-sm text-green-800 dark:text-green-800">
                  {action}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Temperature Scale Reference */}
        <div className="p-3 bg-gradient-to-r from-blue-50 via-orange-50 to-red-50 dark:from-blue-50 dark:via-orange-50 dark:to-red-50 rounded-lg border border-slate-200 dark:border-slate-200">
          <div className="text-sm font-semibold text-slate-900 dark:text-slate-900 mb-2">
            🌡️ Lead Temperature Scale
          </div>
          <div className="grid grid-cols-3 gap-3 text-xs">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <Snowflake className="w-3 h-3 text-blue-500" />
                <span className="font-medium text-blue-700 dark:text-blue-700">Cold (0-49)</span>
              </div>
              <div className="text-blue-600 dark:text-blue-600">Nurture & Educate</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <Thermometer className="w-3 h-3 text-orange-500" />
                <span className="font-medium text-orange-700 dark:text-orange-700">Warm (50-79)</span>
              </div>
              <div className="text-orange-600 dark:text-orange-600">Engage & Follow-up</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <Flame className="w-3 h-3 text-red-500" />
                <span className="font-medium text-red-700 dark:text-red-700">Hot (80-100)</span>
              </div>
              <div className="text-red-600 dark:text-red-600">Close Immediately</div>
            </div>
          </div>
        </div>

        {/* Sales Consultant Guide */}
        <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-50 dark:to-pink-50 rounded-lg border border-purple-200 dark:border-purple-200">
          <div className="text-sm font-semibold text-purple-900 dark:text-purple-900 mb-2">
            💼 How This Helps Sales Consultants
          </div>
          <div className="text-xs text-purple-800 dark:text-purple-800 space-y-1">
            <p>• <strong>Prioritization:</strong> Focus on hot leads first for maximum conversion</p>
            <p>• <strong>Timing:</strong> Strike while the iron is hot - immediate action for red alerts</p>
            <p>• <strong>Approach:</strong> Tailor communication style based on temperature level</p>
            <p>• <strong>Resource Allocation:</strong> Assign best closers to hottest prospects</p>
            <p>• <strong>Pipeline Management:</strong> Track leads moving between temperature bands</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
