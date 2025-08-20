"use client"

import { useState } from "react"
import { 
  AlertTriangle, 
  TrendingDown, 
  TrendingUp, 
  Shield, 
  Clock, 
  Target, 
  Phone, 
  Gift, 
  Users, 
  ChevronRight, 
  ChevronDown,
  Info,
  Zap,
  Activity,
  Calendar,
  CheckCircle,
  AlertCircle,
  Minus,
  BarChart3,
  Lightbulb
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { ChurnMonitoringData } from "@/types"

interface ChurnMonitoringProps {
  data?: ChurnMonitoringData
}

export default function ChurnMonitoring({ data }: ChurnMonitoringProps) {
  const [expandedSection, setExpandedSection] = useState<'risk-factors' | 'prevention' | 'history' | null>(null)
  const [expandedFactor, setExpandedFactor] = useState<string | null>(null)

  const toggleSection = (section: 'risk-factors' | 'prevention' | 'history') => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  const toggleFactor = (factorId: string) => {
    setExpandedFactor(expandedFactor === factorId ? null : factorId)
  }

  // Mock data - in a real app, this would come from props or API
  const mockData: ChurnMonitoringData = data || {
    prediction: {
      riskScore: 72,
      riskLevel: 'high',
      confidence: 89,
      timeToChurn: '2-3 weeks',
      primaryRiskFactors: ['Declining engagement', 'No recent contact', 'Competitor activity'],
      trend: 'worsening',
      lastCalculated: '2025-08-20T11:30:00Z'
    },
    riskFactors: [
      {
        id: 'rf1',
        name: 'Engagement Decline',
        description: 'User engagement has dropped 45% over the last 2 weeks',
        category: 'engagement',
        impact: 'high',
        direction: 'negative',
        value: 35,
        threshold: 60,
        trend: 'decreasing',
        lastUpdated: '2025-08-20T10:00:00Z',
        details: {
          historicalData: [
            { date: '2025-08-06', value: 80 },
            { date: '2025-08-13', value: 55 },
            { date: '2025-08-20', value: 35 }
          ],
          benchmark: 65,
          recommendation: 'Schedule immediate follow-up call'
        }
      },
      {
        id: 'rf2',
        name: 'Communication Gap',
        description: 'No contact from sales team in 12 days',
        category: 'communication',
        impact: 'high',
        direction: 'negative',
        value: 12,
        threshold: 7,
        trend: 'increasing',
        lastUpdated: '2025-08-20T08:00:00Z',
        details: {
          benchmark: 5,
          recommendation: 'Immediate outreach required'
        }
      },
      {
        id: 'rf3',
        name: 'Competitor Research',
        description: 'Increased visits to competitor websites detected',
        category: 'behavior',
        impact: 'medium',
        direction: 'negative',
        value: 8,
        threshold: 3,
        trend: 'increasing',
        lastUpdated: '2025-08-19T16:00:00Z',
        details: {
          benchmark: 2,
          recommendation: 'Present competitive advantages'
        }
      },
      {
        id: 'rf4',
        name: 'Project Interest',
        description: 'Still showing interest in premium lots',
        category: 'engagement',
        impact: 'medium',
        direction: 'positive',
        value: 75,
        threshold: 50,
        trend: 'stable',
        lastUpdated: '2025-08-20T09:30:00Z',
        details: {
          benchmark: 60,
          recommendation: 'Leverage this interest for re-engagement'
        }
      }
    ],
    preventionStrategies: [
      {
        id: 'ps1',
        title: 'Immediate Personal Outreach',
        description: 'Schedule urgent call with senior sales representative',
        priority: 'urgent',
        category: 'communication',
        estimatedImpact: 85,
        effort: 'low',
        timeline: 'Within 24 hours',
        actions: [
          'Call customer directly',
          'Address any concerns',
          'Schedule in-person meeting',
          'Provide exclusive offer'
        ],
        successRate: 78
      },
      {
        id: 'ps2',
        title: 'Competitive Analysis Presentation',
        description: 'Present detailed comparison showing our advantages',
        priority: 'high',
        category: 'support',
        estimatedImpact: 70,
        effort: 'medium',
        timeline: '2-3 days',
        actions: [
          'Prepare comparison document',
          'Highlight unique value propositions',
          'Schedule presentation meeting',
          'Provide exclusive previews'
        ],
        successRate: 65
      },
      {
        id: 'ps3',
        title: 'VIP Experience Package',
        description: 'Offer exclusive VIP treatment and special incentives',
        priority: 'high',
        category: 'incentive',
        estimatedImpact: 80,
        effort: 'medium',
        timeline: '1 week',
        actions: [
          'Private lot viewing',
          'Meet with architect',
          'Special pricing consideration',
          'Priority selection privileges'
        ],
        successRate: 72
      },
      {
        id: 'ps4',
        title: 'Re-engagement Campaign',
        description: 'Multi-channel re-engagement with personalized content',
        priority: 'medium',
        category: 'engagement',
        estimatedImpact: 60,
        effort: 'high',
        timeline: '2 weeks',
        actions: [
          'Personalized email series',
          'Social media engagement',
          'Direct mail package',
          'Follow-up surveys'
        ],
        successRate: 58
      }
    ],
    historicalRisk: [
      { date: '2025-08-06', riskScore: 45, events: ['Initial interest decline'] },
      { date: '2025-08-13', riskScore: 58, events: ['Missed follow-up call'] },
      { date: '2025-08-20', riskScore: 72, events: ['Competitor research detected'] }
    ],
    benchmarks: {
      industryAverage: 42,
      companyAverage: 38,
      similarProfiles: 51
    },
    lastUpdated: '2025-08-20T11:30:00Z'
  }

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20'
      case 'medium': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20'
      case 'high': return 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20'
      case 'critical': return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20'
      default: return 'text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-700/50'
    }
  }

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'high': return <AlertTriangle className="w-3 h-3 text-red-500" />
      case 'medium': return <AlertCircle className="w-3 h-3 text-yellow-500" />
      case 'low': return <Info className="w-3 h-3 text-blue-500" />
      default: return <Info className="w-3 h-3 text-slate-500" />
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return <TrendingUp className="w-3 h-3 text-red-500" />
      case 'decreasing': return <TrendingDown className="w-3 h-3 text-green-500" />
      case 'stable': return <Minus className="w-3 h-3 text-slate-500" />
      default: return <Minus className="w-3 h-3 text-slate-500" />
    }
  }

  const getDirectionIcon = (direction: string) => {
    switch (direction) {
      case 'positive': return <CheckCircle className="w-3 h-3 text-green-500" />
      case 'negative': return <AlertCircle className="w-3 h-3 text-red-500" />
      case 'neutral': return <Minus className="w-3 h-3 text-slate-500" />
      default: return <Minus className="w-3 h-3 text-slate-500" />
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'communication': return <Phone className="w-3 h-3" />
      case 'incentive': return <Gift className="w-3 h-3" />
      case 'support': return <Users className="w-3 h-3" />
      case 'engagement': return <Activity className="w-3 h-3" />
      default: return <Target className="w-3 h-3" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'border-l-red-500 bg-red-50 dark:bg-red-900/10'
      case 'high': return 'border-l-orange-500 bg-orange-50 dark:bg-orange-900/10'
      case 'medium': return 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/10'
      case 'low': return 'border-l-green-500 bg-green-50 dark:bg-green-900/10'
      default: return 'border-l-slate-500 bg-slate-50 dark:bg-slate-700/50'
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date('2025-08-20T12:00:00Z')
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) {
      return 'Just now'
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`
    } else if (diffInMinutes < 10080) {
      return `${Math.floor(diffInMinutes / 1440)}d ago`
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
  }

  return (
    <div className="p-4 border-b border-slate-200 dark:border-slate-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Shield className="w-4 h-4 text-slate-600 dark:text-slate-400" />
          <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
            Churn Risk Monitor
          </h3>
        </div>
      </div>

      {/* Risk Score Overview */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
            Risk Score
          </span>
          <Badge className={`text-xs capitalize ${getRiskLevelColor(mockData.prediction.riskLevel)}`}>
            {mockData.prediction.riskLevel} Risk
          </Badge>
        </div>
        
        <div className="relative mb-2">
          <Progress 
            value={mockData.prediction.riskScore} 
            className="h-3"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold text-white drop-shadow">
              {mockData.prediction.riskScore}%
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center space-x-1">
            <span className="text-slate-500 dark:text-slate-400">Confidence:</span>
            <span className="font-medium text-slate-900 dark:text-slate-100">
              {mockData.prediction.confidence}%
            </span>
          </div>
          {mockData.prediction.timeToChurn && (
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3 text-slate-500" />
              <span className="text-slate-600 dark:text-slate-400">
                {mockData.prediction.timeToChurn}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Trend Indicator */}
      <div className={`p-2 rounded-lg mb-4 ${mockData.prediction.trend === 'worsening' ? 'bg-red-50 dark:bg-red-900/20' : mockData.prediction.trend === 'improving' ? 'bg-green-50 dark:bg-green-900/20' : 'bg-slate-50 dark:bg-slate-700/50'}`}>
        <div className="flex items-center space-x-2">
          {mockData.prediction.trend === 'worsening' ? (
            <TrendingUp className="w-4 h-4 text-red-600" />
          ) : mockData.prediction.trend === 'improving' ? (
            <TrendingDown className="w-4 h-4 text-green-600" />
          ) : (
            <Minus className="w-4 h-4 text-slate-600" />
          )}
          <span className={`text-xs font-medium ${mockData.prediction.trend === 'worsening' ? 'text-red-700 dark:text-red-300' : mockData.prediction.trend === 'improving' ? 'text-green-700 dark:text-green-300' : 'text-slate-700 dark:text-slate-300'}`}>
            Risk is {mockData.prediction.trend}
          </span>
        </div>
      </div>

      {/* Risk Factors Section */}
      <div className="mb-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => toggleSection('risk-factors')}
          className="w-full justify-between h-8 px-2 text-xs"
        >
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-3 h-3" />
            <span>Risk Factors ({mockData.riskFactors.length})</span>
          </div>
          {expandedSection === 'risk-factors' ? (
            <ChevronDown className="w-3 h-3" />
          ) : (
            <ChevronRight className="w-3 h-3" />
          )}
        </Button>

        {expandedSection === 'risk-factors' && (
          <div className="mt-2 space-y-2 max-h-48 overflow-y-auto scrollbar-hide">
            {mockData.riskFactors.map((factor) => (
              <div 
                key={factor.id} 
                className="p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50"
                onClick={() => toggleFactor(factor.id)}
              >
                <div className="flex items-start justify-between mb-1">
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    {getImpactIcon(factor.impact)}
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-slate-900 dark:text-slate-100 truncate">
                        {factor.name}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 flex-shrink-0">
                    {getDirectionIcon(factor.direction)}
                    {getTrendIcon(factor.trend)}
                  </div>
                </div>
                
                <div className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                  {factor.description}
                </div>

                {expandedFactor === factor.id && factor.details?.recommendation && (
                  <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-xs">
                    <div className="flex items-start space-x-1">
                      <Lightbulb className="w-3 h-3 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span className="text-blue-700 dark:text-blue-300">
                        {factor.details.recommendation}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Prevention Strategies Section */}
      <div className="mb-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => toggleSection('prevention')}
          className="w-full justify-between h-8 px-2 text-xs"
        >
          <div className="flex items-center space-x-2">
            <Zap className="w-3 h-3" />
            <span>Prevention Strategies ({mockData.preventionStrategies.length})</span>
          </div>
          {expandedSection === 'prevention' ? (
            <ChevronDown className="w-3 h-3" />
          ) : (
            <ChevronRight className="w-3 h-3" />
          )}
        </Button>

        {expandedSection === 'prevention' && (
          <div className="mt-2 space-y-2 max-h-64 overflow-y-auto scrollbar-hide">
            {mockData.preventionStrategies.map((strategy) => (
              <div 
                key={strategy.id} 
                className={`p-3 rounded-lg border-l-4 ${getPriorityColor(strategy.priority)}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    {getCategoryIcon(strategy.category)}
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-slate-900 dark:text-slate-100">
                        {strategy.title}
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">
                        {strategy.description}
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs capitalize">
                    {strategy.priority}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs mb-2">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">Impact:</span>
                    <span className="ml-1 font-medium text-green-600 dark:text-green-400">
                      {strategy.estimatedImpact}%
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">Effort:</span>
                    <span className="ml-1 capitalize text-slate-900 dark:text-slate-100">
                      {strategy.effort}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">Timeline:</span>
                    <span className="ml-1 text-slate-900 dark:text-slate-100">
                      {strategy.timeline}
                    </span>
                  </div>
                </div>

                {strategy.successRate && (
                  <div className="mb-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-500 dark:text-slate-400">Success Rate</span>
                      <span className="text-slate-900 dark:text-slate-100">{strategy.successRate}%</span>
                    </div>
                    <Progress value={strategy.successRate} className="h-1.5" />
                  </div>
                )}

                <div className="space-y-1">
                  {strategy.actions.slice(0, 2).map((action, index) => (
                    <div key={index} className="flex items-center space-x-2 text-xs">
                      <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                      <span className="text-slate-600 dark:text-slate-400">{action}</span>
                    </div>
                  ))}
                  {strategy.actions.length > 2 && (
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      +{strategy.actions.length - 2} more actions
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Historical Risk Section */}
      <div className="mb-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => toggleSection('history')}
          className="w-full justify-between h-8 px-2 text-xs"
        >
          <div className="flex items-center space-x-2">
            <Calendar className="w-3 h-3" />
            <span>Risk History</span>
          </div>
          {expandedSection === 'history' ? (
            <ChevronDown className="w-3 h-3" />
          ) : (
            <ChevronRight className="w-3 h-3" />
          )}
        </Button>

        {expandedSection === 'history' && (
          <div className="mt-2 space-y-2">
            {mockData.historicalRisk.slice().reverse().map((entry, index) => (
              <div key={index} className="flex items-center space-x-3 p-2 bg-slate-50 dark:bg-slate-700 rounded">
                <div className="text-xs text-slate-500 dark:text-slate-400 w-12">
                  {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
                <div className="flex-1">
                  <Progress value={entry.riskScore} className="h-1.5" />
                </div>
                <div className="text-xs font-medium text-slate-900 dark:text-slate-100 w-8">
                  {entry.riskScore}%
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
        <div className="text-xs text-center text-slate-500 dark:text-slate-400">
          Last updated: {formatTime(mockData.lastUpdated)}
        </div>
      </div>
    </div>
  )
}
