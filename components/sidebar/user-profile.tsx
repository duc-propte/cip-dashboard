"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Mail, Phone } from "lucide-react"
import { User } from "@/types"

interface UserProfileProps {
  user: User
}

export default function UserProfile({ user }: UserProfileProps) {
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
          <div className="space-y-2">
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
          </div>
        </div>
      </div>
    </div>
  )
}
