"use client"

import { useState, useMemo } from "react"
import { Building2, TrendingUp, TrendingDown, Activity, Clock, MapPin, Eye, Calendar, DollarSign } from "lucide-react"
import { cn } from "@/lib/utils"
import { OtherEngagedProjectsData, ProjectEngagement } from "@/types"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function OtherEngagedProjects() {
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Generate deterministic mock data
  const projectsData: OtherEngagedProjectsData = useMemo(() => {
    const generateMockProjects = (): ProjectEngagement[] => {
      const projects = [
        {
          name: "Lakefront Luxury Condos",
          location: "Mississauga Waterfront", 
          priceRange: "$850K - $1.2M",
          propertyType: "Luxury Condominiums",
          status: "selling" as const
        },
        {
          name: "Heritage Square Townhomes", 
          location: "Downtown Toronto",
          priceRange: "$750K - $950K", 
          propertyType: "Heritage Townhomes",
          status: "pre-launch" as const
        },
        {
          name: "Riverside Gardens",
          location: "Richmond Hill",
          priceRange: "$650K - $800K",
          propertyType: "Garden Homes", 
          status: "selling" as const
        },
        {
          name: "Metro Heights Tower",
          location: "North York",
          priceRange: "$450K - $750K",
          propertyType: "High-rise Condos",
          status: "sold-out" as const
        },
        {
          name: "Greenwood Estates",
          location: "Markham",
          priceRange: "$900K - $1.5M",
          propertyType: "Detached Homes",
          status: "selling" as const
        },
        {
          name: "Harbor View Residences",
          location: "Etobicoke",
          priceRange: "$500K - $700K", 
          propertyType: "Mid-rise Condos",
          status: "completed" as const
        }
      ]

      return projects.map((project, index) => {
        const engagementScore = 45 + Math.floor(Math.sin(index * 2) * 35)
        const totalInteractions = 8 + Math.floor(Math.cos(index * 3) * 25)
        
        const engagementLevels: Array<'high' | 'medium' | 'low'> = ['high', 'medium', 'low']
        const engagementTypes: Array<'active' | 'monitoring' | 'dormant'> = ['active', 'monitoring', 'dormant']
        
        const activities = [
          "Viewed property details", "Downloaded brochure", "Attended virtual tour",
          "Requested pricing info", "Saved to favorites", "Signed up for updates",
          "Attended sales event", "Requested callback", "Viewed floor plans"
        ]

        return {
          projectId: `project-${index + 1}`,
          projectName: project.name,
          location: project.location,
          engagementLevel: engagementLevels[index % 3],
          engagementScore: Math.max(0, Math.min(100, engagementScore)),
          lastEngagement: `${3 + Math.floor(Math.sin(index) * 20)} days ago`,
          engagementType: engagementTypes[index % 3],
          totalInteractions: Math.max(1, totalInteractions),
          keyActivities: activities.slice(0, 3 + (index % 3)),
          timeline: {
            firstEngagement: `${60 + Math.floor(Math.cos(index) * 30)} days ago`,
            mostRecentActivity: `${3 + Math.floor(Math.sin(index) * 20)} days ago`,
            peakEngagement: `${20 + Math.floor(Math.sin(index * 2) * 15)} days ago`
          },
          projectDetails: {
            priceRange: project.priceRange,
            propertyType: project.propertyType,
            status: project.status,
            expectedCompletion: project.status === 'pre-launch' ? '2025 Q2' : undefined
          }
        }
      })
    }

    const projects = generateMockProjects()
    return {
      projects,
      totalProjects: projects.length,
      activeProjects: projects.filter(p => p.engagementType === 'active').length,
      lastUpdated: new Date().toISOString()
    }
  }, [])

  const getEngagementLevelColor = (level: ProjectEngagement['engagementLevel']) => {
    switch (level) {
      case 'high': return 'bg-green-100 text-green-800 border-green-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-red-100 text-red-800 border-red-200'
    }
  }

  const getEngagementTypeColor = (type: ProjectEngagement['engagementType']) => {
    switch (type) {
      case 'active': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'monitoring': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'dormant': return 'bg-slate-100 text-slate-800 border-slate-200'
    }
  }

  const getStatusColor = (status: ProjectEngagement['projectDetails']['status']) => {
    switch (status) {
      case 'pre-launch': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'selling': return 'bg-green-100 text-green-800 border-green-200'
      case 'sold-out': return 'bg-red-100 text-red-800 border-red-200'
      case 'completed': return 'bg-slate-100 text-slate-800 border-slate-200'
    }
  }

  const getEngagementIcon = (type: ProjectEngagement['engagementType']) => {
    switch (type) {
      case 'active': return <TrendingUp className="w-4 h-4" />
      case 'monitoring': return <Eye className="w-4 h-4" />
      case 'dormant': return <TrendingDown className="w-4 h-4" />
    }
  }

  // Sort projects by engagement score (highest first)
  const sortedProjects = useMemo(() => {
    return [...projectsData.projects].sort((a, b) => b.engagementScore - a.engagementScore)
  }, [projectsData.projects])

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Other Engaged Projects
          </h2>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {projectsData.activeProjects} active • {projectsData.totalProjects} total
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                "p-2 rounded text-xs",
                viewMode === 'grid' 
                  ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              )}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                "p-2 rounded text-xs",
                viewMode === 'list' 
                  ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              )}
            >
              List
            </button>
          </div>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {projectsData.activeProjects}
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400">
            Active Projects
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {Math.round(sortedProjects.reduce((sum, p) => sum + p.engagementScore, 0) / sortedProjects.length)}%
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400">
            Avg Engagement
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {sortedProjects.reduce((sum, p) => sum + p.totalInteractions, 0)}
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400">
            Total Interactions
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {sortedProjects.filter(p => p.engagementLevel === 'high').length}
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400">
            High Interest
          </div>
        </div>
      </div>

      {/* Projects Grid/List */}
      <div className={cn(
        viewMode === 'grid' 
          ? "grid grid-cols-1 lg:grid-cols-2 gap-4" 
          : "space-y-4"
      )}>
        {sortedProjects.map((project) => (
          <Card 
            key={project.projectId}
            className={cn(
              "cursor-pointer transition-all duration-200 hover:shadow-md",
              selectedProject === project.projectId 
                ? "ring-2 ring-blue-500 shadow-md" 
                : "hover:ring-1 hover:ring-slate-300"
            )}
            onClick={() => setSelectedProject(selectedProject === project.projectId ? null : project.projectId)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-base font-semibold truncate">
                    {project.projectName}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span className="text-xs text-slate-500">
                        {project.location}
                      </span>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={cn("text-xs", getStatusColor(project.projectDetails.status))}
                    >
                      {project.projectDetails.status.replace('-', ' ')}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getEngagementIcon(project.engagementType)}
                  <Badge 
                    variant="outline" 
                    className={cn("text-xs", getEngagementTypeColor(project.engagementType))}
                  >
                    {project.engagementType}
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              {/* Engagement Score */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Engagement Score
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {project.engagementScore}%
                    </span>
                    <Badge 
                      variant="outline" 
                      className={cn("text-xs", getEngagementLevelColor(project.engagementLevel))}
                    >
                      {project.engagementLevel}
                    </Badge>
                  </div>
                </div>
                <Progress 
                  value={project.engagementScore} 
                  className="h-2"
                />
              </div>

              {/* Project Details */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Property Type
                  </div>
                  <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {project.projectDetails.propertyType}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Price Range
                  </div>
                  <div className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />
                    {project.projectDetails.priceRange}
                  </div>
                </div>
              </div>

              {/* Activity Summary */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1">
                  <Activity className="w-3 h-3 text-slate-400" />
                  <span className="text-slate-500">
                    {project.totalInteractions} interactions
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span className="text-slate-500">
                    {project.lastEngagement}
                  </span>
                </div>
              </div>

              {/* Expanded Details */}
              {selectedProject === project.projectId && (
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-600">
                  <div className="space-y-4">
                    {/* Timeline */}
                    <div>
                      <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Engagement Timeline
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-slate-500">First Engagement:</span>
                          <span className="text-xs font-medium">{project.timeline.firstEngagement}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-slate-500">Peak Activity:</span>
                          <span className="text-xs font-medium">{project.timeline.peakEngagement}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-slate-500">Most Recent:</span>
                          <span className="text-xs font-medium">{project.timeline.mostRecentActivity}</span>
                        </div>
                      </div>
                    </div>

                    {/* Key Activities */}
                    <div>
                      <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Key Activities
                      </div>
                      <div className="space-y-1">
                        {project.keyActivities.map((activity, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                            <span className="text-xs text-slate-600 dark:text-slate-400">
                              {activity}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Additional Project Info */}
                    {project.projectDetails.expectedCompletion && (
                      <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-orange-600" />
                          <div>
                            <div className="text-xs font-medium text-orange-800 dark:text-orange-200">
                              Expected Launch: {project.projectDetails.expectedCompletion}
                            </div>
                            <div className="text-xs text-orange-600 dark:text-orange-300">
                              Pre-launch interest shown
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Insights */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
          💡 Engagement Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="text-blue-800 dark:text-blue-200">
            • Highest engagement with {sortedProjects[0]?.projectName} ({sortedProjects[0]?.engagementScore}%)
          </div>
          <div className="text-blue-800 dark:text-blue-200">
            • Strong interest in {sortedProjects.filter(p => p.projectDetails.priceRange.includes('$750K')).length > 0 ? '$750K+' : 'mid-range'} properties
          </div>
          <div className="text-blue-800 dark:text-blue-200">
            • Most active in {projectsData.projects.filter(p => p.engagementType === 'active').length} ongoing projects
          </div>
          <div className="text-blue-800 dark:text-blue-200">
            • Geographic preference: {projectsData.projects.map(p => p.location.split(' ')[0]).slice(0, 2).join(', ')} areas
          </div>
        </div>
      </div>
    </div>
  )
}
