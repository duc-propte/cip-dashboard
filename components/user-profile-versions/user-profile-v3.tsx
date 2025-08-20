"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Phone, Star, Clock } from "lucide-react"
import { User } from "@/types"

interface UserProfileV3Props {
  user: User
}

export default function UserProfileV3({ user }: UserProfileV3Props) {
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

  // Mock contact data - in real app this would come from props or API
  const contactInfo = {
    emails: [
      { email: user.email, isPrimary: true, interactions: 42 },
      { email: "john.doe.work@company.com", isPrimary: false, interactions: 18 },
      { email: "j.doe.personal@gmail.com", isPrimary: false, interactions: 7 }
    ],
    phones: [
      { phone: user.phone || "+1 (555) 123-4567", isPrimary: true, interactions: 15 },
      { phone: "+1 (555) 987-6543", isPrimary: false, interactions: 8 },
      { phone: "+1 (555) 456-7890", isPrimary: false, interactions: 3 }
    ],
    mostInteracted: {
      type: 'email' as 'email' | 'phone',
      value: user.email,
      interactions: 42
    }
  }

  return (
    <Card className="w-full max-w-lg bg-white dark:bg-white">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-3">
          <Badge variant="outline" className="text-xs">
            Version 3 - Contact Details
          </Badge>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-slate-500 dark:text-slate-500">
              Online
            </span>
          </div>
        </div>

        {/* User Header */}
        <div className="flex items-start space-x-3">
          <Avatar className="w-12 h-12">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg font-bold">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-bold text-slate-900 dark:text-slate-900 mb-1 truncate">
              {user.name}
            </CardTitle>
            <div className="flex items-center space-x-1 text-xs text-slate-500 dark:text-slate-500">
              <Clock className="w-3 h-3" />
              <span>Last active {formatLastActive(user.lastActive)}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        {/* Most Interacted Contact */}
        <div className="p-3 bg-amber-50 dark:bg-amber-50 rounded-lg border border-amber-200 dark:border-amber-200">
          <div className="flex items-center space-x-2 mb-1">
            <Star className="w-4 h-4 text-amber-600 dark:text-amber-600" />
            <span className="text-sm font-semibold text-amber-900 dark:text-amber-900">
              Most Contacted
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {contactInfo.mostInteracted.type === 'email' ? (
              <Mail className="w-3 h-3 text-amber-700 dark:text-amber-700" />
            ) : (
              <Phone className="w-3 h-3 text-amber-700 dark:text-amber-700" />
            )}
            <span className="text-sm text-amber-800 dark:text-amber-800 truncate">
              {contactInfo.mostInteracted.value}
            </span>
            <Badge variant="outline" className="text-xs bg-amber-100 dark:bg-amber-100 text-amber-800 dark:text-amber-800 border-amber-300 dark:border-amber-300">
              {contactInfo.mostInteracted.interactions} interactions
            </Badge>
          </div>
        </div>

        {/* Email Addresses */}
        <div>
          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-900 mb-2 flex items-center space-x-1">
            <Mail className="w-4 h-4" />
            <span>Email Addresses</span>
          </h4>
          <div className="space-y-2">
            {contactInfo.emails.map((emailData, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-50 rounded border border-blue-100 dark:border-blue-100">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-slate-900 dark:text-slate-900 truncate">
                      {emailData.email}
                    </span>
                    {emailData.isPrimary && (
                      <Badge variant="secondary" className="text-xs">Primary</Badge>
                    )}
                  </div>
                </div>
                <Badge variant="outline" className="text-xs ml-2">
                  {emailData.interactions}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Phone Numbers */}
        <div>
          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-900 mb-2 flex items-center space-x-1">
            <Phone className="w-4 h-4" />
            <span>Phone Numbers</span>
          </h4>
          <div className="space-y-2">
            {contactInfo.phones.map((phoneData, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-50 rounded border border-green-100 dark:border-green-100">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-slate-900 dark:text-slate-900">
                      {phoneData.phone}
                    </span>
                    {phoneData.isPrimary && (
                      <Badge variant="secondary" className="text-xs">Primary</Badge>
                    )}
                  </div>
                </div>
                <Badge variant="outline" className="text-xs ml-2">
                  {phoneData.interactions}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
