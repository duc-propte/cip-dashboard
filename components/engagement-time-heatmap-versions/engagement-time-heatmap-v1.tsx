"use client"

import { useState, useMemo } from "react"
import { Clock } from "lucide-react"

interface HeatmapData {
  hour: number
  day: string
  value: number
  engagementCount: number
  avgDuration: number
}

interface HeatmapProps {
  className?: string
}

export default function EngagementTimeHeatmapV1({ className = "" }: HeatmapProps) {
  const [selectedMetric, setSelectedMetric] = useState<'count' | 'duration'>('count')
  const [hoveredCell, setHoveredCell] = useState<HeatmapData | null>(null)

  // Seeded random function for consistent results
  const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  // Days of the week
  const days = useMemo(() => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], [])
  
  // Hours (24-hour format)
  const hours = useMemo(() => Array.from({ length: 24 }, (_, i) => i), [])

  // Generate mock heatmap data
  const heatmapData = useMemo(() => {
    const data: HeatmapData[] = []
    
    days.forEach((day, dayIndex) => {
      hours.forEach(hour => {
        // Simulate realistic engagement patterns
        let baseValue = 0
        
        // Business hours (9 AM - 5 PM) have higher engagement
        if (hour >= 9 && hour <= 17) {
          baseValue = 0.7
        }
        // Evening hours (6 PM - 10 PM) moderate engagement
        else if (hour >= 18 && hour <= 22) {
          baseValue = 0.5
        }
        // Early morning (6 AM - 8 AM) light engagement
        else if (hour >= 6 && hour <= 8) {
          baseValue = 0.3
        }
        // Night time very low engagement
        else {
          baseValue = 0.1
        }

        // Weekend adjustment
        if (dayIndex === 0 || dayIndex === 6) {
          if (hour >= 10 && hour <= 16) {
            baseValue = 0.4 // Weekend afternoon activity
          } else if (hour >= 18 && hour <= 22) {
            baseValue = 0.6 // Weekend evening activity
          } else {
            baseValue *= 0.5 // Generally lower on weekends
          }
        }

        // Add some randomness using deterministic seed
        const seed = dayIndex * 24 + hour + 1000;
        const randomFactor = 0.8 + seededRandom(seed) * 0.4
        const finalValue = Math.min(1, baseValue * randomFactor)
        
        // Generate engagement count and duration based on value
        const engagementCount = Math.floor(finalValue * 20 + seededRandom(seed + 1) * 5)
        const avgDuration = Math.floor(finalValue * 45 + 10 + seededRandom(seed + 2) * 15) // 10-70 minutes

        data.push({
          hour,
          day,
          value: finalValue,
          engagementCount,
          avgDuration
        })
      })
    })
    
    return data
  }, [days, hours])

  // Get color intensity based on value
  const getIntensityColor = (value: number, metric: 'count' | 'duration') => {
    const dataPoint = heatmapData.find(d => d.value === value)
    if (!dataPoint) return 'bg-slate-100 dark:bg-slate-800'
    
    let intensity: number
    if (metric === 'count') {
      intensity = dataPoint.engagementCount / 25 // Normalize to 0-1
    } else {
      intensity = dataPoint.avgDuration / 70 // Normalize to 0-1
    }
    
    if (intensity === 0) return 'bg-slate-100 dark:bg-slate-800'
    if (intensity <= 0.25) return 'bg-blue-200 dark:bg-blue-900/30'
    if (intensity <= 0.5) return 'bg-blue-300 dark:bg-blue-800/50'
    if (intensity <= 0.75) return 'bg-blue-400 dark:bg-blue-700/70'
    return 'bg-blue-500 dark:bg-blue-600'
  }

  // Format hour for display
  const formatHour = (hour: number) => {
    if (hour === 0) return '12 AM'
    if (hour === 12) return '12 PM'
    if (hour < 12) return `${hour} AM`
    return `${hour - 12} PM`
  }

  // Get data point for specific hour and day
  const getDataPoint = (hour: number, day: string) => {
    return heatmapData.find(d => d.hour === hour && d.day === day)
  }

  return (
    <div className={`bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Engagement Time Heatmap
            </h3>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Customer engagement patterns by time of day and day of week
          </p>
        </div>
        
        {/* Metric Toggle */}
        <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
          <button
            onClick={() => setSelectedMetric('count')}
            className={`px-3 py-2 text-sm rounded-md transition-colors ${
              selectedMetric === 'count'
                ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-slate-100 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Count
          </button>
          <button
            onClick={() => setSelectedMetric('duration')}
            className={`px-3 py-2 text-sm rounded-md transition-colors ${
              selectedMetric === 'duration'
                ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-slate-100 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Duration
          </button>
        </div>
      </div>

      {/* Heatmap */}
      <div className="relative">
        {/* Time labels (top) */}
        <div className="flex mb-2">
          <div className="w-12"></div> {/* Space for day labels */}
          <div className="flex-1 grid grid-cols-24 gap-px">
            {hours.map(hour => (
              <div key={hour} className="text-xs text-slate-500 dark:text-slate-400 text-center">
                {hour % 6 === 0 && formatHour(hour)}
              </div>
            ))}
          </div>
        </div>

        {/* Heatmap grid */}
        <div className="space-y-px">
                          {days.map((day) => (
            <div key={day} className="flex items-center">
              {/* Day label */}
              <div className="w-12 text-sm text-slate-600 dark:text-slate-400 font-medium">
                {day}
              </div>
              
              {/* Hour cells */}
              <div className="flex-1 grid grid-cols-24 gap-px">
                {hours.map(hour => {
                  const dataPoint = getDataPoint(hour, day)
                  if (!dataPoint) return null
                  
                  return (
                    <div
                      key={`${day}-${hour}`}
                      className={`h-8 rounded-sm cursor-pointer transition-all duration-200 hover:ring-2 hover:ring-blue-300 dark:hover:ring-blue-600 ${getIntensityColor(dataPoint.value, selectedMetric)}`}
                      onMouseEnter={() => setHoveredCell(dataPoint)}
                      onMouseLeave={() => setHoveredCell(null)}
                      title={`${day} ${formatHour(hour)}: ${selectedMetric === 'count' ? `${dataPoint.engagementCount} engagements` : `${dataPoint.avgDuration} min avg`}`}
                    />
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-slate-600 dark:text-slate-400">Less</span>
            <div className="flex space-x-1">
              <div className="w-3 h-3 bg-slate-100 dark:bg-slate-800 rounded-sm"></div>
              <div className="w-3 h-3 bg-blue-200 dark:bg-blue-900/30 rounded-sm"></div>
              <div className="w-3 h-3 bg-blue-300 dark:bg-blue-800/50 rounded-sm"></div>
              <div className="w-3 h-3 bg-blue-400 dark:bg-blue-700/70 rounded-sm"></div>
              <div className="w-3 h-3 bg-blue-500 dark:bg-blue-600 rounded-sm"></div>
            </div>
            <span className="text-sm text-slate-600 dark:text-slate-400">More</span>
          </div>
          
          {hoveredCell && (
            <div className="bg-slate-900 dark:bg-slate-700 text-white text-sm px-3 py-2 rounded-lg">
              <div className="font-medium">
                {hoveredCell.day} {formatHour(hoveredCell.hour)}
              </div>
              <div className="text-slate-300 dark:text-slate-400">
                {hoveredCell.engagementCount} engagements • {hoveredCell.avgDuration} min avg
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
        <div className="text-center">
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {heatmapData.reduce((sum, d) => sum + d.engagementCount, 0)}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">Total Engagements</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {Math.round(heatmapData.reduce((sum, d) => sum + d.avgDuration, 0) / heatmapData.length)}m
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">Avg Duration</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {Math.round((heatmapData.filter(d => d.engagementCount > 0).length / heatmapData.length) * 100)}%
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">Time Coverage</div>
        </div>
      </div>
    </div>
  )
}
