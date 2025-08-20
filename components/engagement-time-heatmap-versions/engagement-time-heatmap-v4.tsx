"use client"

import { useState, useMemo } from "react"
import { Clock } from "lucide-react"

interface ChannelData {
  website: number
  phone: number
  email: number
  social: number
  chat: number
}

interface TimeSlotEngagement {
  day: number
  dayName: string
  hour: number
  timeLabel: string
  totalEngagements: number
  avgDuration: number
  channels: ChannelData
  intensity: number
}

interface HeatmapProps {
  className?: string
}

export default function EngagementTimeHeatmapV4({ className = "" }: HeatmapProps) {
  const [selectedChannel, setSelectedChannel] = useState<keyof ChannelData | 'all'>('all')

  // Seeded random function for consistent results
  const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  // Generate comprehensive weekly engagement data with channel breakdown
  const weeklyData = useMemo(() => {
    // Counter for generating unique seeds within the data generation
    let seedCounter = 1000;
    const data: TimeSlotEngagement[] = []
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    
    for (let day = 0; day < 7; day++) {
      for (let hour = 0; hour < 24; hour++) {
        const seed = day * 24 + hour + 1000; // Create unique seed for each day/hour combination
        const timeLabel = hour === 0 ? '12 AM' : 
                         hour === 12 ? '12 PM' : 
                         hour < 12 ? `${hour} AM` : `${hour - 12} PM`
        
        // Base engagement patterns with day-of-week variations
        let baseEngagements = 0
        let baseDuration = 10
        
        // Weekday vs weekend modifier
        const isWeekend = day === 0 || day === 6
        const isWeekday = !isWeekend
        
        // Realistic hourly patterns
        if (hour >= 9 && hour <= 17) {
          // Business hours
          if (isWeekday) {
            baseEngagements = 25 + seededRandom(seed + 1) * 20
            baseDuration = 35 + seededRandom(seedCounter++) * 25
          } else {
            baseEngagements = 10 + seededRandom(seedCounter++) * 15  // Lower weekend business hour activity
            baseDuration = 20 + seededRandom(seedCounter++) * 15
          }
        } else if (hour >= 18 && hour <= 22) {
          // Evening hours
          if (isWeekday) {
            baseEngagements = 15 + seededRandom(seedCounter++) * 15
            baseDuration = 28 + seededRandom(seedCounter++) * 20
          } else {
            baseEngagements = 20 + seededRandom(seedCounter++) * 18  // Higher weekend evening activity
            baseDuration = 30 + seededRandom(seedCounter++) * 25
          }
        } else if (hour >= 6 && hour <= 8) {
          // Early morning
          if (isWeekday) {
            baseEngagements = 8 + seededRandom(seedCounter++) * 12
            baseDuration = 20 + seededRandom(seedCounter++) * 15
          } else {
            baseEngagements = 4 + seededRandom(seedCounter++) * 8   // Lower weekend morning activity
            baseDuration = 15 + seededRandom(seedCounter++) * 10
          }
        } else if (hour >= 10 && hour <= 16 && isWeekend) {
          // Weekend afternoon activity
          baseEngagements = 12 + seededRandom(seedCounter++) * 18
          baseDuration = 25 + seededRandom(seedCounter++) * 20
        } else {
          // Night time and other hours
          baseEngagements = 2 + seededRandom(seedCounter++) * 6
          baseDuration = 12 + seededRandom(seedCounter++) * 8
        }

        // Channel distribution based on time and day patterns
        let websiteRatio, phoneRatio, emailRatio, socialRatio, chatRatio
        
        if (hour >= 9 && hour <= 17 && isWeekday) {
          // Business hours weekdays - more phone and email
          websiteRatio = 0.30 + seededRandom(seedCounter++) * 0.10
          phoneRatio = 0.30 + seededRandom(seedCounter++) * 0.10
          emailRatio = 0.25 + seededRandom(seedCounter++) * 0.10
          socialRatio = 0.08 + seededRandom(seedCounter++) * 0.05
          chatRatio = 0.07 + seededRandom(seedCounter++) * 0.05
        } else if (hour >= 18 && hour <= 22) {
          // Evening - more website and social
          if (isWeekend) {
            websiteRatio = 0.50 + seededRandom(seedCounter++) * 0.15
            phoneRatio = 0.10 + seededRandom(seedCounter++) * 0.05
            emailRatio = 0.08 + seededRandom(seedCounter++) * 0.05
            socialRatio = 0.20 + seededRandom(seedCounter++) * 0.10
            chatRatio = 0.12 + seededRandom(seedCounter++) * 0.08
          } else {
            websiteRatio = 0.45 + seededRandom(seedCounter++) * 0.15
            phoneRatio = 0.15 + seededRandom(seedCounter++) * 0.08
            emailRatio = 0.15 + seededRandom(seedCounter++) * 0.08
            socialRatio = 0.15 + seededRandom(seedCounter++) * 0.10
            chatRatio = 0.10 + seededRandom(seedCounter++) * 0.05
          }
        } else if (isWeekend && hour >= 10 && hour <= 16) {
          // Weekend afternoon - social and website heavy
          websiteRatio = 0.55 + seededRandom(seedCounter++) * 0.15
          phoneRatio = 0.08 + seededRandom(seedCounter++) * 0.05
          emailRatio = 0.07 + seededRandom(seedCounter++) * 0.05
          socialRatio = 0.20 + seededRandom(seedCounter++) * 0.10
          chatRatio = 0.10 + seededRandom(seedCounter++) * 0.08
        } else {
          // Off hours - mostly website and chat
          websiteRatio = 0.50 + seededRandom(seedCounter++) * 0.20
          phoneRatio = 0.05 + seededRandom(seedCounter++) * 0.05
          emailRatio = 0.10 + seededRandom(seedCounter++) * 0.08
          socialRatio = 0.15 + seededRandom(seedCounter++) * 0.10
          chatRatio = 0.20 + seededRandom(seedCounter++) * 0.10
        }

        // Normalize ratios
        const totalRatio = websiteRatio + phoneRatio + emailRatio + socialRatio + chatRatio
        websiteRatio /= totalRatio
        phoneRatio /= totalRatio
        emailRatio /= totalRatio
        socialRatio /= totalRatio
        chatRatio /= totalRatio

        const totalEngagements = Math.round(baseEngagements)
        
        data.push({
          day,
          dayName: dayNames[day],
          hour,
          timeLabel,
          totalEngagements,
          avgDuration: Math.round(baseDuration),
          channels: {
            website: Math.round(totalEngagements * websiteRatio),
            phone: Math.round(totalEngagements * phoneRatio),
            email: Math.round(totalEngagements * emailRatio),
            social: Math.round(totalEngagements * socialRatio),
            chat: Math.round(totalEngagements * chatRatio)
          },
          intensity: Math.min(1, baseEngagements / 45) // Normalize intensity
        })
      }
    }
    
    return data
  }, [])



  // Get color for heatmap cells
  const getHeatmapColor = (slot: TimeSlotEngagement) => {
    let value: number
    if (selectedChannel === 'all') {
      value = slot.intensity
    } else {
      const maxChannelValue = Math.max(...weeklyData.map(s => s.channels[selectedChannel]))
      value = maxChannelValue > 0 ? slot.channels[selectedChannel] / maxChannelValue : 0
    }
    
    if (value === 0) return 'bg-slate-100 dark:bg-slate-800'
    if (value <= 0.2) return 'bg-blue-100 dark:bg-blue-900/20'
    if (value <= 0.4) return 'bg-blue-200 dark:bg-blue-800/40'
    if (value <= 0.6) return 'bg-blue-400 dark:bg-blue-700/60'
    if (value <= 0.8) return 'bg-blue-500 dark:bg-blue-600/80'
    return 'bg-blue-600 dark:bg-blue-500'
  }

  // Channel colors
  const channelColors = {
    website: 'bg-blue-500',
    phone: 'bg-green-500',
    email: 'bg-orange-500',
    social: 'bg-purple-500',
    chat: 'bg-pink-500'
  }

  return (
    <div className={`bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Weekly Engagement Heatmap
              </h3>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Channel Filter */}
        <div className="flex items-center space-x-2 mb-6">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Filter by channel:</span>
          <button
            onClick={() => setSelectedChannel('all')}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${
              selectedChannel === 'all'
                ? 'bg-slate-200 dark:bg-slate-600 text-slate-900 dark:text-slate-100'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
            }`}
          >
            All
          </button>
          {Object.keys(channelColors).map(channel => (
            <button
              key={channel}
              onClick={() => setSelectedChannel(channel as keyof ChannelData)}
              className={`px-3 py-1 text-xs rounded-full transition-colors capitalize ${
                selectedChannel === channel
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100 ring-2 ring-blue-500'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              {channel}
            </button>
          ))}
        </div>

        {/* Weekly Heatmap Grid */}
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Time labels (top) */}
            <div className="flex mb-3">
              <div className="w-20"></div> {/* Space for day labels */}
              <div className="flex-1 grid grid-cols-24 gap-px">
                {Array.from({ length: 24 }, (_, hour) => {
                  const hourDisplay = hour === 0 ? '12' : hour === 12 ? '12' : hour < 12 ? `${hour}` : `${hour - 12}`
                  const ampm = hour < 12 ? 'AM' : 'PM'
                  return (
                    <div key={hour} className="text-xs text-slate-500 dark:text-slate-400 text-center">
                      <div>{hourDisplay}</div>
                      <div>{ampm}</div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Heatmap grid by day */}
            <div className="space-y-px">
              {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((dayName, dayIndex) => (
                <div key={dayName} className="flex items-center">
                  {/* Day label */}
                  <div className="w-20 text-sm text-slate-600 dark:text-slate-400 font-medium">
                    {dayName.slice(0, 3)}
                  </div>
                  
                  {/* Hour cells */}
                  <div className="flex-1 grid grid-cols-24 gap-px">
                    {Array.from({ length: 24 }, (_, hour) => {
                      const slot = weeklyData.find(s => s.day === dayIndex && s.hour === hour)
                      if (!slot) return <div key={`${dayIndex}-${hour}`} className="h-8 bg-slate-100 dark:bg-slate-800 rounded-sm" />
                      
                      return (
                        <div
                          key={`${dayIndex}-${hour}`}
                          className={`h-8 rounded-sm cursor-pointer transition-all duration-200 hover:ring-2 hover:ring-blue-300 dark:hover:ring-blue-600 ${getHeatmapColor(slot)}`}
                        />
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>


          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center space-x-6 mt-6">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-slate-600 dark:text-slate-400">Low</span>
            <div className="flex space-x-1">
              <div className="w-3 h-3 bg-slate-100 dark:bg-slate-800 rounded"></div>
              <div className="w-3 h-3 bg-blue-100 dark:bg-blue-900/20 rounded"></div>
              <div className="w-3 h-3 bg-blue-200 dark:bg-blue-800/40 rounded"></div>
              <div className="w-3 h-3 bg-blue-400 dark:bg-blue-700/60 rounded"></div>
              <div className="w-3 h-3 bg-blue-500 dark:bg-blue-600/80 rounded"></div>
              <div className="w-3 h-3 bg-blue-600 dark:bg-blue-500 rounded"></div>
            </div>
            <span className="text-sm text-slate-600 dark:text-slate-400">High</span>
          </div>
        </div>
      </div>
    </div>
  )
}
