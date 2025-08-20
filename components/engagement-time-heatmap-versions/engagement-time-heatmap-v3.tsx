"use client"

import { useState, useMemo } from "react"
import { Clock, Activity, TrendingUp, Zap, Eye } from "lucide-react"

interface EngagementData {
  hour: number
  timeLabel: string
  engagements: number
  avgDuration: number
  peakIntensity: number
  channels: {
    website: number
    phone: number
    email: number
  }
}

interface HeatmapProps {
  className?: string
}

export default function EngagementTimeHeatmapV3({ className = "" }: HeatmapProps) {
  const [selectedMetric, setSelectedMetric] = useState<'engagements' | 'duration' | 'intensity'>('engagements')
  const [hoveredHour, setHoveredHour] = useState<EngagementData | null>(null)

  // Seeded random function for consistent results
  const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  // Generate comprehensive engagement data
  const engagementData = useMemo(() => {
    const data: EngagementData[] = []
    
    for (let hour = 0; hour < 24; hour++) {
      const timeLabel = hour === 0 ? '12 AM' : 
                       hour === 12 ? '12 PM' : 
                       hour < 12 ? `${hour} AM` : `${hour - 12} PM`
      
      // Realistic engagement patterns
      let baseEngagements = 0
      let baseDuration = 10
      let baseIntensity = 0
      
      // Business hours (9 AM - 5 PM)
      if (hour >= 9 && hour <= 17) {
        baseEngagements = 20 + seededRandom(hour + 1000) * 15
        baseDuration = 30 + seededRandom(hour + 1000) * 25
        baseIntensity = 0.7 + seededRandom(hour + 1000) * 0.3
      }
      // Evening hours (6 PM - 10 PM)
      else if (hour >= 18 && hour <= 22) {
        baseEngagements = 12 + seededRandom(hour + 1000) * 18
        baseDuration = 25 + seededRandom(hour + 1000) * 20
        baseIntensity = 0.5 + seededRandom(hour + 1000) * 0.4
      }
      // Early morning (6 AM - 8 AM)
      else if (hour >= 6 && hour <= 8) {
        baseEngagements = 5 + seededRandom(hour + 1000) * 10
        baseDuration = 15 + seededRandom(hour + 1000) * 15
        baseIntensity = 0.3 + seededRandom(hour + 1000) * 0.3
      }
      // Night time
      else {
        baseEngagements = seededRandom(hour + 1000) * 5
        baseDuration = 8 + seededRandom(hour + 1000) * 7
        baseIntensity = seededRandom(hour + 1000) * 0.2
      }

      // Channel distribution
      const totalChannelEngagements = baseEngagements
      const websiteRatio = 0.6 + seededRandom(hour + 1000) * 0.2
      const phoneRatio = 0.15 + seededRandom(hour + 1000) * 0.15
      const emailRatio = 1 - websiteRatio - phoneRatio

      data.push({
        hour,
        timeLabel,
        engagements: Math.round(baseEngagements),
        avgDuration: Math.round(baseDuration),
        peakIntensity: Math.min(1, baseIntensity),
        channels: {
          website: Math.round(totalChannelEngagements * websiteRatio),
          phone: Math.round(totalChannelEngagements * phoneRatio),
          email: Math.round(totalChannelEngagements * emailRatio)
        }
      })
    }
    
    return data
  }, [])

  // Calculate metrics for display
  const maxEngagements = Math.max(...engagementData.map(d => d.engagements))
  const maxDuration = Math.max(...engagementData.map(d => d.avgDuration))
  const maxIntensity = Math.max(...engagementData.map(d => d.peakIntensity))

  // Get value for selected metric
  const getValue = (data: EngagementData) => {
    switch (selectedMetric) {
      case 'engagements': return data.engagements / maxEngagements
      case 'duration': return data.avgDuration / maxDuration
      case 'intensity': return data.peakIntensity / maxIntensity
      default: return 0
    }
  }

  // Get color based on value
  const getColor = (value: number) => {
    if (value === 0) return 'rgb(148, 163, 184)' // slate-400
    const intensity = Math.min(1, value)
    
    if (selectedMetric === 'engagements') {
      return `rgb(59, 130, 246, ${0.3 + intensity * 0.7})` // blue
    } else if (selectedMetric === 'duration') {
      return `rgb(168, 85, 247, ${0.3 + intensity * 0.7})` // purple
    } else {
      return `rgb(239, 68, 68, ${0.3 + intensity * 0.7})` // red
    }
  }

  // Generate radial positions
  const centerX = 150
  const centerY = 150
  const radius = 80
  
  const getRadialPosition = (hour: number, innerRadius: number = radius) => {
    const angle = (hour * 15) - 90 // 15 degrees per hour, start at top
    const radian = (angle * Math.PI) / 180
    return {
      x: centerX + innerRadius * Math.cos(radian),
      y: centerY + innerRadius * Math.sin(radian)
    }
  }

  // Summary statistics
  const totalEngagements = engagementData.reduce((sum, d) => sum + d.engagements, 0)
  const avgDuration = Math.round(engagementData.reduce((sum, d) => sum + d.avgDuration, 0) / engagementData.length)
  const peakHour = engagementData.reduce((max, current) => 
    current.engagements > max.engagements ? current : max
  )

  return (
    <div className={`bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Activity className="w-5 h-5 text-purple-500" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                24-Hour Engagement Radar
              </h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Radial view of engagement patterns throughout the day
            </p>
          </div>

          {/* Metric Selector */}
          <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
            <button
              onClick={() => setSelectedMetric('engagements')}
              className={`px-3 py-2 text-sm rounded-md transition-colors flex items-center space-x-1 ${
                selectedMetric === 'engagements'
                  ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>Count</span>
            </button>
            <button
              onClick={() => setSelectedMetric('duration')}
              className={`px-3 py-2 text-sm rounded-md transition-colors flex items-center space-x-1 ${
                selectedMetric === 'duration'
                  ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Time</span>
            </button>
            <button
              onClick={() => setSelectedMetric('intensity')}
              className={`px-3 py-2 text-sm rounded-md transition-colors flex items-center space-x-1 ${
                selectedMetric === 'intensity'
                  ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>Intensity</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Radial Heatmap */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <svg width="300" height="300" className="overflow-visible">
                {/* Background circles */}
                <circle 
                  cx={centerX} 
                  cy={centerY} 
                  r={radius + 20} 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="1" 
                  className="text-slate-200 dark:text-slate-700"
                  opacity="0.3"
                />
                <circle 
                  cx={centerX} 
                  cy={centerY} 
                  r={radius} 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="1" 
                  className="text-slate-200 dark:text-slate-700"
                  opacity="0.5"
                />
                <circle 
                  cx={centerX} 
                  cy={centerY} 
                  r={radius - 20} 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="1" 
                  className="text-slate-200 dark:text-slate-700"
                  opacity="0.3"
                />

                {/* Hour markers and data points */}
                {engagementData.map((data) => {
                  const position = getRadialPosition(data.hour)
                  const value = getValue(data)
                  const size = 8 + value * 12 // Responsive size based on value
                  
                  return (
                    <g key={data.hour}>
                      {/* Hour label */}
                      <text
                        x={getRadialPosition(data.hour, radius + 35).x}
                        y={getRadialPosition(data.hour, radius + 35).y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="text-xs fill-slate-600 dark:fill-slate-400"
                        fontSize="10"
                      >
                        {data.hour % 6 === 0 ? data.timeLabel : data.hour}
                      </text>

                      {/* Data point */}
                      <circle
                        cx={position.x}
                        cy={position.y}
                        r={size}
                        fill={getColor(value)}
                        stroke="white"
                        strokeWidth="2"
                        className="cursor-pointer hover:stroke-4 transition-all duration-200"
                        onMouseEnter={() => setHoveredHour(data)}
                        onMouseLeave={() => setHoveredHour(null)}
                      />
                    </g>
                  )
                })}

                {/* Center label */}
                <text
                  x={centerX}
                  y={centerY - 5}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-sm font-medium fill-slate-900 dark:fill-slate-100"
                >
                  24H
                </text>
                <text
                  x={centerX}
                  y={centerY + 10}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-xs fill-slate-600 dark:fill-slate-400"
                >
                  {selectedMetric}
                </text>
              </svg>

              {/* Hover tooltip */}
              {hoveredHour && (
                <div className="absolute top-4 left-4 bg-slate-900 dark:bg-slate-700 text-white p-3 rounded-lg shadow-lg min-w-[200px]">
                  <div className="font-medium text-sm mb-2">{hoveredHour.timeLabel}</div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span>Engagements:</span>
                      <span className="font-medium">{hoveredHour.engagements}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Avg Duration:</span>
                      <span className="font-medium">{hoveredHour.avgDuration}m</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Intensity:</span>
                      <span className="font-medium">{(hoveredHour.peakIntensity * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-600 dark:border-slate-500">
                    <div className="text-xs text-slate-300 dark:text-slate-400">Channels:</div>
                    <div className="flex justify-between text-xs mt-1">
                      <span>Web: {hoveredHour.channels.website}</span>
                      <span>Phone: {hoveredHour.channels.phone}</span>
                      <span>Email: {hoveredHour.channels.email}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Legend */}
            <div className="mt-6 text-center">
              <div className="flex items-center justify-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getColor(0.2) }}></div>
                  <span className="text-slate-600 dark:text-slate-400">Low</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getColor(0.5) }}></div>
                  <span className="text-slate-600 dark:text-slate-400">Medium</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getColor(1.0) }}></div>
                  <span className="text-slate-600 dark:text-slate-400">High</span>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics and Insights */}
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 dark:bg-slate-750 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Total Engagements</span>
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{totalEngagements}</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">across 24 hours</div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-750 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="w-4 h-4 text-purple-500" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Avg Duration</span>
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{avgDuration}m</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">per engagement</div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-750 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Zap className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Peak Hour</span>
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{peakHour.timeLabel}</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">{peakHour.engagements} engagements</div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-750 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Activity className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Active Hours</span>
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {engagementData.filter(d => d.engagements > 5).length}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">with 5+ engagements</div>
              </div>
            </div>

            {/* Channel Breakdown */}
            <div className="bg-slate-50 dark:bg-slate-750 rounded-lg p-4">
              <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-3">Channel Distribution</h4>
              <div className="space-y-3">
                {['website', 'phone', 'email'].map(channel => {
                  const total = engagementData.reduce((sum, d) => sum + d.channels[channel as keyof typeof d.channels], 0)
                  const percentage = (total / totalEngagements) * 100
                  
                  return (
                    <div key={channel} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${
                          channel === 'website' ? 'bg-blue-500' : 
                          channel === 'phone' ? 'bg-green-500' : 'bg-orange-500'
                        }`}></div>
                        <span className="text-sm capitalize text-slate-700 dark:text-slate-300">{channel}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="text-sm font-medium text-slate-900 dark:text-slate-100">{total}</div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">({percentage.toFixed(1)}%)</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Time Insights */}
            <div className="bg-slate-50 dark:bg-slate-750 rounded-lg p-4">
              <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-3">Time Insights</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Business Hours (9-5):</span>
                  <span className="font-medium text-slate-900 dark:text-slate-100">
                    {engagementData.slice(9, 18).reduce((sum, d) => sum + d.engagements, 0)} engagements
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Evening (6-10):</span>
                  <span className="font-medium text-slate-900 dark:text-slate-100">
                    {engagementData.slice(18, 23).reduce((sum, d) => sum + d.engagements, 0)} engagements
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Night (11-5):</span>
                  <span className="font-medium text-slate-900 dark:text-slate-100">
                    {[...engagementData.slice(23), ...engagementData.slice(0, 6)].reduce((sum, d) => sum + d.engagements, 0)} engagements
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
