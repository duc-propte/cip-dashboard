'use client';

import { useState } from 'react';
import {
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronRight,
  ChevronDown,
  Phone,
  Mail,
  Globe,
  Calendar
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RecencyMonitorData, RecencyBucket } from '@/types';
import { cn } from '@/lib/utils';

interface RecencyMonitorProps {
  data?: RecencyMonitorData;
}

export default function RecencyMonitor({ data }: RecencyMonitorProps) {
  const [expandedBucket, setExpandedBucket] = useState<string | null>(null);

  const toggleBucket = (bucketId: string) => {
    setExpandedBucket(expandedBucket === bucketId ? null : bucketId);
  };

  // Mock data - in a real app, this would come from props or API
  const mockData: RecencyMonitorData = data || {
    buckets: [
      {
        id: 'recent',
        label: '0-3 days',
        daysRange: { min: 0, max: 3 },
        count: 127,
        percentage: 45.2,
        trend: 'increasing',
        trendPercentage: 8.3,
        color: 'bg-green-500',
        description: '127 events',
        lastActivity: {
          type: 'website',
          description: 'Viewed lot details',
          timestamp: new Date('2024-12-20T08:30:00Z').toISOString()
        }
      },
      {
        id: 'fresh',
        label: '4-7 days',
        daysRange: { min: 4, max: 7 },
        count: 89,
        percentage: 31.6,
        trend: 'stable',
        trendPercentage: 1.2,
        color: 'bg-blue-500',
        description: '89 events',
        lastActivity: {
          type: 'email',
          description: 'Opened newsletter',
          timestamp: new Date('2024-12-15T14:20:00Z').toISOString()
        }
      },
      {
        id: 'moderate',
        label: '8-14 days',
        daysRange: { min: 8, max: 14 },
        count: 34,
        percentage: 12.1,
        trend: 'decreasing',
        trendPercentage: -3.5,
        color: 'bg-yellow-500',
        description: '34 events',
        lastActivity: {
          type: 'phone',
          description: 'Sales call completed',
          timestamp: new Date('2024-12-10T11:15:00Z').toISOString()
        }
      },
      {
        id: 'aging',
        label: '15-30 days',
        daysRange: { min: 15, max: 30 },
        count: 21,
        percentage: 7.5,
        trend: 'increasing',
        trendPercentage: 2.1,
        color: 'bg-orange-500',
        description: '21 events',
        lastActivity: {
          type: 'website',
          description: 'Browsed project gallery',
          timestamp: new Date('2024-11-28T16:45:00Z').toISOString()
        }
      },
      {
        id: 'stale',
        label: '30+ days',
        daysRange: { min: 30, max: null },
        count: 10,
        percentage: 3.6,
        trend: 'stable',
        trendPercentage: 0.5,
        color: 'bg-red-500',
        description: '10 events',
        lastActivity: {
          type: 'meeting',
          description: 'Site visit',
          timestamp: new Date('2024-11-05T09:30:00Z').toISOString()
        }
      }
    ],
    totalContacts: 281,
    averageRecency: 5.8,
    riskThreshold: 14,
    insights: [],
    lastUpdated: new Date('2024-12-20T10:30:00Z').toISOString(),
    periodComparison: {
      period: 'vs. last 30 days',
      totalChange: 12.4,
      bucketChanges: [
        { bucketId: 'recent', change: 8.3 },
        { bucketId: 'fresh', change: 1.2 },
        { bucketId: 'moderate', change: -3.5 },
        { bucketId: 'aging', change: 2.1 },
        { bucketId: 'stale', change: 0.5 }
      ]
    }
  };

  const getTrendIcon = (trend: RecencyBucket['trend']) => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp className="h-3 w-3 text-green-600" />;
      case 'decreasing':
        return <TrendingDown className="h-3 w-3 text-red-600" />;
      case 'stable':
        return <Minus className="h-3 w-3 text-slate-500" />;
    }
  };



  const getActivityIcon = (type: 'website' | 'phone' | 'email' | 'meeting') => {
    switch (type) {
      case 'website':
        return <Globe className="h-3 w-3 text-blue-600" />;
      case 'phone':
        return <Phone className="h-3 w-3 text-green-600" />;
      case 'email':
        return <Mail className="h-3 w-3 text-purple-600" />;
      case 'meeting':
        return <Calendar className="h-3 w-3 text-orange-600" />;
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-4 mb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Clock className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">
            Recency Monitor
          </h3>
        </div>
        <Badge variant="outline" className="text-xs">
          {mockData.totalContacts} contacts
        </Badge>
      </div>

      {/* Summary Stats */}
      <div className="mb-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Average Recency
          </span>
          <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
            {mockData.averageRecency} days
          </span>
        </div>
        <div className="flex items-center space-x-2 text-xs text-slate-500">
          {mockData.periodComparison.totalChange > 0 ? (
            <TrendingUp className="h-3 w-3 text-green-600" />
          ) : (
            <TrendingDown className="h-3 w-3 text-red-600" />
          )}
          <span>
            {Math.abs(mockData.periodComparison.totalChange)}% {mockData.periodComparison.period}
          </span>
        </div>
      </div>

      {/* Recency Buckets */}
      <div className="space-y-3 mb-4">
        {mockData.buckets.map((bucket) => (
          <div key={bucket.id} className="rounded-lg">
            <div
              className="p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors rounded-lg"
              onClick={() => toggleBucket(bucket.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={cn("w-3 h-3 rounded-full", bucket.color)} />
                  <div>
                    <div className="font-medium text-sm text-slate-900 dark:text-slate-100">
                      {bucket.label}
                    </div>
                    <div className="text-xs text-slate-500">
                      {bucket.description}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-right">
                    <div className="font-bold text-sm text-slate-900 dark:text-slate-100">
                      {bucket.count}
                    </div>
                    <div className="text-xs text-slate-500">
                      {bucket.percentage}%
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    {getTrendIcon(bucket.trend)}
                    <span className="text-xs text-slate-500">
                      {Math.abs(bucket.trendPercentage)}%
                    </span>
                  </div>
                  {expandedBucket === bucket.id ? (
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-2">
                <Progress value={bucket.percentage} className="h-2" />
              </div>
            </div>

            {/* Expanded Bucket Details */}
            {expandedBucket === bucket.id && (
              <div className="px-3 pb-3 pt-3 bg-slate-50/50 dark:bg-slate-800/25 rounded-b-lg">
                <div className="space-y-2">
                  {bucket.lastActivity && (
                    <div className="flex items-center space-x-2 text-xs">
                      {getActivityIcon(bucket.lastActivity.type)}
                      <span className="text-slate-600 dark:text-slate-400">
                        Last: {bucket.lastActivity.description}
                      </span>
                      <span className="text-slate-500">
                        {formatTimeAgo(bucket.lastActivity.timestamp)}
                      </span>
                    </div>
                  )}
                  <div className="text-xs text-slate-500">
                    Range: {bucket.daysRange.min}-{bucket.daysRange.max || '∞'} days
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
        <div className="text-xs text-slate-500 text-center">
          Last updated: {mockData.lastUpdated.split('T')[1].split('.')[0]}
        </div>
      </div>
    </div>
  );
}
