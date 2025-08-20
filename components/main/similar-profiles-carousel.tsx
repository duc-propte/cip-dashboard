"use client"

import { useState, useMemo } from "react"
import { Users, MessageSquare, Phone, Mail, Globe, Clock, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"
import { SimilarProfilesData, SimilarProfile, SimilarityReason } from "@/types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export default function SimilarProfilesCarousel() {
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null)

  // Generate deterministic mock data
  const similarProfilesData: SimilarProfilesData = useMemo(() => {
    const generateMockProfiles = (): SimilarProfile[] => {
      const names = [
        "Sarah Chen", "Michael Rodriguez", "Emily Johnson", "David Kim", 
        "Jennifer Smith", "Robert Wilson", "Ashley Brown", "James Davis",
        "Lisa Thompson", "Christopher Lee", "Amanda Martinez", "Daniel Taylor"
      ]
      
      const locations = [
        "Downtown Toronto", "Mississauga", "Markham", "Richmond Hill",
        "North York", "Scarborough", "Etobicoke", "Vaughan",
        "Brampton", "Burlington", "Oakville", "Ajax"
      ]
      
      const interests = [
        ["luxury living", "downtown lifestyle", "investment property"],
        ["family-friendly", "schools nearby", "parks and recreation"],
        ["modern amenities", "smart home tech", "energy efficiency"],
        ["waterfront views", "luxury finishes", "concierge services"],
        ["transit access", "walkable neighborhood", "urban lifestyle"],
        ["quiet neighborhood", "spacious layouts", "parking included"]
      ]

      return names.map((name, index) => {
        const similarity = 85 + Math.floor(Math.sin(index * 2) * 15)
        const engagement = 70 + Math.floor(Math.cos(index * 3) * 25)
        
        return {
          id: `profile-${index + 1}`,
          name,
          initials: name.split(' ').map(n => n[0]).join(''),
          location: locations[index],
          engagementScore: Math.max(0, Math.min(100, engagement)),
          similarityScore: Math.max(0, Math.min(100, similarity)),
          lastActivity: `${2 + Math.floor(Math.sin(index) * 10)} days ago`,
          preferredContact: (['email', 'phone', 'website'] as const)[index % 3],
          commonInterests: interests[index % interests.length],
          demographics: {
            ageRange: ['25-35', '35-45', '45-55'][index % 3],
            familyStatus: ['Single', 'Married', 'Family'][index % 3],
            income: ['$75K-$125K', '$125K-$200K', '$200K+'][index % 3]
          }
        }
      })
    }

    const generateSimilarityReasons = (): SimilarityReason[] => {
      return [
        {
          category: 'demographic',
          reason: 'Similar age and income bracket',
          strength: 'high',
          description: 'Both profiles fall within the 35-45 age range with household income $125K-$200K'
        },
        {
          category: 'behavioral',
          reason: 'Website engagement patterns',
          strength: 'high',
          description: 'Similar browsing behavior, time spent on lot pages, and brochure download patterns'
        },
        {
          category: 'preference',
          reason: 'Price range and location interests',
          strength: 'medium',
          description: 'Showed interest in properties within similar price ranges and preferred locations'
        },
        {
          category: 'engagement',
          reason: 'Response timing and channel preference',
          strength: 'medium',
          description: 'Similar communication preferences and response patterns to sales outreach'
        }
      ]
    }

    return {
      profiles: generateMockProfiles(),
      similarityReasons: generateSimilarityReasons(),
      lastUpdated: new Date().toISOString(),
      totalSimilarProfiles: 12
    }
  }, [])

  const getContactIcon = (preferredContact: SimilarProfile['preferredContact']) => {
    switch (preferredContact) {
      case 'email': return <Mail className="w-3 h-3" />
      case 'phone': return <Phone className="w-3 h-3" />
      case 'website': return <Globe className="w-3 h-3" />
      default: return <MessageSquare className="w-3 h-3" />
    }
  }

  const getEngagementColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200'
    if (score >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    return 'text-red-600 bg-red-50 border-red-200'
  }

  const getSimilarityColor = (score: number) => {
    if (score >= 85) return 'text-blue-600 bg-blue-50 border-blue-200'
    if (score >= 70) return 'text-purple-600 bg-purple-50 border-purple-200'
    return 'text-slate-600 bg-slate-50 border-slate-200'
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Similar Profiles
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Customers with similar demographics and engagement patterns
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-slate-500 dark:text-slate-400">
            {similarProfilesData.totalSimilarProfiles} similar profiles found
          </span>
        </div>
      </div>

      {/* Profiles Carousel */}
      <div className="relative">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {similarProfilesData.profiles.map((profile) => (
              <CarouselItem key={profile.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                <Card 
                  className={cn(
                    "cursor-pointer transition-all duration-200 hover:shadow-md",
                    selectedProfile === profile.id 
                      ? "ring-2 ring-blue-500 shadow-md" 
                      : "hover:ring-1 hover:ring-slate-300"
                  )}
                  onClick={() => setSelectedProfile(selectedProfile === profile.id ? null : profile.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={profile.avatar} alt={profile.name} />
                          <AvatarFallback className="text-sm font-medium">
                            {profile.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-sm font-semibold truncate">
                            {profile.name}
                          </CardTitle>
                          <div className="flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span className="text-xs text-slate-500 truncate">
                              {profile.location}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    {/* Scores */}
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className={cn(
                        "p-2 rounded-lg border text-center",
                        getSimilarityColor(profile.similarityScore)
                      )}>
                        <div className="text-lg font-bold">
                          {profile.similarityScore}%
                        </div>
                        <div className="text-xs font-medium">
                          Similarity
                        </div>
                      </div>
                      <div className={cn(
                        "p-2 rounded-lg border text-center",
                        getEngagementColor(profile.engagementScore)
                      )}>
                        <div className="text-lg font-bold">
                          {profile.engagementScore}%
                        </div>
                        <div className="text-xs font-medium">
                          Engagement
                        </div>
                      </div>
                    </div>

                    {/* Contact Preference & Last Activity */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1">
                        {getContactIcon(profile.preferredContact)}
                        <span className="text-xs text-slate-600 dark:text-slate-400 capitalize">
                          {profile.preferredContact}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span className="text-xs text-slate-500">
                          {profile.lastActivity}
                        </span>
                      </div>
                    </div>

                    {/* Common Interests */}
                    <div className="space-y-2">
                      <div className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        Common Interests:
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {profile.commonInterests.map((interest, index) => (
                          <Badge 
                            key={index} 
                            variant="secondary" 
                            className="text-xs px-2 py-0.5"
                          >
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {selectedProfile === profile.id && (
                      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-600">
                        <div className="space-y-3">
                          <div>
                            <div className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                              Demographics:
                            </div>
                            <div className="grid grid-cols-1 gap-1">
                              <div className="flex justify-between">
                                <span className="text-xs text-slate-500">Age:</span>
                                <span className="text-xs font-medium">{profile.demographics.ageRange}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-xs text-slate-500">Status:</span>
                                <span className="text-xs font-medium">{profile.demographics.familyStatus}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-xs text-slate-500">Income:</span>
                                <span className="text-xs font-medium">{profile.demographics.income}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </Carousel>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {Math.round(similarProfilesData.profiles.reduce((sum, p) => sum + p.similarityScore, 0) / similarProfilesData.profiles.length)}%
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400">
            Avg Similarity Score
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {similarProfilesData.profiles.filter(p => p.engagementScore >= 70).length}
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400">
            High Engagement Profiles
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {similarProfilesData.profiles.filter(p => p.similarityScore >= 85).length}
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400">
            Very Similar Profiles
          </div>
        </div>
      </div>
    </div>
  )
}
