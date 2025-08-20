"use client"

import { useState, useMemo, useRef, useCallback } from "react"
import { Calendar, Filter, Globe, Phone, Mail } from "lucide-react"
import { TimeFilterOption } from "@/types"

export default function ActivityTimeline() {
  const [selectedTimeFilter, setSelectedTimeFilter] = useState<TimeFilterOption>('week')
  const [selectedChannels, setSelectedChannels] = useState<Set<string>>(new Set(['website', 'phone', 'email']))
  const [selectedEventTypes, setSelectedEventTypes] = useState<Set<string>>(new Set(['customer_engagement', 'sales_outreach']))
  const [hoveredEvent, setHoveredEvent] = useState<{
    x: number;
    y: { channelIndex: number; isCustomerEngagement: boolean };
    size: number;
    color: string;
    event: {
      id: string;
      timestamp: string;
      channel: string;
      eventType: string;
      description: string;
      intensity: number;
      outcome?: string;
      details?: Record<string, string | number | boolean>;
    };
    formattedDate: string;
    formattedTime: string;
    isCustomerEngagement: boolean;
    aggregationLabel: string;
  } | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const svgRef = useRef<SVGSVGElement>(null)

  // Chart dimensions and margins
  const chartHeight = 320
  const margin = { top: 20, right: 40, bottom: 80, left: 140 }
  const plotHeight = chartHeight - margin.top - margin.bottom

  // Generate date range based on selected time filter
  const getDateRange = (filter: TimeFilterOption) => {
    const now = new Date()
    const start = new Date()
    
    switch (filter) {
      case 'day':
        start.setDate(now.getDate() - 1)
        break
      case 'week':
        start.setDate(now.getDate() - 7)
        break
      case 'month':
        start.setMonth(now.getMonth() - 1)
        break
      case 'year':
        start.setFullYear(now.getFullYear() - 1)
        break
    }
    
    return { start: start.toISOString(), end: now.toISOString() }
  }

  // Generate deterministic mock data to avoid hydration mismatches
  const generateMockEvents = (dateRange: { start: string; end: string }) => {
    const events = []
    const startDate = new Date(dateRange.start)
    const endDate = new Date(dateRange.end)
    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    
    // Use deterministic values based on date to avoid hydration issues
    const seededRandom = (seed: number) => {
      const x = Math.sin(seed) * 10000
      return x - Math.floor(x)
    }
    
    // Generate events for each day
    for (let i = 0; i < daysDiff; i++) {
      const currentDate = new Date(startDate)
      currentDate.setDate(startDate.getDate() + i)
      const daysSinceEpoch = Math.floor(currentDate.getTime() / (1000 * 60 * 60 * 24))
      
      // Website events (2-5 per day) - deterministic based on day
      const websiteEvents = Math.floor(seededRandom(daysSinceEpoch * 1000) * 4) + 2
      for (let j = 0; j < websiteEvents; j++) {
        const eventDate = new Date(currentDate)
        const hour = Math.floor(seededRandom(daysSinceEpoch * 1000 + j * 10) * 24)
        const minute = Math.floor(seededRandom(daysSinceEpoch * 1000 + j * 10 + 1) * 60)
        eventDate.setHours(hour, minute)
        
        const websiteActivities = [
          'Viewed lot A-12', 'Downloaded brochure', 'Viewed pricing page', 'Used mortgage calculator',
          'Browsed gallery', 'Viewed lot B-07', 'Viewed contact page', 'Checked amenities',
          'Looked at floor plans', 'Used map feature', 'Read testimonials', 'Viewed FAQ'
        ]
        
        events.push({
          id: `web-${i}-${j}`,
          timestamp: eventDate.toISOString(),
          channel: 'website' as const,
          eventType: seededRandom(daysSinceEpoch * 1000 + j * 100) > 0.8 ? 'sales_outreach' as const : 'customer_engagement' as const,
          description: websiteActivities[Math.floor(seededRandom(daysSinceEpoch * 1000 + j * 100 + 2) * websiteActivities.length)],
          intensity: Math.floor(seededRandom(daysSinceEpoch * 1000 + j * 100 + 3) * 6) + 4,
          outcome: seededRandom(daysSinceEpoch * 1000 + j * 100 + 4) > 0.7 ? 'positive' as const : seededRandom(daysSinceEpoch * 1000 + j * 100 + 5) > 0.3 ? 'neutral' as const : 'negative' as const
        })
      }
      
      // Phone events (0-3 per day)
      const phoneEvents = Math.floor(seededRandom(daysSinceEpoch * 2000) * 4)
      for (let j = 0; j < phoneEvents; j++) {
        const eventDate = new Date(currentDate)
        const hour = Math.floor(seededRandom(daysSinceEpoch * 2000 + j * 10) * 12) + 9 // Business hours
        eventDate.setHours(hour)
        
        const phoneActivities = [
          'Clicked phone number', 'Scheduled call back', 'Cold outreach call', 'Follow-up call',
          'Consultation call', 'Site visit scheduling', 'Price inquiry call', 'Availability check'
        ]
        
        events.push({
          id: `phone-${i}-${j}`,
          timestamp: eventDate.toISOString(),
          channel: 'phone' as const,
          eventType: seededRandom(daysSinceEpoch * 2000 + j * 100) > 0.4 ? 'sales_outreach' as const : 'customer_engagement' as const,
          description: phoneActivities[Math.floor(seededRandom(daysSinceEpoch * 2000 + j * 100 + 2) * phoneActivities.length)],
          intensity: Math.floor(seededRandom(daysSinceEpoch * 2000 + j * 100 + 3) * 5) + 5,
          outcome: seededRandom(daysSinceEpoch * 2000 + j * 100 + 4) > 0.6 ? 'positive' as const : seededRandom(daysSinceEpoch * 2000 + j * 100 + 5) > 0.2 ? 'neutral' as const : 'negative' as const
        })
      }
      
      // Email events (1-3 per day)
      const emailEvents = Math.floor(seededRandom(daysSinceEpoch * 3000) * 3) + 1
      for (let j = 0; j < emailEvents; j++) {
        const eventDate = new Date(currentDate)
        const hour = Math.floor(seededRandom(daysSinceEpoch * 3000 + j * 10) * 24)
        const minute = Math.floor(seededRandom(daysSinceEpoch * 3000 + j * 10 + 1) * 60)
        eventDate.setHours(hour, minute)
        
        const emailActivities = [
          'Opened email', 'Clicked email link', 'Replied to email', 'Newsletter sent',
          'Property recommendation sent', 'Follow-up email', 'Welcome email', 'Market update'
        ]
        
        events.push({
          id: `email-${i}-${j}`,
          timestamp: eventDate.toISOString(),
          channel: 'email' as const,
          eventType: seededRandom(daysSinceEpoch * 3000 + j * 100) > 0.5 ? 'sales_outreach' as const : 'customer_engagement' as const,
          description: emailActivities[Math.floor(seededRandom(daysSinceEpoch * 3000 + j * 100 + 2) * emailActivities.length)],
          intensity: Math.floor(seededRandom(daysSinceEpoch * 3000 + j * 100 + 3) * 4) + 3,
          outcome: seededRandom(daysSinceEpoch * 3000 + j * 100 + 4) > 0.7 ? 'positive' as const : seededRandom(daysSinceEpoch * 3000 + j * 100 + 5) > 0.3 ? 'neutral' as const : 'negative' as const
        })
      }
    }
    
    return events.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
  }



  const timeFilterOptions: { value: TimeFilterOption; label: string }[] = [
    { value: 'day', label: 'Day' },
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
    { value: 'year', label: 'Year' }
  ]

  // Regenerate data when time filter changes
  const currentData = useMemo(() => {
    const currentDateRange = getDateRange(selectedTimeFilter)
    return {
      dateRange: currentDateRange,
      totalEvents: 0,
      channels: [
        { id: 'website', label: 'Website', color: '#3b82f6' },
        { id: 'phone', label: 'Phone', color: '#10b981' },
        { id: 'email', label: 'Email', color: '#f59e0b' }
      ],
      events: generateMockEvents(currentDateRange)
    }
  }, [selectedTimeFilter])

  // Filter events based on selected filters
  const filteredEvents = useMemo(() => {
    return currentData.events.filter(event => 
      selectedChannels.has(event.channel) && 
      selectedEventTypes.has(event.eventType)
    )
  }, [currentData.events, selectedChannels, selectedEventTypes])

  // Get aggregation function based on time filter
  const getAggregationValue = (date: Date, filter: TimeFilterOption) => {
    switch (filter) {
      case 'day':
        // Show hours (0-23) for day view
        return date.getHours()
      case 'week':
        // Show day of week (0-6, Sunday to Saturday)
        return date.getDay()
      case 'month':
        // Show date of month (1-31)
        return date.getDate()
      case 'year':
        // Show month (0-11)
        return date.getMonth()
      default:
        return date.getTime()
    }
  }

  // Format aggregation labels
  const formatAggregationLabel = (value: number, filter: TimeFilterOption) => {
    switch (filter) {
      case 'day':
        return `${value}:00`
      case 'week':
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        return days[value] || ''
      case 'month':
        return value.toString()
      case 'year':
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        return months[value] || ''
      default:
        return value.toString()
    }
  }

  // Get aggregation domain
  const getAggregationDomain = (filter: TimeFilterOption) => {
    switch (filter) {
      case 'day':
        return [0, 23] // 24 hours
      case 'week':
        return [0, 6] // 7 days
      case 'month':
        return [1, 31] // 31 days max
      case 'year':
        return [0, 11] // 12 months
      default:
        return ['dataMin', 'dataMax']
    }
  }

  // Get aggregation ticks
  const getAggregationTicks = (filter: TimeFilterOption) => {
    switch (filter) {
      case 'day':
        return [0, 6, 12, 18, 23] // Key hours
      case 'week':
        return [0, 1, 2, 3, 4, 5, 6] // All days
      case 'month':
        return [1, 5, 10, 15, 20, 25, 31] // Sample dates
      case 'year':
        return [0, 2, 4, 6, 8, 10, 11] // Sample months
      default:
        return undefined
    }
  }

  // Transform events for scatter plot with aggregation
  const scatterData = useMemo(() => {
    return filteredEvents.map(event => {
      const date = new Date(event.timestamp)
      const channelIndex = currentData.channels.findIndex(c => c.id === event.channel)
      const aggregationValue = getAggregationValue(date, selectedTimeFilter)
      
      // Use different shapes/styles for event types
      const isCustomerEngagement = event.eventType === 'customer_engagement'
      const baseSize = 6 // Fixed size for all dots
      
      return {
        x: aggregationValue,
        y: { channelIndex, isCustomerEngagement }, // Store both values for Y positioning
        size: baseSize,
        color: currentData.channels[channelIndex]?.color || '#6b7280',
        event: event,
        formattedDate: date.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: '2-digit', 
          day: '2-digit' 
        }),
        formattedTime: date.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit', 
          hour12: false 
        }),
        isCustomerEngagement,
        aggregationLabel: formatAggregationLabel(aggregationValue, selectedTimeFilter)
      }
    })
  }, [filteredEvents, currentData.channels, selectedTimeFilter])

  // Scaling functions for custom chart
  const getXScale = useCallback((containerWidth: number) => {
    const plotWidth = containerWidth - margin.left - margin.right
    const domain = getAggregationDomain(selectedTimeFilter)
    const [min, max] = Array.isArray(domain) ? [Number(domain[0]), Number(domain[1])] : [0, 1]
    return (value: number) => ((value - min) / (max - min)) * plotWidth
  }, [selectedTimeFilter, margin.left, margin.right])

  const getYScale = useCallback(() => {
    const channelCount = currentData.channels.length
    // Each channel now has 2 lines: customer (top) and sales (bottom)
    const totalLines = channelCount * 2
    return (channelIndex: number, isCustomerEngagement: boolean) => {
      // Customer line is at the top of each channel pair, sales line at bottom
      const lineIndex = channelIndex * 2 + (isCustomerEngagement ? 0 : 1)
      return plotHeight - ((lineIndex + 0.5) / totalLines) * plotHeight
    }
  }, [currentData.channels.length, plotHeight])

  // Mouse event handlers
  const handleMouseMove = useCallback((event: React.MouseEvent<SVGSVGElement>) => {
    if (svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect()
      setMousePosition({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      })
    }
  }, [])

  const handleMouseLeave = useCallback(() => {
    setHoveredEvent(null)
  }, [])

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'website': return <Globe className="w-4 h-4" />
      case 'phone': return <Phone className="w-4 h-4" />
      case 'email': return <Mail className="w-4 h-4" />
      default: return <Globe className="w-4 h-4" />
    }
  }



  const toggleChannel = (channelId: string) => {
    const newChannels = new Set(selectedChannels)
    if (newChannels.has(channelId)) {
      newChannels.delete(channelId)
    } else {
      newChannels.add(channelId)
    }
    setSelectedChannels(newChannels)
  }

  const toggleEventType = (eventType: string) => {
    const newEventTypes = new Set(selectedEventTypes)
    if (newEventTypes.has(eventType)) {
      newEventTypes.delete(eventType)
    } else {
      newEventTypes.add(eventType)
    }
    setSelectedEventTypes(newEventTypes)
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Activity Timeline
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Customer engagement and sales outreach across all channels
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-slate-500 dark:text-slate-400">
            {filteredEvents.length} events
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
        {/* Time Filter */}
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-slate-500" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Time:</span>
          <div className="flex space-x-1">
            {timeFilterOptions.map(option => (
              <button
                key={option.value}
                onClick={() => setSelectedTimeFilter(option.value)}
                className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                  selectedTimeFilter === option.value
                    ? 'bg-blue-500 text-white'
                    : 'bg-white dark:bg-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-500'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Channel Filter */}
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Channels:</span>
          <div className="flex space-x-1">
            {currentData.channels.map(channel => (
              <button
                key={channel.id}
                onClick={() => toggleChannel(channel.id)}
                className={`flex items-center space-x-1 px-3 py-1 text-xs rounded-lg transition-colors ${
                  selectedChannels.has(channel.id)
                    ? 'text-white'
                    : 'bg-white dark:bg-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-500'
                }`}
                style={{
                  backgroundColor: selectedChannels.has(channel.id) ? channel.color : undefined
                }}
              >
                {getChannelIcon(channel.id)}
                <span>{channel.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Event Type Filter */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Type:</span>
          <div className="flex space-x-1">
            <button
              onClick={() => toggleEventType('customer_engagement')}
              className={`flex items-center space-x-1 px-3 py-1 text-xs rounded-lg transition-colors ${
                selectedEventTypes.has('customer_engagement')
                  ? 'bg-purple-500 text-white'
                  : 'bg-white dark:bg-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-500'
              }`}
            >
              <div className="w-2 h-2 rounded-full border-2 border-current"></div>
              <span>Customer</span>
            </button>
            <button
              onClick={() => toggleEventType('sales_outreach')}
              className={`flex items-center space-x-1 px-3 py-1 text-xs rounded-lg transition-colors ${
                selectedEventTypes.has('sales_outreach')
                  ? 'bg-green-500 text-white'
                  : 'bg-white dark:bg-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-500'
              }`}
            >
              <div className="w-2 h-2 rounded-full bg-current"></div>
              <span>Sales</span>
            </button>
          </div>
        </div>
      </div>

      {/* Custom SVG Scatter Plot */}
      <div className="relative w-full">
        <svg
          ref={svgRef}
          width="100%"
          height={chartHeight}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="overflow-visible"
          preserveAspectRatio="none"
        >
          {(() => {
            // Get current SVG width dynamically
            const currentWidth = svgRef.current?.getBoundingClientRect().width || 800
            const plotWidth = currentWidth - margin.left - margin.right
            const xScale = getXScale(currentWidth)
            
            return (
              <>
                {/* Grid lines */}
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-slate-200 dark:text-slate-700" opacity="0.3"/>
                  </pattern>
                </defs>
                
                {/* Background grid */}
                <rect x={margin.left} y={margin.top} width={plotWidth} height={plotHeight} fill="url(#grid)" />
                
                {/* Y-axis labels and lines (channels with customer/sales split) */}
                {currentData.channels.map((channel, channelIndex) => {
                  const customerY = margin.top + getYScale()(channelIndex, true)
                  const salesY = margin.top + getYScale()(channelIndex, false)
                  
                  return (
                    <g key={channel.id}>
                      {/* Customer engagement line (top) */}
                      <line
                        x1={margin.left}
                        y1={customerY}
                        x2={margin.left + plotWidth}
                        y2={customerY}
                        stroke={channel.color}
                        strokeWidth="1"
                        opacity="0.4"
                        strokeDasharray="2,2"
                      />
                      
                      {/* Sales outreach line (bottom) */}
                      <line
                        x1={margin.left}
                        y1={salesY}
                        x2={margin.left + plotWidth}
                        y2={salesY}
                        stroke={channel.color}
                        strokeWidth="2"
                        opacity="0.6"
                      />
                      
                      {/* Channel label (centered between the two lines) */}
                      <text
                        x={margin.left - 10}
                        y={(customerY + salesY) / 2 + 4}
                        textAnchor="end"
                        className="text-sm font-medium fill-slate-600 dark:fill-slate-400"
                      >
                        {channel.label}
                      </text>
                      
                      {/* Customer/Sales sublabels */}
                      <text
                        x={margin.left - 45}
                        y={customerY + 3}
                        textAnchor="end"
                        className="text-xs fill-slate-500 dark:fill-slate-500"
                      >
                        Customer
                      </text>
                      <text
                        x={margin.left - 45}
                        y={salesY + 3}
                        textAnchor="end"
                        className="text-xs fill-slate-500 dark:fill-slate-500"
                      >
                        Sales
                      </text>
                    </g>
                  )
                })}
                
                {/* X-axis */}
                <line
                  x1={margin.left}
                  y1={margin.top + plotHeight}
                  x2={margin.left + plotWidth}
                  y2={margin.top + plotHeight}
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-slate-400 dark:text-slate-600"
                />
                
                {/* X-axis ticks and labels */}
                {getAggregationTicks(selectedTimeFilter)?.map((tick, index) => {
                  const x = margin.left + xScale(tick)
                  const label = formatAggregationLabel(tick, selectedTimeFilter)
                  return (
                    <g key={index}>
                      <line
                        x1={x}
                        y1={margin.top + plotHeight}
                        x2={x}
                        y2={margin.top + plotHeight + 6}
                        stroke="currentColor"
                        strokeWidth="1"
                        className="text-slate-400 dark:text-slate-600"
                      />
                      <text
                        x={x}
                        y={margin.top + plotHeight + 20}
                        textAnchor="middle"
                        className="text-xs fill-slate-600 dark:fill-slate-400"
                        transform={selectedTimeFilter === 'day' ? '' : `rotate(-45, ${x}, ${margin.top + plotHeight + 20})`}
                      >
                        {label}
                      </text>
                    </g>
                  )
                })}
                
                {/* Data points */}
                {scatterData.map((point, index) => {
                  const x = margin.left + xScale(point.x)
                  const y = margin.top + getYScale()(point.y.channelIndex, point.y.isCustomerEngagement)
                  const radius = 6 // Fixed radius for consistent dot size
                  
                  if (point.isCustomerEngagement) {
                    // Customer engagement: hollow circle with thicker border
                    return (
                      <circle
                        key={index}
                        cx={x}
                        cy={y}
                        r={radius}
                        fill="none"
                        stroke={point.color}
                        strokeWidth="3"
                        className="cursor-pointer hover:stroke-[4px] transition-all duration-200"
                        onMouseEnter={() => setHoveredEvent(point)}
                        onMouseLeave={() => setHoveredEvent(null)}
                      />
                    )
                  } else {
                    // Sales outreach: filled circle
                    return (
                      <circle
                        key={index}
                        cx={x}
                        cy={y}
                        r={radius}
                        fill={point.color}
                        stroke={point.color}
                        strokeWidth="1"
                        fillOpacity="0.9"
                        className="cursor-pointer hover:opacity-100 transition-all duration-200"
                        onMouseEnter={() => setHoveredEvent(point)}
                        onMouseLeave={() => setHoveredEvent(null)}
                      />
                    )
                  }
                })}
              </>
            )
          })()}
        </svg>
        
        {/* Custom Tooltip */}
        {hoveredEvent && (
          <div
            className="absolute pointer-events-none z-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 shadow-lg max-w-xs"
            style={{
              left: mousePosition.x + 10,
              top: mousePosition.y - 10,
              transform: mousePosition.x > (svgRef.current?.getBoundingClientRect().width || 800) - 200 ? 'translateX(-100%)' : 'translateX(0)'
            }}
          >
            <div className="flex items-center space-x-2 mb-2">
              {getChannelIcon(hoveredEvent.event.channel)}
              <span className="font-medium text-slate-900 dark:text-slate-100">
                {currentData.channels.find(c => c.id === hoveredEvent.event.channel)?.label}
              </span>
              <div className={`w-2 h-2 rounded-full ${hoveredEvent.isCustomerEngagement ? 'border-2 border-slate-400' : 'bg-slate-400'}`}></div>
              <span className="text-xs text-slate-500">
                {hoveredEvent.isCustomerEngagement ? 'Customer' : 'Sales'}
              </span>
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">
              {hoveredEvent.event.description}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {hoveredEvent.formattedDate} at {hoveredEvent.formattedTime}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {selectedTimeFilter.charAt(0).toUpperCase() + selectedTimeFilter.slice(1)}: {hoveredEvent.aggregationLabel}
            </div>
          </div>
        )}
      </div>

      {/* Alerts & Notifications */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Customers Waiting for Response */}
        <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-red-900 dark:text-red-100">⚠️ Waiting for Response</h3>
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
          </div>
          <div className="text-2xl font-bold text-red-900 dark:text-red-100 mb-1">
            {(() => {
              const customerEvents = filteredEvents.filter(e => e.eventType === 'customer_engagement')
              const salesEvents = filteredEvents.filter(e => e.eventType === 'sales_outreach')
              const unansweredCustomers = customerEvents.filter(customerEvent => {
                const customerTime = new Date(customerEvent.timestamp).getTime()
                const hasResponse = salesEvents.some(salesEvent => {
                  const salesTime = new Date(salesEvent.timestamp).getTime()
                  return salesTime > customerTime && salesEvent.channel === customerEvent.channel
                })
                return !hasResponse
              })
              return unansweredCustomers.length
            })()}
          </div>
          <p className="text-xs text-red-700 dark:text-red-300">
            Customer actions without follow-up
          </p>
        </div>

        {/* Long Response Times */}
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-orange-900 dark:text-orange-100">⏰ Delayed Responses</h3>
            <div className="w-2 h-2 rounded-full bg-orange-500"></div>
          </div>
          <div className="text-2xl font-bold text-orange-900 dark:text-orange-100 mb-1">
            {(() => {
              const customerEvents = filteredEvents.filter(e => e.eventType === 'customer_engagement')
              const salesEvents = filteredEvents.filter(e => e.eventType === 'sales_outreach')
              const slowResponses = customerEvents.filter(customerEvent => {
                const customerTime = new Date(customerEvent.timestamp).getTime()
                const nextResponse = salesEvents.find(salesEvent => {
                  const salesTime = new Date(salesEvent.timestamp).getTime()
                  return salesTime > customerTime && salesEvent.channel === customerEvent.channel
                })
                
                if (nextResponse) {
                  const responseTime = new Date(nextResponse.timestamp).getTime()
                  const delay = (responseTime - customerTime) / (1000 * 60 * 60) // hours
                  return delay > 4 // More than 4 hours
                }
                return false
              })
              return slowResponses.length
            })()}
          </div>
          <p className="text-xs text-orange-700 dark:text-orange-300">
            Responses taking &gt;4 hours
          </p>
        </div>

        {/* Website Personalization Opportunities */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100">🎯 Personalization Opps</h3>
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
          </div>
          <div className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-1">
            {(() => {
              const websiteEvents = filteredEvents.filter(e => e.channel === 'website' && e.eventType === 'customer_engagement')
              // High-intent actions that should trigger personalization
              const highIntentEvents = websiteEvents.filter(event => 
                event.description.includes('Downloaded brochure') || 
                event.description.includes('mortgage calculator') ||
                event.description.includes('pricing page') ||
                event.description.includes('Viewed lot')
              )
              
              // Check if there was a follow-up sales action
              const missedOpportunities = highIntentEvents.filter(event => {
                const eventTime = new Date(event.timestamp).getTime()
                const hasPersonalization = filteredEvents.some(salesEvent => 
                  salesEvent.eventType === 'sales_outreach' && 
                  salesEvent.channel === 'website' &&
                  new Date(salesEvent.timestamp).getTime() > eventTime &&
                  new Date(salesEvent.timestamp).getTime() - eventTime < 30 * 60 * 1000 // within 30 minutes
                )
                return !hasPersonalization
              })
              
              return missedOpportunities.length
            })()}
          </div>
          <p className="text-xs text-blue-700 dark:text-blue-300">
            High-intent actions without targeting
          </p>
        </div>

        {/* Critical Follow-up Needed */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-purple-900 dark:text-purple-100">🚨 Critical Follow-ups</h3>
            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
          </div>
          <div className="text-2xl font-bold text-purple-900 dark:text-purple-100 mb-1">
            {(() => {
              const now = new Date().getTime()
              const customerEvents = filteredEvents.filter(e => e.eventType === 'customer_engagement')
              const criticalEvents = customerEvents.filter(event => {
                const eventTime = new Date(event.timestamp).getTime()
                const hoursSince = (now - eventTime) / (1000 * 60 * 60)
                
                // Critical if it's been more than 24 hours with no sales follow-up
                if (hoursSince > 24) {
                  const hasFollowUp = filteredEvents.some(salesEvent => 
                    salesEvent.eventType === 'sales_outreach' && 
                    salesEvent.channel === event.channel &&
                    new Date(salesEvent.timestamp).getTime() > eventTime
                  )
                  return !hasFollowUp
                }
                return false
              })
              return criticalEvents.length
            })()}
          </div>
          <p className="text-xs text-purple-700 dark:text-purple-300">
            &gt;24h without sales contact
          </p>
        </div>
      </div>

    </div>
  )
}
