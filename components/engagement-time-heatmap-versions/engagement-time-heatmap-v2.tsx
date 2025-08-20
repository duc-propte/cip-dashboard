"use client"

import { useState, useMemo } from "react"
import { Clock, BarChart3, Calendar, Users } from "lucide-react"

interface TimeSlot {
  time: string
  hour: number
  engagements: number
  avgDuration: number
  peakActivity: boolean
}



interface HeatmapProps {
  className?: string
}

export default function EngagementTimeHeatmapV2({ className = "" }: HeatmapProps) {
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'heatmap' | 'chart'>('heatmap')

  // Seeded random function for consistent results
  const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  // Generate realistic engagement data
  const weekData = useMemo(() => {
    const days = [
      { day: 'Mon', fullDay: 'Monday' },
      { day: 'Tue', fullDay: 'Tuesday' },
      { day: 'Wed', fullDay: 'Wednesday' },
      { day: 'Thu', fullDay: 'Thursday' },
      { day: 'Fri', fullDay: 'Friday' },
      { day: 'Sat', fullDay: 'Saturday' },
      { day: 'Sun', fullDay: 'Sunday' }
    ]

    return days.map(({ day, fullDay }, dayIndex) => {
      const timeSlots: TimeSlot[] = []
      let maxEngagements = 0
      let peakHour = ''

      // Generate data for 24 hours
      for (let hour = 0; hour < 24; hour++) {
        const timeFormat = hour === 0 ? '12 AM' : 
                          hour === 12 ? '12 PM' : 
                          hour < 12 ? `${hour} AM` : `${hour - 12} PM`
        
        // Realistic engagement patterns
        let baseEngagements = 0
        let baseDuration = 15

        // Business hours pattern
        if (hour >= 9 && hour <= 17) {
          baseEngagements = 15 + seededRandom(dayIndex * 24 + hour + 1000) * 10
          baseDuration = 25 + seededRandom(dayIndex * 24 + hour + 1000) * 20
        }
        // Evening pattern
        else if (hour >= 18 && hour <= 22) {
          baseEngagements = 8 + seededRandom(dayIndex * 24 + hour + 1000) * 12
          baseDuration = 20 + seededRandom(dayIndex * 24 + hour + 1000) * 15
        }
        // Early morning
        else if (hour >= 6 && hour <= 8) {
          baseEngagements = 3 + seededRandom(dayIndex * 24 + hour + 1000) * 7
          baseDuration = 15 + seededRandom(dayIndex * 24 + hour + 1000) * 10
        }
        // Night time
        else {
          baseEngagements = seededRandom(dayIndex * 24 + hour + 1000) * 3
          baseDuration = 10 + seededRandom(dayIndex * 24 + hour + 1000) * 5
        }

        // Weekend adjustments
        if (day === 'Sat' || day === 'Sun') {
          if (hour >= 10 && hour <= 16) {
            baseEngagements *= 0.7
          } else if (hour >= 18 && hour <= 22) {
            baseEngagements *= 1.2
          } else {
            baseEngagements *= 0.4
          }
        }

        const engagements = Math.round(baseEngagements)
        const avgDuration = Math.round(baseDuration)

        if (engagements > maxEngagements) {
          maxEngagements = engagements
          peakHour = timeFormat
        }

        timeSlots.push({
          time: timeFormat,
          hour,
          engagements,
          avgDuration,
          peakActivity: false
        })
      }

      // Mark peak hours
      timeSlots.forEach(slot => {
        slot.peakActivity = slot.engagements >= maxEngagements * 0.8
      })

      return {
        day,
        fullDay,
        timeSlots,
        totalEngagements: timeSlots.reduce((sum, slot) => sum + slot.engagements, 0),
        peakHour
      }
    })
  }, [])

  // Get intensity for heatmap
  const getIntensity = (engagements: number) => {
    const maxEngagements = Math.max(...weekData.flatMap(d => d.timeSlots.map(s => s.engagements)))
    return engagements / maxEngagements
  }

  // Get color based on intensity
  const getHeatmapColor = (intensity: number) => {
    if (intensity === 0) return 'bg-slate-100 dark:bg-slate-800'
    if (intensity <= 0.2) return 'bg-emerald-100 dark:bg-emerald-900/20'
    if (intensity <= 0.4) return 'bg-emerald-200 dark:bg-emerald-800/40'
    if (intensity <= 0.6) return 'bg-emerald-300 dark:bg-emerald-700/60'
    if (intensity <= 0.8) return 'bg-emerald-400 dark:bg-emerald-600/80'
    return 'bg-emerald-500 dark:bg-emerald-500'
  }

  const selectedDayData = selectedDay ? weekData.find(d => d.day === selectedDay) : null

  return (
    <div className={`bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <BarChart3 className="w-5 h-5 text-emerald-500" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Weekly Engagement Patterns
              </h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Interactive view of customer engagement across the week
            </p>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('heatmap')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'heatmap'
                    ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-slate-100 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <Calendar className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('chart')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'chart'
                    ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-slate-100 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {viewMode === 'heatmap' ? (
          <>
            {/* Day Selection */}
            <div className="flex items-center space-x-2 mb-6">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Select day:</span>
              {weekData.map(dayData => (
                <button
                  key={dayData.day}
                  onClick={() => setSelectedDay(selectedDay === dayData.day ? null : dayData.day)}
                  className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                    selectedDay === dayData.day
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  {dayData.day}
                </button>
              ))}
            </div>

            {/* Heatmap Grid */}
            <div className="space-y-3">
              {weekData.map(dayData => (
                <div
                  key={dayData.day}
                  className={`p-4 rounded-lg border transition-all duration-200 ${
                    selectedDay === dayData.day
                      ? 'border-emerald-300 dark:border-emerald-600 bg-emerald-50 dark:bg-emerald-900/10'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <h4 className="font-medium text-slate-900 dark:text-slate-100">
                        {dayData.fullDay}
                      </h4>
                      <div className="flex items-center space-x-4 text-sm text-slate-600 dark:text-slate-400">
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{dayData.totalEngagements} engagements</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>Peak: {dayData.peakHour}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Hour blocks */}
                  <div className="grid grid-cols-24 gap-1">
                    {dayData.timeSlots.map(slot => {
                      const intensity = getIntensity(slot.engagements)
                      return (
                        <div
                          key={`${dayData.day}-${slot.hour}`}
                          className={`h-8 rounded-sm cursor-pointer transition-all duration-200 hover:scale-110 hover:z-10 relative group ${getHeatmapColor(intensity)} ${
                            slot.peakActivity ? 'ring-2 ring-emerald-400 dark:ring-emerald-500' : ''
                          }`}
                          title={`${slot.time}: ${slot.engagements} engagements, ${slot.avgDuration}min avg`}
                        >
                          {/* Tooltip */}
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20">
                            <div className="bg-slate-900 dark:bg-slate-700 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                              <div className="font-medium">{slot.time}</div>
                              <div>{slot.engagements} engagements</div>
                              <div>{slot.avgDuration}min avg</div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Chart View */}
            {selectedDayData ? (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                    {selectedDayData.fullDay} Engagement Timeline
                  </h4>
                  <button
                    onClick={() => setSelectedDay(null)}
                    className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                  >
                    Back to overview
                  </button>
                </div>

                {/* Bar Chart */}
                <div className="space-y-2">
                  {selectedDayData.timeSlots.filter(slot => slot.engagements > 0).map(slot => {
                    const maxEngagements = Math.max(...selectedDayData.timeSlots.map(s => s.engagements))
                    const widthPercent = (slot.engagements / maxEngagements) * 100

                    return (
                      <div key={slot.hour} className="flex items-center space-x-4">
                        <div className="w-16 text-sm text-slate-600 dark:text-slate-400 font-mono">
                          {slot.time}
                        </div>
                        <div className="flex-1 bg-slate-100 dark:bg-slate-700 rounded-full h-6 relative">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              slot.peakActivity 
                                ? 'bg-emerald-500' 
                                : 'bg-emerald-300 dark:bg-emerald-600'
                            }`}
                            style={{ width: `${widthPercent}%` }}
                          />
                          <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-slate-700 dark:text-slate-300">
                            {slot.engagements} engagements
                          </div>
                        </div>
                        <div className="w-20 text-sm text-slate-600 dark:text-slate-400 text-right">
                          {slot.avgDuration}m avg
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
                  Select a day to view detailed chart
                </h4>
                <p className="text-slate-600 dark:text-slate-400">
                  Choose a day from the heatmap view to see hourly engagement details
                </p>
              </div>
            )}
          </>
        )}

        {/* Legend */}
        {viewMode === 'heatmap' && (
          <div className="flex items-center justify-center space-x-6 mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-slate-600 dark:text-slate-400">Low</span>
              <div className="flex space-x-1">
                <div className="w-4 h-4 bg-slate-100 dark:bg-slate-800 rounded"></div>
                <div className="w-4 h-4 bg-emerald-100 dark:bg-emerald-900/20 rounded"></div>
                <div className="w-4 h-4 bg-emerald-200 dark:bg-emerald-800/40 rounded"></div>
                <div className="w-4 h-4 bg-emerald-300 dark:bg-emerald-700/60 rounded"></div>
                <div className="w-4 h-4 bg-emerald-400 dark:bg-emerald-600/80 rounded"></div>
                <div className="w-4 h-4 bg-emerald-500 dark:bg-emerald-500 rounded"></div>
              </div>
              <span className="text-sm text-slate-600 dark:text-slate-400">High</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-emerald-500 rounded ring-2 ring-emerald-400"></div>
              <span className="text-sm text-slate-600 dark:text-slate-400">Peak Activity</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
