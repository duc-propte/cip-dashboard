"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, PhoneCall, MapPin, Mail, Phone, ChevronRight } from "lucide-react"
import { User } from "@/types"
import { useState } from "react"

interface UserProfileV4Props {
  user: User
}

export default function UserProfileV4({ user }: UserProfileV4Props) {
  const [selectedCommunication, setSelectedCommunication] = useState<string | null>(null);
  // Helper function to get user initials
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  // Helper function to format last active time
  const formatLastActive = (lastActive?: string) => {
    if (!lastActive) return 'Never'
    
    const now = new Date()
    const activeTime = new Date(lastActive)
    const diffInMinutes = Math.floor((now.getTime() - activeTime.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }



  const formatRecentActivity = (timestamp: string) => {
    const now = new Date()
    const activityTime = new Date(timestamp)
    const diffInHours = Math.floor((now.getTime() - activityTime.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  // Project-specific communication data for Waurn Ponds
  const projectCommunications = {
    emails: [
      {
        id: 'email-1',
        timestamp: '2024-12-20T14:30:00Z',
        subject: 'Lot 47 - Price and Availability Inquiry',
        content: 'Inquiry about pricing and availability for Lot 47, expressed interest in the corner position',
        lotNumbers: ['47'],
        priceRange: '$450k-$500k',
        contactEmail: 'john.doe@company.com'
      },
      {
        id: 'email-2',
        timestamp: '2024-12-19T09:15:00Z',
        subject: 'Settlement Timeline Questions',
        content: 'Questions about construction timeline and settlement process',
        lotNumbers: ['Multiple'],
        priceRange: 'General inquiry',
        contactEmail: 'j.doe@personalmail.com'
      },
      {
        id: 'email-3',
        timestamp: '2024-12-18T16:45:00Z',
        subject: 'Site Visit Confirmation',
        content: 'Confirmed site visit appointment for December 23rd to view available lots',
        lotNumbers: ['47', '52', '61'],
        priceRange: '$450k-$550k',
        contactEmail: 'john.doe@company.com'
      }
    ],
    calls: [
      {
        id: 'call-1',
        timestamp: '2024-12-19T16:45:00Z',
        duration: '12 minutes',
        purpose: 'Lot 47 Follow-up Discussion',
        content: 'Discussed pricing options for Lot 47, customer showed strong interest, mentioned timeline concerns',
        lotNumbers: ['47'],
        contactPhone: '+1 (555) 123-4567',
        nextAction: 'Email pricing breakdown by Friday'
      },
      {
        id: 'call-2',
        timestamp: '2024-12-17T11:20:00Z',
        duration: '8 minutes',
        purpose: 'Initial Inquiry Call',
        content: 'First contact call about Waurn Ponds development, interested in family-friendly lots',
        lotNumbers: ['General inquiry'],
        contactPhone: '+1 (555) 987-6543',
        nextAction: 'Prepare lot comparison sheet'
      }
    ]
  };

  return (
    <div className="p-6 border-b border-slate-200 dark:border-slate-700">
      <div className="flex items-start space-x-4">
        {/* Left Side - Avatar and Status */}
        <div className="flex flex-col items-center space-y-3">
          <Avatar className="w-16 h-16">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg font-bold">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          
          {/* Active Status */}
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {formatLastActive(user.lastActive)}
            </span>
          </div>
        </div>

        {/* Right Side - User Info */}
        <div className="flex-1 min-w-0">
          {/* Full Name */}
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3 truncate">
            {user.name}
          </h2>
          
          {/* Contact Info */}
          <div className="space-y-2 mb-4">
            {/* Phone */}
            {user.phone && (
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="w-4 h-4 text-slate-500 dark:text-slate-400 flex-shrink-0" />
                <span className="text-slate-600 dark:text-slate-400 truncate">
                  {user.phone}
                </span>
              </div>
            )}
            
            {/* Email */}
            <div className="flex items-center space-x-2 text-sm">
              <Mail className="w-4 h-4 text-slate-500 dark:text-slate-400 flex-shrink-0" />
              <span className="text-slate-600 dark:text-slate-400 truncate">
                {user.email}
              </span>
            </div>

            {/* Location/Suburb */}
            {(user.suburb || user.location) && (
              <div className="flex items-center space-x-2 text-sm">
                <MapPin className="w-4 h-4 text-slate-500 dark:text-slate-400 flex-shrink-0" />
                <span className="text-slate-600 dark:text-slate-400 truncate">
                  {user.suburb ? `${user.suburb}${user.location ? `, ${user.location}` : ''}` : user.location}
                </span>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Recent Communication Section - Full Width */}
      <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Recent Communication
          </h4>
          <Badge variant="outline" className="text-xs">
            {projectCommunications.emails.length + projectCommunications.calls.length} total
          </Badge>
        </div>
        
        <div className="space-y-3">
          {/* Email Communication Item */}
          <div 
            className={`cursor-pointer transition-all p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-2 ${
              selectedCommunication === 'emails' 
                ? 'border-blue-300 dark:border-blue-600' 
                : 'border-transparent hover:border-blue-200 dark:hover:border-blue-700'
            }`}
            onClick={() => setSelectedCommunication(selectedCommunication === 'emails' ? null : 'emails')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    Email Communications
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {projectCommunications.emails.length} emails
                  </p>
                </div>
              </div>
              <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${
                selectedCommunication === 'emails' ? 'rotate-90' : ''
              }`} />
            </div>
            
            {/* Expanded Email List */}
            {selectedCommunication === 'emails' && (
              <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-700 space-y-2">
                {projectCommunications.emails.map((email) => (
                  <div key={email.id} className="p-2 bg-white dark:bg-slate-800 rounded-lg">
                    <div className="flex items-start justify-between mb-1">
                      <p className="text-xs font-medium text-slate-900 dark:text-slate-100">
                        {email.subject}
                      </p>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {formatRecentActivity(email.timestamp)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 mb-2">{email.content}</p>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1">
                        <Mail className="w-3 h-3 text-slate-500" />
                        <span className="text-xs text-slate-600 dark:text-slate-400">{email.contactEmail}</span>
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-slate-600 dark:text-slate-400">
                        <span>Lots: {email.lotNumbers.join(', ')}</span>
                        <span>Price: {email.priceRange}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Phone Communication Item */}
          <div 
            className={`cursor-pointer transition-all p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border-2 ${
              selectedCommunication === 'calls' 
                ? 'border-green-300 dark:border-green-600' 
                : 'border-transparent hover:border-green-200 dark:hover:border-green-700'
            }`}
            onClick={() => setSelectedCommunication(selectedCommunication === 'calls' ? null : 'calls')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
                  <PhoneCall className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    Phone Communications
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {projectCommunications.calls.length} calls
                  </p>
                </div>
              </div>
              <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${
                selectedCommunication === 'calls' ? 'rotate-90' : ''
              }`} />
            </div>
            
            {/* Expanded Call List */}
            {selectedCommunication === 'calls' && (
              <div className="mt-3 pt-3 border-t border-green-200 dark:border-green-700 space-y-2">
                {projectCommunications.calls.map((call) => (
                  <div key={call.id} className="p-2 bg-white dark:bg-slate-800 rounded-lg">
                    <div className="flex items-start justify-between mb-1">
                      <p className="text-xs font-medium text-slate-900 dark:text-slate-100">
                        {call.purpose}
                      </p>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {formatRecentActivity(call.timestamp)} • {call.duration}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 mb-2">{call.content}</p>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1">
                        <Phone className="w-3 h-3 text-slate-500" />
                        <span className="text-xs text-slate-600 dark:text-slate-400">{call.contactPhone}</span>
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-slate-600 dark:text-slate-400">
                        <span>Lots: {call.lotNumbers.join(', ')}</span>
                        <span>Next: {call.nextAction}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
