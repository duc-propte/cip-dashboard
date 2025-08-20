"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, Clock } from "lucide-react"
import { User } from "@/types"

interface UserProfileV1Props {
  user: User
}

export default function UserProfileV1({ user }: UserProfileV1Props) {
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
    <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg">
      {/* Header with version info */}
      <div className="flex justify-between items-center mb-3">
        <Badge variant="outline" className="text-xs">
          Version 1 - Compact
        </Badge>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Active
          </span>
        </div>
      </div>

      {/* Compact Layout */}
      <div className="flex items-center space-x-3">
        {/* Avatar */}
        <Avatar className="w-12 h-12">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-bold">
            {getInitials(user.name)}
          </AvatarFallback>
        </Avatar>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          {/* Name */}
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 truncate">
            {user.name}
          </h3>
          
          {/* Contact - Compact horizontal layout */}
          <div className="flex items-center space-x-4 text-xs text-slate-600 dark:text-slate-400 mt-1">
            <div className="flex items-center space-x-1">
              <Mail className="w-3 h-3" />
              <span className="truncate max-w-[120px]">{user.email}</span>
            </div>
            {user.phone && (
              <div className="flex items-center space-x-1">
                <Phone className="w-3 h-3" />
                <span>{user.phone}</span>
              </div>
            )}
          </div>

          {/* Last Active */}
          <div className="flex items-center space-x-1 text-xs text-slate-500 dark:text-slate-400 mt-1">
            <Clock className="w-3 h-3" />
            <span>{formatLastActive(user.lastActive)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
