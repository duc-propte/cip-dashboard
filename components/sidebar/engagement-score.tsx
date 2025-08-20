"use client"

import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis } from "recharts"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { EngagementScoreData, MomentumChange } from "@/types"

interface EngagementScoreProps {
  data?: EngagementScoreData
}

export default function EngagementScore({ data }: EngagementScoreProps) {
  // Mock data - in a real app, this would come from props or API
  const mockData: EngagementScoreData = data || {
    totalScore: 547,
    projectName: "",
    trendData: [
      { date: "Dec 9", score: 0 },
      { date: "Dec 10", score: 45 },
      { date: "Dec 11", score: 67 },
      { date: "Dec 12", score: 89 },
      { date: "Dec 13", score: 134 },
      { date: "Dec 14", score: 156 },
      { date: "Dec 15", score: 189 },
      { date: "Dec 16", score: 234, events: [
        { name: "Data Pipeline Optimization", contribution: 156 },
        { name: "New User Onboarding", contribution: 78 }
      ] }, // Peak
      { date: "Dec 17", score: 198 },
      { date: "Dec 18", score: 456, events: [
        { name: "Feature Release Launch", contribution: 267 },
        { name: "User Engagement Campaign", contribution: 134 },
        { name: "Performance Improvements", contribution: 55 }
      ] }, // Peak day
      { date: "Dec 19", score: 389 },
      { date: "Dec 20", score: 327 },
      { date: "Dec 21", score: 289 },
      { date: "Dec 22", score: 547, events: [
        { name: "Holiday Promotion Event", contribution: 298 },
        { name: "System Architecture Update", contribution: 167 },
        { name: "Community Milestone", contribution: 82 }
      ] }, // Final peak
    ],
    momentum: [
      { period: "7 days", percentage: 7.1, direction: "increase" },
      { period: "30 days", percentage: 15.2, direction: "increase" },
      { period: "1 year", percentage: 4.3, direction: "decrease" },
    ]
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
        return 'text-green-600 dark:text-green-400'
      case 'decrease':
        return 'text-red-600 dark:text-red-400'
      default:
        return 'text-slate-600 dark:text-slate-400'
    }
  }

  const chartConfig = {
    score: {
      label: "Score",
      color: "#22c55e", // Green color
    },
  }

  // Function to identify peak days (local maxima)
  const isPeakDay = (index: number, data: typeof mockData.trendData) => {
    if (index === 0 || index === data.length - 1) return false
    return data[index].score > data[index - 1].score && data[index].score > data[index + 1].score
  }

  return (
    <div className="p-4 border-b border-slate-200 dark:border-slate-700">
      <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-3">
        Engagement Score
      </h3>
      
      {/* Big Score Number */}
      <div className="text-center mb-3">
        <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          {mockData.totalScore.toLocaleString()}
        </div>
      </div>

      {/* Trend Chart */}
      <div className="h-16 mb-3">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <LineChart data={mockData.trendData}>
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={false}
              interval={0}
            />
            <YAxis hide />
            <ChartTooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload
                  const hasEvents = data.events && data.events.length > 0
                  
                  return (
                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 shadow-lg max-w-xs">
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-1">
                        {data.date}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                        Score: <span className="font-semibold text-green-600 dark:text-green-400">{data.score}</span>
                      </p>
                      
                      {hasEvents && (
                        <div className="border-t border-slate-200 dark:border-slate-700 pt-2">
                          <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Top Contributing Events:
                          </p>
                          <div className="space-y-1">
                            {data.events.slice(0, 3).map((event: { name: string; contribution: number }, index: number) => (
                              <div key={index} className="flex justify-between text-xs">
                                <span className="text-slate-600 dark:text-slate-400 truncate pr-2">
                                  {event.name}
                                </span>
                                <span className="font-medium text-green-600 dark:text-green-400 flex-shrink-0">
                                  +{event.contribution}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                }
                return null
              }}
              cursor={{ stroke: '#64748b', strokeWidth: 1 }}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#22c55e"
              strokeWidth={2}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              dot={(props: any) => {
                const { cx, cy, payload } = props
                if (!cx || !cy || !payload) return <></>
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const index = mockData.trendData.findIndex((item: any) => item.date === payload.date)
                const isPeak = isPeakDay(index, mockData.trendData)
                
                return (
                  <circle
                    key={`dot-${payload.date}`}
                    cx={cx}
                    cy={cy}
                    r={isPeak ? 4 : 2}
                    fill={isPeak ? "#ef4444" : "#22c55e"}
                    stroke={isPeak ? "#ef4444" : "#22c55e"}
                    strokeWidth={isPeak ? 2 : 1}
                  />
                )
              }}
              activeDot={{ r: 4, stroke: "#22c55e", strokeWidth: 2, fill: "#22c55e" }}
            />
          </LineChart>
        </ChartContainer>
      </div>

      {/* Momentum Changes */}
      <div className="grid grid-cols-3 gap-3">
        {mockData.momentum.map((item, index) => (
          <div key={index} className="text-center">
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
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
  )
}
