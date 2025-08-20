"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Phone, MessageCircle, MapPin } from "lucide-react"
import { User } from "@/types"

interface UserProfileV2Props {
  user: User
}

export default function UserProfileV2({ user }: UserProfileV2Props) {
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

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start mb-4">
          <Badge variant="outline" className="text-xs">
            Version 2 - Card Style
          </Badge>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Online
            </span>
          </div>
        </div>

        {/* Avatar and Name - Centered */}
        <div className="flex flex-col items-center text-center">
          <Avatar className="w-20 h-20 mb-4">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xl font-bold">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            {user.name}
          </h2>
          
          <div className="flex items-center space-x-1 text-sm text-slate-500 dark:text-slate-400 mb-4">
            <MapPin className="w-4 h-4" />
            <span>San Francisco, CA</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Contact Information */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center space-x-3 text-sm">
            <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
              <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-slate-600 dark:text-slate-400 truncate flex-1">
              {user.email}
            </span>
          </div>
          
          {user.phone && (
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-8 h-8 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <Phone className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-slate-600 dark:text-slate-400">
                {user.phone}
              </span>
            </div>
          )}
        </div>

        {/* Last Active */}
        <div className="text-center text-sm text-slate-500 dark:text-slate-400 mb-6">
          Last active {formatLastActive(user.lastActive)}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" className="flex items-center space-x-2">
            <Mail className="w-4 h-4" />
            <span>Email</span>
          </Button>
          <Button variant="outline" size="sm" className="flex items-center space-x-2">
            <MessageCircle className="w-4 h-4" />
            <span>Message</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
