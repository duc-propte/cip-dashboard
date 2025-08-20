"use client"

import { ChannelEngagementData } from "@/types"

interface ChannelEngagementProps {
  data?: ChannelEngagementData
}

export default function ChannelEngagement({ data }: ChannelEngagementProps) {
  // Mock data - in a real app, this would come from props or API
  const mockData: ChannelEngagementData = data || {
    totalEvents: 1247,
    channels: [
      {
        name: "Website",
        percentage: 68.2,
        events: 851,
        color: "#3b82f6" // Blue
      },
      {
        name: "CRM",
        percentage: 31.8,
        events: 396,
        color: "#10b981" // Green
      }
    ]
  }

  return (
    <div className="p-4 border-b border-slate-200 dark:border-slate-700">
      <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-3">
        Channel Engagement
      </h3>

      {/* Total Events */}
      <div className="text-center mb-3">
        <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          {mockData.totalEvents.toLocaleString()}
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400">
          Total Events
        </div>
      </div>

      {/* Channel Bars */}
      <div className="space-y-3">
        {mockData.channels.map((channel, index) => (
          <div key={index} className="space-y-1">
            {/* Channel Info */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: channel.color }}
                ></div>
                <span className="text-slate-900 dark:text-slate-100 font-medium">
                  {channel.name}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-slate-600 dark:text-slate-400 text-xs">
                  {channel.events.toLocaleString()}
                </span>
                <span className="text-slate-900 dark:text-slate-100 font-semibold">
                  {channel.percentage}%
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
              <div 
                className="h-2 rounded-full transition-all duration-300 ease-out"
                style={{ 
                  width: `${channel.percentage}%`,
                  backgroundColor: channel.color 
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-700">
        <div className="text-xs text-center text-slate-500 dark:text-slate-400">
          {mockData.channels[0].percentage > mockData.channels[1].percentage ? (
            <>
              <span className="font-medium text-slate-700 dark:text-slate-300">
                {mockData.channels[0].name}
              </span> leads by {(mockData.channels[0].percentage - mockData.channels[1].percentage).toFixed(1)}%
            </>
          ) : (
            <>
              <span className="font-medium text-slate-700 dark:text-slate-300">
                {mockData.channels[1].name}
              </span> leads by {(mockData.channels[1].percentage - mockData.channels[0].percentage).toFixed(1)}%
            </>
          )}
        </div>
      </div>
    </div>
  )
}
