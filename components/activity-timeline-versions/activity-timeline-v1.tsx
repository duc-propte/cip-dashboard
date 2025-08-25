"use client"

import { useState, useMemo, useCallback } from "react"
import { Globe, Phone, Mail, ChevronLeft, ChevronRight, Activity } from "lucide-react"

interface PropertyDetails {
  propertyId: string
  propertyName: string
  price: number
  size: number
  bedrooms?: number
  bathrooms?: number
  location: string
  type: 'residential' | 'commercial' | 'land'
}

interface ActivityEvent {
  id: string
  title: string
  subtitle: string
  channel: string
  actor: 'customer' | 'sales'
  startDate: Date
  endDate: Date
  description: string
  outcome: 'positive' | 'neutral' | 'negative'
  details: string
  assignees: string[]
  propertyDetails?: PropertyDetails
  additionalInfo?: {
    duration?: string
    viewCount?: number
    actionType?: string
    responseTime?: string
    engagement?: string
  }
  allEventsForDate?: ActivityEvent[]
}

export default function ActivityTimelineV1() {
  const [selectedTimeFilter, setSelectedTimeFilter] = useState<'day' | 'week' | 'month'>('day')
  const [hoveredEvent, setHoveredEvent] = useState<ActivityEvent | null>(null)
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 })
  const [expandedDate, setExpandedDate] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [eventsPerPage] = useState(10)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedChannels, setSelectedChannels] = useState<string[]>([])
  const [selectedActors, setSelectedActors] = useState<string[]>([])

  const [currentDate, setCurrentDate] = useState(() => new Date(2025, 7, 20)) // August 20, 2025

  // Generate date columns for the timeline
  const generateDateColumns = () => {
    const columns = []
    
    if (selectedTimeFilter === 'day') {
      // Show 24 hours of the selected day
      const dayStart = new Date(currentDate)
      dayStart.setHours(0, 0, 0, 0)
      
      for (let i = 0; i < 24; i++) {
        const hour = new Date(dayStart)
        hour.setHours(i)
        columns.push(hour)
      }
    } else if (selectedTimeFilter === 'week') {
      // Show 7 days of current week (Sunday to Saturday)
      const weekStart = new Date(currentDate)
      weekStart.setDate(currentDate.getDate() - currentDate.getDay())
      weekStart.setHours(0, 0, 0, 0)
      
      for (let i = 0; i < 7; i++) {
        const date = new Date(weekStart)
        date.setDate(weekStart.getDate() + i)
        columns.push(date)
      }
    } else if (selectedTimeFilter === 'month') {
      // Show current month - 4 weeks (28 days) starting from the first day of the month
      const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
      
      for (let i = 0; i < 28; i++) {
        const date = new Date(monthStart)
        date.setDate(monthStart.getDate() + i)
        columns.push(date)
      }
    }
    
    return columns
  }

  const dateColumns = generateDateColumns()

  // Generate mock timeline events
  const generateTimelineEvents = useCallback(() => {
    const events: ActivityEvent[] = []
    
    // Customer event: August 20, 2025, 6PM to 7PM
    const customerEventStartDate = new Date(2025, 7, 20, 18, 0, 0) // Month is 0-indexed, so 7 = August
    const customerEventEndDate = new Date(2025, 7, 20, 19, 0, 0)   // 7PM
    
    const customerEventData = {
      id: 'website-visit-customer-aug20',
      title: "Website visit",
      subtitle: "Product browsing",
      channel: "website",
      actor: "customer" as const,
      startDate: customerEventStartDate,
      endDate: customerEventEndDate,
      description: "Customer activity on website",
      outcome: "positive" as const,
      details: "Duration: 1 hour. Customer-initiated activity.",
      assignees: ['JD', 'AB', 'CD'],
      additionalInfo: {
        duration: "1 hour",
        actionType: "browsing",
        engagement: "high"
      }
    }

    // Sales event: August 20, 2025, 2PM to 3PM
    const salesEventStartDate = new Date(2025, 7, 20, 14, 0, 0) // 2PM same day
    const salesEventEndDate = new Date(2025, 7, 20, 15, 0, 0)   // 3PM
    
    const salesEventData = {
      id: 'website-update-sales-aug20',
      title: "Content update",
      subtitle: "Product information",
      channel: "website",
      actor: "sales" as const,
      startDate: salesEventStartDate,
      endDate: salesEventEndDate,
      description: "Sales team activity on website",
      outcome: "positive" as const,
      details: "Duration: 1 hour. Sales-driven activity.",
      assignees: ['AB', 'CD'],
      additionalInfo: {
        duration: "1 hour",
        actionType: "content update",
        responseTime: "immediate"
      }
    }

    // New events: User viewed lot A01 3 times from 12:01-12:03 PM
    const lotViewingEvents = [
      {
        id: 'lot-view-1-aug20',
        title: "Waurn Ponds Lot 47 view",
        subtitle: "Land viewing",
        channel: "website",
        actor: "customer" as const,
        startDate: new Date(2025, 7, 20, 12, 1, 0), // 12:01 PM
        endDate: new Date(2025, 7, 20, 12, 1, 30),   // 12:01:30 PM
        description: "Customer viewed Waurn Ponds Lot 47",
        outcome: "positive" as const,
        details: "First viewing of Waurn Ponds Lot 47. Customer-initiated activity.",
        assignees: ['JD'],
        propertyDetails: {
          propertyId: "47",
          propertyName: "Waurn Ponds Estate Lot 47",
          price: 502000,
          size: 720,
          location: "Waurn Ponds, Geelong VIC",
          type: "land" as const
        },
        additionalInfo: {
          duration: "30 seconds",
          viewCount: 1,
          actionType: "property viewing",
          engagement: "interested"
        }
      },
      {
        id: 'lot-view-2-aug20',
        title: "Waurn Ponds Lot 47 view",
        subtitle: "Land viewing",
        channel: "website",
        actor: "customer" as const,
        startDate: new Date(2025, 7, 20, 12, 2, 0), // 12:02 PM
        endDate: new Date(2025, 7, 20, 12, 2, 45),   // 12:02:45 PM
        description: "Customer viewed Waurn Ponds Lot 47 again",
        outcome: "positive" as const,
        details: "Second viewing of Waurn Ponds Lot 47. Customer-initiated activity.",
        assignees: ['JD'],
        propertyDetails: {
          propertyId: "47",
          propertyName: "Waurn Ponds Estate Lot 47",
          price: 502000,
          size: 720,
          location: "Waurn Ponds, Geelong VIC",
          type: "land" as const
        },
        additionalInfo: {
          duration: "45 seconds",
          viewCount: 2,
          actionType: "property viewing",
          engagement: "very interested"
        }
      },
      {
        id: 'lot-view-3-aug20',
        title: "Waurn Ponds Lot 47 view",
        subtitle: "Land viewing",
        channel: "website",
        actor: "customer" as const,
        startDate: new Date(2025, 7, 20, 12, 3, 0), // 12:03 PM
        endDate: new Date(2025, 7, 20, 12, 3, 20),   // 12:03:20 PM
        description: "Customer viewed lot A01 third time",
        outcome: "positive" as const,
        details: "Third viewing of lot A01. Customer-initiated activity.",
        assignees: ['JD'],
        propertyDetails: {
          propertyId: "47",
          propertyName: "Waurn Ponds Estate Lot 47",
          price: 502000,
          size: 720,
          location: "Waurn Ponds, Geelong VIC",
          type: "land" as const
        },
        additionalInfo: {
          duration: "20 seconds",
          viewCount: 3,
          actionType: "property viewing",
          engagement: "highly interested"
        }
      }
    ]

    // Sales email event: Follow-up email about lot A01 after customer viewings
    const salesEmailEvent = {
      id: 'lot-a01-email-sales-aug20',
      title: "Lot A01 email",
      subtitle: "Follow-up inquiry",
      channel: "email",
      actor: "sales" as const,
      startDate: new Date(2025, 7, 20, 12, 15, 0), // 12:15 PM
      endDate: new Date(2025, 7, 20, 12, 15, 30),   // 12:15:30 PM
      description: "Sales team sent email about lot A01",
      outcome: "positive" as const,
      details: "Follow-up email sent after detecting customer interest in lot A01.",
      assignees: ['AB', 'JD'],
      propertyDetails: {
        propertyId: "A01",
        propertyName: "Sunset Ridge Lot A01",
        price: 450000,
        size: 8500,
        location: "Sunset Ridge, West Valley",
        type: "land" as const
      },
      additionalInfo: {
        duration: "30 seconds",
        actionType: "follow-up email",
        responseTime: "12 minutes",
        engagement: "proactive outreach"
      }
    }

    // August 21st events - 20 events from 10am to 3pm
    const aug21Events = [
      // 10:00 AM - Customer website visit
      {
        id: 'website-visit-customer-aug21-1',
        title: "Website visit",
        subtitle: "Homepage browsing",
        channel: "website",
        actor: "customer" as const,
        startDate: new Date(2025, 7, 21, 10, 0, 0),
        endDate: new Date(2025, 7, 21, 10, 15, 0),
        description: "Customer browsed homepage and navigation",
        outcome: "neutral" as const,
        details: "Initial website exploration session",
        assignees: ['JD'],
        additionalInfo: {
          duration: "15 minutes",
          actionType: "browsing",
          engagement: "exploratory"
        }
      },
      // 10:15 AM - Sales phone call
      {
        id: 'phone-call-sales-aug21-1',
        title: "Outbound call",
        subtitle: "Lead qualification",
        channel: "phone",
        actor: "sales" as const,
        startDate: new Date(2025, 7, 21, 10, 15, 0),
        endDate: new Date(2025, 7, 21, 10, 30, 0),
        description: "Sales team called potential customer",
        outcome: "positive" as const,
        details: "Successful contact with interested prospect",
        assignees: ['AB'],
        additionalInfo: {
          duration: "15 minutes",
          actionType: "outbound call",
          responseTime: "immediate",
          engagement: "interested prospect"
        }
      },
      // 10:30 AM - Customer property view
      {
        id: 'property-view-customer-aug21-1',
        title: "Property B15 view",
        subtitle: "Residential browsing",
        channel: "website",
        actor: "customer" as const,
        startDate: new Date(2025, 7, 21, 10, 30, 0),
        endDate: new Date(2025, 7, 21, 10, 32, 0),
        description: "Customer viewed residential property B15",
        outcome: "positive" as const,
        details: "Extended viewing time indicates interest",
        assignees: ['JD'],
        propertyDetails: {
          propertyId: "B15",
          propertyName: "Greenwood Heights B15",
          price: 750000,
          size: 2400,
          bedrooms: 4,
          bathrooms: 3,
          location: "Greenwood Heights, North District",
          type: "residential" as const
        },
        additionalInfo: {
          duration: "2 minutes",
          viewCount: 1,
          actionType: "property viewing",
          engagement: "interested"
        }
      },
      // 10:45 AM - Customer email inquiry
      {
        id: 'email-inquiry-customer-aug21-1',
        title: "Property inquiry",
        subtitle: "Information request",
        channel: "email",
        actor: "customer" as const,
        startDate: new Date(2025, 7, 21, 10, 45, 0),
        endDate: new Date(2025, 7, 21, 10, 45, 30),
        description: "Customer sent inquiry about property B15",
        outcome: "positive" as const,
        details: "Detailed questions about financing and availability",
        assignees: ['JD', 'AB'],
        propertyDetails: {
          propertyId: "B15",
          propertyName: "Greenwood Heights B15",
          price: 750000,
          size: 2400,
          bedrooms: 4,
          bathrooms: 3,
          location: "Greenwood Heights, North District",
          type: "residential" as const
        },
        additionalInfo: {
          actionType: "email inquiry",
          engagement: "very interested"
        }
      },
      // 11:00 AM - Sales email response
      {
        id: 'email-response-sales-aug21-1',
        title: "Property details",
        subtitle: "Information provided",
        channel: "email",
        actor: "sales" as const,
        startDate: new Date(2025, 7, 21, 11, 0, 0),
        endDate: new Date(2025, 7, 21, 11, 5, 0),
        description: "Sales team responded with property details",
        outcome: "positive" as const,
        details: "Comprehensive response with financing options",
        assignees: ['AB'],
        propertyDetails: {
          propertyId: "B15",
          propertyName: "Greenwood Heights B15",
          price: 750000,
          size: 2400,
          bedrooms: 4,
          bathrooms: 3,
          location: "Greenwood Heights, North District",
          type: "residential" as const
        },
        additionalInfo: {
          duration: "5 minutes",
          actionType: "email response",
          responseTime: "15 minutes",
          engagement: "detailed information"
        }
      },
      // 11:15 AM - Customer website search
      {
        id: 'website-search-customer-aug21-1',
        title: "Property search",
        subtitle: "Filter browsing",
        channel: "website",
        actor: "customer" as const,
        startDate: new Date(2025, 7, 21, 11, 15, 0),
        endDate: new Date(2025, 7, 21, 11, 25, 0),
        description: "Customer used search filters for properties",
        outcome: "positive" as const,
        details: "Searched for 3-4 bedroom homes under $800k",
        assignees: ['JD'],
        additionalInfo: {
          duration: "10 minutes",
          actionType: "property search",
          engagement: "active searching"
        }
      },
      // 11:30 AM - Customer phone call
      {
        id: 'phone-call-customer-aug21-1',
        title: "Inbound inquiry",
        subtitle: "Scheduling request",
        channel: "phone",
        actor: "customer" as const,
        startDate: new Date(2025, 7, 21, 11, 30, 0),
        endDate: new Date(2025, 7, 21, 11, 45, 0),
        description: "Customer called to schedule property viewing",
        outcome: "positive" as const,
        details: "Requested viewing for property B15 this weekend",
        assignees: ['AB'],
        propertyDetails: {
          propertyId: "B15",
          propertyName: "Greenwood Heights B15",
          price: 750000,
          size: 2400,
          bedrooms: 4,
          bathrooms: 3,
          location: "Greenwood Heights, North District",
          type: "residential" as const
        },
        additionalInfo: {
          duration: "15 minutes",
          actionType: "scheduling call",
          engagement: "ready to view"
        }
      },
      // 11:45 AM - Sales CRM update
      {
        id: 'website-update-sales-aug21-1',
        title: "CRM update",
        subtitle: "Lead management",
        channel: "website",
        actor: "sales" as const,
        startDate: new Date(2025, 7, 21, 11, 45, 0),
        endDate: new Date(2025, 7, 21, 11, 50, 0),
        description: "Sales team updated customer profile and notes",
        outcome: "positive" as const,
        details: "Added viewing appointment and customer preferences",
        assignees: ['AB'],
        additionalInfo: {
          duration: "5 minutes",
          actionType: "CRM update",
          engagement: "lead management"
        }
      },
      // 12:00 PM - Customer property view
      {
        id: 'property-view-customer-aug21-2',
        title: "Property C22 view",
        subtitle: "Commercial browsing",
        channel: "website",
        actor: "customer" as const,
        startDate: new Date(2025, 7, 21, 12, 0, 0),
        endDate: new Date(2025, 7, 21, 12, 3, 0),
        description: "Customer viewed commercial property C22",
        outcome: "neutral" as const,
        details: "Brief viewing of commercial space",
        assignees: ['CD'],
        propertyDetails: {
          propertyId: "C22",
          propertyName: "Downtown Plaza C22",
          price: 1200000,
          size: 3500,
          location: "Downtown Business District",
          type: "commercial" as const
        },
        additionalInfo: {
          duration: "3 minutes",
          viewCount: 1,
          actionType: "property viewing",
          engagement: "browsing"
        }
      },
      // 12:15 PM - Sales email campaign
      {
        id: 'email-campaign-sales-aug21-1',
        title: "Newsletter send",
        subtitle: "Market updates",
        channel: "email",
        actor: "sales" as const,
        startDate: new Date(2025, 7, 21, 12, 15, 0),
        endDate: new Date(2025, 7, 21, 12, 20, 0),
        description: "Sales team sent monthly market newsletter",
        outcome: "positive" as const,
        details: "Market trends and new property listings",
        assignees: ['CD', 'EF'],
        additionalInfo: {
          duration: "5 minutes",
          actionType: "newsletter",
          engagement: "marketing outreach"
        }
      },
      // 12:30 PM - Customer website comparison
      {
        id: 'website-compare-customer-aug21-1',
        title: "Property comparison",
        subtitle: "Feature analysis",
        channel: "website",
        actor: "customer" as const,
        startDate: new Date(2025, 7, 21, 12, 30, 0),
        endDate: new Date(2025, 7, 21, 12, 40, 0),
        description: "Customer compared multiple properties",
        outcome: "positive" as const,
        details: "Used comparison tool for B15, A01, and D03",
        assignees: ['JD'],
        additionalInfo: {
          duration: "10 minutes",
          actionType: "property comparison",
          engagement: "detailed analysis"
        }
      },
      // 12:45 PM - Sales phone follow-up
      {
        id: 'phone-followup-sales-aug21-1',
        title: "Follow-up call",
        subtitle: "Appointment confirmation",
        channel: "phone",
        actor: "sales" as const,
        startDate: new Date(2025, 7, 21, 12, 45, 0),
        endDate: new Date(2025, 7, 21, 12, 50, 0),
        description: "Sales confirmed weekend viewing appointment",
        outcome: "positive" as const,
        details: "Confirmed Saturday 2 PM viewing for B15",
        assignees: ['AB'],
        propertyDetails: {
          propertyId: "B15",
          propertyName: "Greenwood Heights B15",
          price: 750000,
          size: 2400,
          bedrooms: 4,
          bathrooms: 3,
          location: "Greenwood Heights, North District",
          type: "residential" as const
        },
        additionalInfo: {
          duration: "5 minutes",
          actionType: "appointment confirmation",
          engagement: "confirmed viewing"
        }
      },
      // 1:00 PM - Customer mobile browsing
      {
        id: 'website-mobile-customer-aug21-1',
        title: "Mobile browsing",
        subtitle: "On-the-go viewing",
        channel: "website",
        actor: "customer" as const,
        startDate: new Date(2025, 7, 21, 13, 0, 0),
        endDate: new Date(2025, 7, 21, 13, 8, 0),
        description: "Customer browsed properties on mobile device",
        outcome: "positive" as const,
        details: "Viewed multiple residential listings during lunch break",
        assignees: ['JD'],
        additionalInfo: {
          duration: "8 minutes",
          actionType: "mobile browsing",
          engagement: "lunch break browsing"
        }
      },
      // 1:15 PM - Sales documentation
      {
        id: 'website-docs-sales-aug21-1',
        title: "Document upload",
        subtitle: "Property materials",
        channel: "website",
        actor: "sales" as const,
        startDate: new Date(2025, 7, 21, 13, 15, 0),
        endDate: new Date(2025, 7, 21, 13, 25, 0),
        description: "Sales team uploaded new property documents",
        outcome: "positive" as const,
        details: "Added floor plans and HOA documents for B15",
        assignees: ['AB', 'CD'],
        propertyDetails: {
          propertyId: "B15",
          propertyName: "Greenwood Heights B15",
          price: 750000,
          size: 2400,
          bedrooms: 4,
          bathrooms: 3,
          location: "Greenwood Heights, North District",
          type: "residential" as const
        },
        additionalInfo: {
          duration: "10 minutes",
          actionType: "document upload",
          engagement: "property preparation"
        }
      },
      // 1:30 PM - Customer email question
      {
        id: 'email-question-customer-aug21-1',
        title: "HOA inquiry",
        subtitle: "Fee questions",
        channel: "email",
        actor: "customer" as const,
        startDate: new Date(2025, 7, 21, 13, 30, 0),
        endDate: new Date(2025, 7, 21, 13, 30, 30),
        description: "Customer asked about HOA fees and restrictions",
        outcome: "positive" as const,
        details: "Specific questions about pet policy and monthly fees",
        assignees: ['AB'],
        propertyDetails: {
          propertyId: "B15",
          propertyName: "Greenwood Heights B15",
          price: 750000,
          size: 2400,
          bedrooms: 4,
          bathrooms: 3,
          location: "Greenwood Heights, North District",
          type: "residential" as const
        },
        additionalInfo: {
          actionType: "HOA inquiry",
          engagement: "detailed interest"
        }
      },
      // 1:45 PM - Sales email response
      {
        id: 'email-hoa-sales-aug21-1',
        title: "HOA information",
        subtitle: "Fee breakdown",
        channel: "email",
        actor: "sales" as const,
        startDate: new Date(2025, 7, 21, 13, 45, 0),
        endDate: new Date(2025, 7, 21, 13, 50, 0),
        description: "Sales provided detailed HOA information",
        outcome: "positive" as const,
        details: "Complete fee schedule and community amenities list",
        assignees: ['AB'],
        propertyDetails: {
          propertyId: "B15",
          propertyName: "Greenwood Heights B15",
          price: 750000,
          size: 2400,
          bedrooms: 4,
          bathrooms: 3,
          location: "Greenwood Heights, North District",
          type: "residential" as const
        },
        additionalInfo: {
          duration: "5 minutes",
          actionType: "HOA details",
          responseTime: "15 minutes",
          engagement: "comprehensive answer"
        }
      },
      // 2:00 PM - Customer website calculator
      {
        id: 'website-calc-customer-aug21-1',
        title: "Mortgage calculator",
        subtitle: "Payment estimation",
        channel: "website",
        actor: "customer" as const,
        startDate: new Date(2025, 7, 21, 14, 0, 0),
        endDate: new Date(2025, 7, 21, 14, 12, 0),
        description: "Customer used mortgage calculator for B15",
        outcome: "positive" as const,
        details: "Calculated monthly payments with different down payment scenarios",
        assignees: ['JD'],
        propertyDetails: {
          propertyId: "B15",
          propertyName: "Greenwood Heights B15",
          price: 750000,
          size: 2400,
          bedrooms: 4,
          bathrooms: 3,
          location: "Greenwood Heights, North District",
          type: "residential" as const
        },
        additionalInfo: {
          duration: "12 minutes",
          actionType: "mortgage calculation",
          engagement: "financial planning"
        }
      },
      // 2:15 PM - Sales phone prospecting
      {
        id: 'phone-prospect-sales-aug21-1',
        title: "Cold outreach",
        subtitle: "New lead contact",
        channel: "phone",
        actor: "sales" as const,
        startDate: new Date(2025, 7, 21, 14, 15, 0),
        endDate: new Date(2025, 7, 21, 14, 25, 0),
        description: "Sales team called new prospect from website signup",
        outcome: "neutral" as const,
        details: "Left voicemail with callback request",
        assignees: ['CD'],
        additionalInfo: {
          duration: "10 minutes",
          actionType: "cold outreach",
          engagement: "initial contact attempt"
        }
      },
      // 2:30 PM - Customer neighborhood research
      {
        id: 'website-research-customer-aug21-1',
        title: "Neighborhood info",
        subtitle: "Area research",
        channel: "website",
        actor: "customer" as const,
        startDate: new Date(2025, 7, 21, 14, 30, 0),
        endDate: new Date(2025, 7, 21, 14, 45, 0),
        description: "Customer researched Greenwood Heights neighborhood",
        outcome: "positive" as const,
        details: "Viewed school ratings, nearby amenities, and transportation",
        assignees: ['JD'],
        additionalInfo: {
          duration: "15 minutes",
          actionType: "neighborhood research",
          engagement: "thorough investigation"
        }
      },
      // 2:45 PM - Sales social media update
      {
        id: 'website-social-sales-aug21-1',
        title: "Social media post",
        subtitle: "Property showcase",
        channel: "website",
        actor: "sales" as const,
        startDate: new Date(2025, 7, 21, 14, 45, 0),
        endDate: new Date(2025, 7, 21, 14, 55, 0),
        description: "Sales team posted property highlights on social media",
        outcome: "positive" as const,
        details: "Featured B15 with virtual tour link and key selling points",
        assignees: ['EF'],
        propertyDetails: {
          propertyId: "B15",
          propertyName: "Greenwood Heights B15",
          price: 750000,
          size: 2400,
          bedrooms: 4,
          bathrooms: 3,
          location: "Greenwood Heights, North District",
          type: "residential" as const
        },
        additionalInfo: {
          duration: "10 minutes",
          actionType: "social media",
          engagement: "property promotion"
        }
      }
    ]

    // Only show the events if they fall within the current view's date range
    const viewStart = dateColumns[0]
    const viewEnd = dateColumns[dateColumns.length - 1]
    
    if (selectedTimeFilter === 'day') {
      // Show events only if viewing August 20 or 21, 2025
      const viewDate = new Date(currentDate)
      if (viewDate.getFullYear() === 2025 && 
          viewDate.getMonth() === 7 && 
          viewDate.getDate() === 20) {
        events.push(customerEventData, salesEventData, ...lotViewingEvents, salesEmailEvent)
      } else if (viewDate.getFullYear() === 2025 && 
                 viewDate.getMonth() === 7 && 
                 viewDate.getDate() === 21) {
        events.push(...aug21Events)
      }
    } else if (selectedTimeFilter === 'week') {
      // Show events if August 20, 2025 falls within the week range
      if (customerEventStartDate >= viewStart && customerEventStartDate <= viewEnd) {
        events.push(customerEventData, salesEventData, ...lotViewingEvents, salesEmailEvent)
      }
      // Show August 21st events if they fall within the week range
      const aug21Start = new Date(2025, 7, 21, 10, 0, 0)
      if (aug21Start >= viewStart && aug21Start <= viewEnd) {
        events.push(...aug21Events)
      }
    } else if (selectedTimeFilter === 'month') {
      // Show events if August 20, 2025 falls within the month range
      if (customerEventStartDate >= viewStart && customerEventStartDate <= viewEnd) {
        events.push(customerEventData, salesEventData, ...lotViewingEvents, salesEmailEvent)
      }
      // Show August 21st events if they fall within the month range
      const aug21Start = new Date(2025, 7, 21, 10, 0, 0)
      if (aug21Start >= viewStart && aug21Start <= viewEnd) {
        events.push(...aug21Events)
      }
    }

    return events
  }, [currentDate, selectedTimeFilter, dateColumns])

  const allEvents = useMemo(() => generateTimelineEvents(), [generateTimelineEvents])

  // Apply filters to events
  const events = useMemo(() => {
    let filteredEvents = allEvents

    // Filter by channels
    if (selectedChannels.length > 0) {
      filteredEvents = filteredEvents.filter(event => selectedChannels.includes(event.channel))
    }

    // Filter by actors
    if (selectedActors.length > 0) {
      filteredEvents = filteredEvents.filter(event => selectedActors.includes(event.actor))
    }

    return filteredEvents
  }, [allEvents, selectedChannels, selectedActors])

  // Format currency for display
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  // Format property size
  const formatSize = (size: number) => {
    return `${size.toLocaleString()} sq ft`
  }

  // Get assignee color class
  const getAssigneeColor = (assignee: string) => {
    const colors = {
      'JD': 'bg-blue-500 text-white',
      'AB': 'bg-green-500 text-white', 
      'CD': 'bg-purple-500 text-white',
      'EF': 'bg-orange-500 text-white'
    }
    return colors[assignee as keyof typeof colors] || 'bg-slate-500 text-white'
  }

  // Handle mouse events for tooltip (only for day and week views)
  const handleMouseEnter = (event: ActivityEvent, mouseEvent: React.MouseEvent) => {
    setHoveredEvent(event)
    setHoverPosition({ x: mouseEvent.clientX, y: mouseEvent.clientY })
  }

  // Handle click events for month view
  const handleMonthEventClick = (event: ActivityEvent) => {
    const eventDate = new Date(event.startDate)
    const dateKey = eventDate.toDateString()
    
    if (expandedDate === dateKey) {
      // If clicking the same date, collapse it
      setExpandedDate(null)
      setCurrentPage(1)
    } else {
      // Expand new date
      setExpandedDate(dateKey)
      setCurrentPage(1)
    }
  }

  const handleMouseLeave = () => {
    setHoveredEvent(null)
  }

  const handleMouseMove = (mouseEvent: React.MouseEvent) => {
    if (hoveredEvent) {
      setHoverPosition({ x: mouseEvent.clientX, y: mouseEvent.clientY })
    }
  }

  // Get all events for the expanded date
  const getExpandedDateEvents = () => {
    if (!expandedDate) return []
    
    const expandedDateObj = new Date(expandedDate)
    return events.filter(e => {
      const eDate = new Date(e.startDate)
      return eDate.getDate() === expandedDateObj.getDate() && 
             eDate.getMonth() === expandedDateObj.getMonth() && 
             eDate.getFullYear() === expandedDateObj.getFullYear()
    }).sort((a, b) => b.startDate.getTime() - a.startDate.getTime()) // Sort by time desc
  }

  // Pagination logic
  const expandedEvents = getExpandedDateEvents()
  const totalPages = Math.ceil(expandedEvents.length / eventsPerPage)
  const startIndex = (currentPage - 1) * eventsPerPage
  const paginatedEvents = expandedEvents.slice(startIndex, startIndex + eventsPerPage)

  // Tooltip component (for day and week views only)
  const EventTooltip = () => {
    if (!hoveredEvent) return null

    // Determine if tooltip should appear on left or right based on screen position
    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1200
    const showOnLeft = hoverPosition.x > screenWidth / 2
    
    // Calculate position for left/right placement
    const tooltipStyles = showOnLeft ? {
      right: screenWidth - hoverPosition.x + 15, // Position to the left of cursor
      top: hoverPosition.y - 50, // Center vertically relative to cursor
      transform: 'translateY(-50%)'
    } : {
      left: hoverPosition.x + 15, // Position to the right of cursor
      top: hoverPosition.y - 50, // Center vertically relative to cursor
      transform: 'translateY(-50%)'
    }

    return (
      <div
        className="fixed z-50 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg p-4 max-w-sm pointer-events-none"
        style={tooltipStyles}
      >
        <div className="space-y-3">
          {/* Event Header */}
          <div className="border-b border-slate-200 dark:border-slate-700 pb-2">
            <div className="flex items-start space-x-3 mb-2">
              <div className="p-2 rounded-lg flex-shrink-0" style={{ 
                backgroundColor: channels.find(c => c.key === hoveredEvent.channel)?.color + '20', 
                color: channels.find(c => c.key === hoveredEvent.channel)?.color 
              }}>
                {channels.find(c => c.key === hoveredEvent.channel)?.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                  {hoveredEvent.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {hoveredEvent.subtitle}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                hoveredEvent.actor === 'customer' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              }`}>
                {hoveredEvent.actor}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {hoveredEvent.startDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
              </span>
            </div>
          </div>

          {/* Property Details */}
          {hoveredEvent.propertyDetails && (
            <div className="space-y-2">
              <h4 className="font-medium text-slate-900 dark:text-slate-100 text-sm">Property Details</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Property:</span>
                  <span className="font-medium text-slate-900 dark:text-slate-100">{hoveredEvent.propertyDetails.propertyName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Price:</span>
                  <span className="font-medium text-green-600 dark:text-green-400">{formatCurrency(hoveredEvent.propertyDetails.price)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Size:</span>
                  <span className="font-medium text-slate-900 dark:text-slate-100">{formatSize(hoveredEvent.propertyDetails.size)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Location:</span>
                  <span className="font-medium text-slate-900 dark:text-slate-100">{hoveredEvent.propertyDetails.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Type:</span>
                  <span className="font-medium text-slate-900 dark:text-slate-100 capitalize">{hoveredEvent.propertyDetails.type}</span>
                </div>
              </div>
            </div>
          )}

          {/* Additional Information */}
          {hoveredEvent.additionalInfo && (
            <div className="space-y-2">
              <h4 className="font-medium text-slate-900 dark:text-slate-100 text-sm">Activity Details</h4>
              <div className="space-y-1 text-sm">
                {hoveredEvent.additionalInfo.duration && (
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Duration:</span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">{hoveredEvent.additionalInfo.duration}</span>
                  </div>
                )}
                {hoveredEvent.additionalInfo.viewCount && (
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">View Count:</span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">{hoveredEvent.additionalInfo.viewCount}</span>
                  </div>
                )}
                {hoveredEvent.additionalInfo.actionType && (
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Action:</span>
                    <span className="font-medium text-slate-900 dark:text-slate-100 capitalize">{hoveredEvent.additionalInfo.actionType}</span>
                  </div>
                )}
                {hoveredEvent.additionalInfo.responseTime && (
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Response Time:</span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">{hoveredEvent.additionalInfo.responseTime}</span>
                  </div>
                )}
                {hoveredEvent.additionalInfo.engagement && (
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Engagement:</span>
                    <span className="font-medium text-slate-900 dark:text-slate-100 capitalize">{hoveredEvent.additionalInfo.engagement}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Assignees */}
          {hoveredEvent.assignees && hoveredEvent.assignees.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-slate-900 dark:text-slate-100 text-sm">Assignees</h4>
              <div className="flex space-x-1">
                {hoveredEvent.assignees.map((assignee, index) => (
                  <span key={index} className={`inline-flex items-center justify-center w-6 h-6 ${getAssigneeColor(assignee)} rounded-full text-xs font-medium`}>
                    {assignee}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Define channel order and info
  const channels = useMemo(() => [
    { key: 'website', name: 'Website', icon: <Globe className="w-4 h-4" />, color: 'rgb(59, 130, 246)' },
    { key: 'phone', name: 'Phone', icon: <Phone className="w-4 h-4" />, color: 'rgb(16, 185, 129)' },
    { key: 'email', name: 'Email', icon: <Mail className="w-4 h-4" />, color: 'rgb(245, 158, 11)' }
  ], [])

  // Group events by channel and actor
  const eventsByChannelAndActor = useMemo(() => {
    const grouped: Record<string, Record<string, ActivityEvent[]>> = {}
    
    channels.forEach(channel => {
      grouped[channel.key] = {
        customer: events.filter(e => e.channel === channel.key && e.actor === 'customer'),
        sales: events.filter(e => e.channel === channel.key && e.actor === 'sales')
      }
    })
    
    return grouped
  }, [events, channels])



  const getEventBarStyle = (event: ActivityEvent) => {
    // Sales events are always green, customer events are always blue
    if (event.actor === 'sales') {
      return 'bg-green-500'
    } else {
      return 'bg-blue-500'
    }
  }

  const calculateBarPosition = (startDate: Date, endDate: Date) => {
    if (selectedTimeFilter === 'day') {
      // For day view, calculate position based on hours
      const dayStart = new Date(dateColumns[0])
      dayStart.setHours(0, 0, 0, 0)
      const dayEnd = new Date(dayStart)
      dayEnd.setHours(23, 59, 59, 999)
      
      const timelineSpan = 24 * 60 * 60 * 1000 // 24 hours in milliseconds
      const eventStart = startDate.getTime() - dayStart.getTime()
      const eventDuration = endDate.getTime() - startDate.getTime()
      
      const leftPercent = (eventStart / timelineSpan) * 100
      const widthPercent = (eventDuration / timelineSpan) * 100
      
      return {
        left: `${Math.max(0, leftPercent)}%`,
        width: `${Math.max(2, widthPercent)}%`
      }
    } else {
      // For week and month views, calculate based on date columns
      const timelineStart = new Date(dateColumns[0])
      timelineStart.setHours(0, 0, 0, 0)
      
      const timelineEnd = new Date(dateColumns[dateColumns.length - 1])
      timelineEnd.setHours(23, 59, 59, 999)
      
      const timelineSpan = timelineEnd.getTime() - timelineStart.getTime()

      const eventStart = startDate.getTime() - timelineStart.getTime()
      const eventDuration = endDate.getTime() - startDate.getTime()

      const leftPercent = (eventStart / timelineSpan) * 100
      const widthPercent = (eventDuration / timelineSpan) * 100

      return {
        left: `${Math.max(0, leftPercent)}%`,
        width: `${Math.max(0.5, widthPercent)}%`
      }
    }
  }

  const renderEventElement = (event: ActivityEvent, eventIndex: number, isCustomerRow: boolean) => {
    const barPosition = calculateBarPosition(event.startDate, event.endDate)
    const baseVerticalOffset = isCustomerRow ? 0 : 50 // Customer in top half, sales in bottom half
    const stackingOffset = 0 // Remove stacking - all events of same type on same line
    
    if (selectedTimeFilter === 'month') {
      // Show centered bar for month view with event count for this actor type
      const eventDate = new Date(event.startDate)
      const targetDateColumn = dateColumns.findIndex(date => 
        date.getDate() === eventDate.getDate() && 
        date.getMonth() === eventDate.getMonth() && 
        date.getFullYear() === eventDate.getFullYear()
      )
      
      if (targetDateColumn === -1) return null // Event not in visible range
      
      // Count events for this specific date, channel, and actor type (customer/sales)
      const eventsOnThisDateForChannelAndActor = events.filter(e => {
        const eDate = new Date(e.startDate)
        return eDate.getDate() === eventDate.getDate() && 
               eDate.getMonth() === eventDate.getMonth() && 
               eDate.getFullYear() === eventDate.getFullYear() &&
               e.actor === event.actor &&
               e.channel === event.channel
      })
      
      // Only render once per date per channel per actor type
      const isFirstEventForDateChannelAndActor = events.findIndex(e => {
        const eDate = new Date(e.startDate)
        return eDate.getDate() === eventDate.getDate() && 
               eDate.getMonth() === eventDate.getMonth() && 
               eDate.getFullYear() === eventDate.getFullYear() &&
               e.actor === event.actor &&
               e.channel === event.channel
      }) === events.indexOf(event)
      
      if (!isFirstEventForDateChannelAndActor) return null
      
      const columnWidth = 100 / dateColumns.length
      const leftPosition = (targetDateColumn * columnWidth) + (columnWidth / 2) - 1.5 // Center in the column (adjusted for larger size)
      
      return (
        <div 
          key={`month-${eventDate.toDateString()}-${event.actor}-${event.channel}`}
          className={`absolute rounded-md transition-all duration-200 ${getEventBarStyle(event)} flex items-center justify-center border-0 cursor-pointer hover:opacity-80 hover:scale-110`}
          style={{
            left: `${leftPosition}%`,
            top: `${20 + baseVerticalOffset / 2}%`,
            width: '24px',
            height: '20px',
            zIndex: eventIndex + 1
          }}
          onClick={() => handleMonthEventClick(event)}
          title="Click to expand detail"
        >
          <span className="text-xs font-medium text-white px-1 py-0.5 leading-none">
            {eventsOnThisDateForChannelAndActor.length}
          </span>
        </div>
      )
    } else if (selectedTimeFilter === 'week') {
      // Show bars for week view with correct positioning and length
      return (
        <div 
          key={event.id}
          className={`absolute rounded-full transition-all duration-200 ${getEventBarStyle(event)} flex items-center justify-center border-0 cursor-pointer hover:opacity-80`}
          style={{
            ...barPosition,
            top: `${15 + baseVerticalOffset + stackingOffset}%`,
            height: '12px',
            width: Math.max(12, parseFloat(barPosition.width as string)) + 'px',
            minWidth: '12px',
            zIndex: eventIndex + 1
          }}
          onMouseEnter={(e) => handleMouseEnter(event, e)}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
          title={`${event.title} - ${event.subtitle}`}
        >
        
        </div>
      )
    } else {
      // Show full bars for day view
      return (
        <div 
          key={event.id}
          className={`absolute rounded-full transition-all duration-200 ${getEventBarStyle(event)} flex items-center justify-center border-0 cursor-pointer hover:opacity-80`}
          style={{
            ...barPosition,
            top: `${15 + baseVerticalOffset + stackingOffset}%`,
            height: '14px',
            width: Math.max(14, parseFloat(barPosition.width as string)) + 'px',
            minWidth: '14px',
            zIndex: eventIndex + 1
          }}
          onMouseEnter={(e) => handleMouseEnter(event, e)}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
          title={`${event.title} - ${event.subtitle}`}
        >
        
        </div>
      )
    }
  }

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    
    if (selectedTimeFilter === 'day') {
      // Navigate by day
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1))
    } else if (selectedTimeFilter === 'week') {
      // Navigate by week
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7))
    } else if (selectedTimeFilter === 'month') {
      // Navigate by month
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1))
    }
    
    setCurrentDate(newDate)
  }

  const formatDateRange = () => {
    if (selectedTimeFilter === 'day') {
      return currentDate.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    } else if (selectedTimeFilter === 'week') {
      const start = dateColumns[0]
      const end = dateColumns[dateColumns.length - 1]
      return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
    } else if (selectedTimeFilter === 'month') {
      return currentDate.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long' 
      })
    }
    return ''
  }

  return (
    <>
      <EventTooltip />
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
      {/* Header */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Activity by Channel
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Customer and sales interactions across all channels
              </p>
            </div>
          </div>

        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            {['Day', 'Week', 'Month'].map(filter => (
              <button
                key={filter}
                onClick={() => setSelectedTimeFilter(filter.toLowerCase() as 'day' | 'week' | 'month')}
                className={`px-3 py-1 text-sm rounded transition-colors ${
                  filter.toLowerCase() === selectedTimeFilter
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => navigateDate('prev')}
                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                {formatDateRange()}
              </span>
              <button 
                onClick={() => navigateDate('next')}
                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center space-x-4">
              {/* Event Legends */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span className="text-sm text-slate-600 dark:text-slate-400">Customer</span>
                  </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span className="text-sm text-slate-600 dark:text-slate-400">Sales</span>
                </div>
              </div>

              <div className="relative">
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center space-x-2 text-sm transition-colors ${
                    showFilters ? 'text-slate-900 dark:text-slate-100' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
                </svg>
                <span>Filter</span>
              </button>
                
                {/* Filter Count Badge */}
                {(selectedChannels.length > 0 || selectedActors.length > 0) && (
                  <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-medium">
                    {selectedChannels.length + selectedActors.length}
                  </div>
                )}
            </div>
          </div>
        </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mt-4 p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-750">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Channel Filter */}
              <div>
                <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-3">Filter by Channel</h4>
                <div className="space-y-2">
                  {channels.map((channel) => (
                    <label key={channel.key} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedChannels.includes(channel.key)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedChannels([...selectedChannels, channel.key])
                          } else {
                            setSelectedChannels(selectedChannels.filter(c => c !== channel.key))
                          }
                        }}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex items-center space-x-2">
                        <div className="p-1 rounded" style={{ backgroundColor: channel.color + '20', color: channel.color }}>
                          {channel.icon}
                        </div>
                        <span className="text-sm text-slate-700 dark:text-slate-300">{channel.name}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Actor Filter */}
              <div>
                <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-3">Filter by Event Type</h4>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedActors.includes('customer')}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedActors([...selectedActors, 'customer'])
                        } else {
                          setSelectedActors(selectedActors.filter(a => a !== 'customer'))
                        }
                      }}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded"></div>
                      <span className="text-sm text-slate-700 dark:text-slate-300">Customer Events</span>
                    </div>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedActors.includes('sales')}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedActors([...selectedActors, 'sales'])
                        } else {
                          setSelectedActors(selectedActors.filter(a => a !== 'sales'))
                        }
                      }}
                      className="rounded border-slate-300 text-green-600 focus:ring-green-500"
                    />
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded"></div>
                      <span className="text-sm text-slate-700 dark:text-slate-300">Sales Events</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Filter Actions */}
            <div className="mt-4 flex items-center justify-between">
              <button
                onClick={() => {
                  setSelectedChannels([])
                  setSelectedActors([])
                }}
                className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
              >
                Clear All Filters
              </button>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                {selectedChannels.length > 0 || selectedActors.length > 0 ? (
                  <>Showing filtered events • </>
                ) : (
                  <>Showing all events • </>
                )}
                {events.length} {events.length === 1 ? 'event' : 'events'}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Timeline */}
      <div className="overflow-x-auto">
        {/* Date Headers */}
        <div className="min-w-full">
          {/* Month/Year Headers */}
          <div className="flex border-b border-slate-200 dark:border-slate-700">
            <div className="w-32 flex-shrink-0"></div>
            <div className={`flex-1 grid gap-0 ${
              selectedTimeFilter === 'day' ? 'grid-cols-24' : 
              selectedTimeFilter === 'week' ? 'grid-cols-7' : 
              'grid-cols-28'
            }`}>
              {selectedTimeFilter !== 'day' && dateColumns.map((date, index) => {
                const isFirstOfMonth = date.getDate() === 1 || index === 0
                const monthSpan = dateColumns.filter(d => d.getMonth() === date.getMonth()).length
                
                return isFirstOfMonth ? (
                  <div 
                    key={`month-${index}`} 
                    className={`p-2 text-center text-sm font-medium text-slate-900 dark:text-slate-100 border-r border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-750`}
                    style={{ gridColumn: `span ${Math.min(monthSpan, dateColumns.length - index)}` }}
                  >
                    {date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </div>
                ) : null
              })}
            </div>
          </div>

          {/* Time/Day Headers */}
          <div className="flex border-b border-slate-200 dark:border-slate-700">
            <div className="w-32 flex-shrink-0"></div>
            <div className={`flex-1 grid gap-0 ${
              selectedTimeFilter === 'day' ? 'grid-cols-24' : 
              selectedTimeFilter === 'week' ? 'grid-cols-7' : 
              'grid-cols-28'
            }`}>
              {dateColumns.map((date, index) => {
                const today = new Date()
                const isToday = selectedTimeFilter === 'day' 
                  ? date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear()
                  : date.toDateString() === today.toDateString()
                const isTodayHour = selectedTimeFilter === 'day' && date.getHours() === today.getHours() && isToday
                
                return (
                  <div key={index} className={`p-1 text-center border-r border-slate-200 dark:border-slate-700 last:border-r-0 ${
                    selectedTimeFilter === 'day' ? (isTodayHour ? 'bg-blue-50 dark:bg-blue-900/20' : '') : (isToday ? 'bg-blue-50 dark:bg-blue-900/20' : '')
                  }`}>
                    {selectedTimeFilter === 'day' ? (
                      // Hour view
                      <>
                        <div className={`text-xs ${
                          isTodayHour ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-slate-500 dark:text-slate-400'
                        }`}>
                          {date.getHours() === 0 ? '12' : date.getHours() > 12 ? date.getHours() - 12 : date.getHours()}
                        </div>
                        <div className={`text-xs ${
                          isTodayHour ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-slate-500 dark:text-slate-400'
                        }`}>
                          {date.getHours() < 12 ? 'AM' : 'PM'}
                        </div>
                      </>
                    ) : (
                      // Day view
                      <>
                        <div className={`text-xs ${
                          isToday ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-slate-500 dark:text-slate-400'
                        }`}>
                          {selectedTimeFilter === 'week' ? date.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0) : ''}
                        </div>
                        <div className={`text-sm font-medium ${
                          isToday 
                            ? 'bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mx-auto' 
                            : 'text-slate-900 dark:text-slate-100'
                        }`}>
                          {date.getDate()}
                        </div>
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Timeline Rows - Grouped by Channel with Customer/Sales rows */}
          <div className="relative">
            {channels.map((channel) => {
              const customerEvents = eventsByChannelAndActor[channel.key]?.customer || []
              const salesEvents = eventsByChannelAndActor[channel.key]?.sales || []

              
              return (
                <div key={channel.key} className="flex items-center border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 group">
                  {/* Channel Info */}
                  <div className="w-32 flex-shrink-0 p-2 flex items-center space-x-3">
                    <div className="w-1 h-20 rounded-full" style={{ backgroundColor: channel.color }}></div>
                    <div className="flex items-center space-x-2">
                      <div className="p-1.5 rounded-lg" style={{ backgroundColor: channel.color + '20', color: channel.color }}>
                        {channel.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          {channel.name}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Timeline Bar Area */}
                  <div className={`flex-1 relative h-20 grid gap-0 ${
                    selectedTimeFilter === 'day' ? 'grid-cols-24' : 
                    selectedTimeFilter === 'week' ? 'grid-cols-7' : 
                    'grid-cols-28'
                  }`}>
                    {dateColumns.map((date, dateIndex) => {
                      const today = new Date()
                      const isToday = selectedTimeFilter === 'day' 
                        ? date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear()
                        : date.toDateString() === today.toDateString()
                      const isTodayHour = selectedTimeFilter === 'day' && date.getHours() === today.getHours() && isToday
                      
                      return (
                        <div key={dateIndex} className={`border-r border-slate-200 dark:border-slate-700 last:border-r-0 ${
                          selectedTimeFilter === 'day' ? (isTodayHour ? 'bg-blue-50/50 dark:bg-blue-900/10' : '') : (isToday ? 'bg-blue-50/50 dark:bg-blue-900/10' : '')
                        }`}></div>
                      )
                    })}
                    
                    {/* Customer Events (top half) */}
                    {customerEvents.map((event, eventIndex) => renderEventElement(event, eventIndex, true))}
                    
                    {/* Sales Events (bottom half) */}
                    {salesEvents.map((event, eventIndex) => renderEventElement(event, eventIndex, false))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Expanded Events Table - Only show in month view when a date is selected */}
      {selectedTimeFilter === 'month' && expandedDate && (
        <div className="bg-slate-50 dark:bg-slate-750 border-t border-slate-200 dark:border-slate-700">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Events for {new Date(expandedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {expandedEvents.length} event{expandedEvents.length !== 1 ? 's' : ''} found
                </p>
              </div>
              <button
                onClick={() => setExpandedDate(null)}
                className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Events Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-100 dark:bg-slate-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Time</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Event</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Channel</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actor</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Property</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Assignees</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Details</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                {paginatedEvents.map((event) => (
                  <tr key={event.id} className="hover:bg-slate-50 dark:hover:bg-slate-750">
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-100">
                      {event.startDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <div className="text-sm font-medium text-slate-900 dark:text-slate-100">{event.title}</div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">{event.subtitle}</div>
    </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="p-1.5 rounded-lg mr-2" style={{ backgroundColor: channels.find(c => c.key === event.channel)?.color + '20', color: channels.find(c => c.key === event.channel)?.color }}>
                          {channels.find(c => c.key === event.channel)?.icon}
                        </div>
                        <span className="text-sm text-slate-900 dark:text-slate-100 capitalize">{event.channel}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        event.actor === 'customer' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}>
                        {event.actor}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      {event.propertyDetails ? (
                        <div>
                          <div className="text-sm font-medium text-slate-900 dark:text-slate-100">{event.propertyDetails.propertyName}</div>
                          <div className="text-sm text-slate-500 dark:text-slate-400">
                            {formatCurrency(event.propertyDetails.price)} • {formatSize(event.propertyDetails.size)}
                          </div>
                          <div className="text-xs text-slate-400 dark:text-slate-500">{event.propertyDetails.location}</div>
                        </div>
                      ) : (
                        <span className="text-sm text-slate-400 dark:text-slate-500">—</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      {event.assignees && event.assignees.length > 0 ? (
                        <div className="flex space-x-1">
                          {event.assignees.map((assignee, index) => (
                            <span key={index} className={`inline-flex items-center justify-center w-6 h-6 ${getAssigneeColor(assignee)} rounded-full text-xs font-medium`}>
                              {assignee}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-sm text-slate-400 dark:text-slate-500">—</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      {event.additionalInfo ? (
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          {event.additionalInfo.engagement && (
                            <div className="capitalize">{event.additionalInfo.engagement}</div>
                          )}
                          {event.additionalInfo.duration && (
                            <div>Duration: {event.additionalInfo.duration}</div>
                          )}
                          {event.additionalInfo.viewCount && (
                            <div>View #{event.additionalInfo.viewCount}</div>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-slate-400 dark:text-slate-500">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div className="text-sm text-slate-700 dark:text-slate-300">
                Showing {startIndex + 1} to {Math.min(startIndex + eventsPerPage, expandedEvents.length)} of {expandedEvents.length} events
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border border-slate-300 dark:border-slate-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                  Previous
                </button>
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm border border-slate-300 dark:border-slate-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      </div>
    </>
  )
}