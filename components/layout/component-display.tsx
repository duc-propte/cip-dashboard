'use client';

import React, { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

// Import all components
import UserProfile from '@/components/sidebar/user-profile';
import ProfileBadges from '@/components/sidebar/profile-badges';
import EngagementScore from '@/components/sidebar/engagement-score';
import ChannelEngagement from '@/components/sidebar/channel-engagement';
import EngagementFeed from '@/components/sidebar/engagement-feed';
import KeyInterests from '@/components/sidebar/key-interests';
import PropensityPredictions from '@/components/sidebar/propensity-predictions';
import ActivityTimeline from '@/components/main/activity-timeline';
import EngagementTimeHeatmap from '@/components/main/engagement-time-heatmap';
import ActionRecommendations from '@/components/main/action-recommendations';
import SimilarProfilesCarousel from '@/components/main/similar-profiles-carousel';
import OtherEngagedProjects from '@/components/main/other-engaged-projects';
import ChurnMonitoring from '@/components/sidebar/churn-monitoring';
import RecencyMonitor from '@/components/sidebar/recency-monitor';

// Import versioned components
import UserProfileV1 from '@/components/user-profile-versions/user-profile-v1';
import UserProfileV2 from '@/components/user-profile-versions/user-profile-v2';
import UserProfileV3 from '@/components/user-profile-versions/user-profile-v3';
import UserProfileV4 from '@/components/user-profile-versions/user-profile-v4';

import ProfileBadgesV1 from '@/components/profile-badges-versions/profile-badges-v1';
import ProfileBadgesV2 from '@/components/profile-badges-versions/profile-badges-v2';
import ProfileBadgesV3 from '@/components/profile-badges-versions/profile-badges-v3';

import EngagementScoreV1 from '@/components/engagement-score-versions/engagement-score-v1';
import EngagementScoreV2 from '@/components/engagement-score-versions/engagement-score-v2';
import EngagementScoreV3 from '@/components/engagement-score-versions/engagement-score-v3';


import EngagementFeedV2 from '@/components/engagement-feed-versions/engagement-feed-v2';
import EngagementFeedV3 from '@/components/engagement-feed-versions/engagement-feed-v3';
import EngagementFeedV4 from '@/components/engagement-feed-versions/engagement-feed-v4';

import KeyInterestsV1 from '@/components/key-interests-versions/key-interests-v1';
import KeyInterestsV2 from '@/components/key-interests-versions/key-interests-v2';
import KeyInterestsV3 from '@/components/key-interests-versions/key-interests-v3';
import KeyInterestsV4 from '@/components/key-interests-versions/key-interests-v4';

import PropensityPredictionsV1 from '@/components/propensity-predictions-versions/propensity-predictions-v1';
import PropensityPredictionsV2 from '@/components/propensity-predictions-versions/propensity-predictions-v2';
import PropensityPredictionsV3 from '@/components/propensity-predictions-versions/propensity-predictions-v3';
import PropensityPredictionsV4 from '@/components/propensity-predictions-versions/propensity-predictions-v4';

import ActivityTimelineV1 from '@/components/activity-timeline-versions/activity-timeline-v1';
import ActivityTimelineV2 from '@/components/activity-timeline-versions/activity-timeline-v2';
import ActivityTimelineV3 from '@/components/activity-timeline-versions/activity-timeline-v3';
import ActivityTimelineV4 from '@/components/activity-timeline-versions/activity-timeline-v4';

import EngagementTimeHeatmapV1 from '@/components/engagement-time-heatmap-versions/engagement-time-heatmap-v1';
import EngagementTimeHeatmapV2 from '@/components/engagement-time-heatmap-versions/engagement-time-heatmap-v2';
import EngagementTimeHeatmapV3 from '@/components/engagement-time-heatmap-versions/engagement-time-heatmap-v3';
import EngagementTimeHeatmapV4 from '@/components/engagement-time-heatmap-versions/engagement-time-heatmap-v4';

import ActionRecommendationsV1 from '@/components/action-recommendations-versions/action-recommendations-v1';
import ActionRecommendationsV2 from '@/components/action-recommendations-versions/action-recommendations-v2';
import ActionRecommendationsV3 from '@/components/action-recommendations-versions/action-recommendations-v3';
import ActionRecommendationsV4 from '@/components/action-recommendations-versions/action-recommendations-v4';

import { User } from '@/types';

interface ComponentDisplayProps {
  selectedComponent: string | null;
}

interface ComponentVersion {
  id: string;
  name: string;
  description: string;
  component: React.ReactElement;
}

interface ComponentInfo {
  title: string;
  description: string;
  category: string;
  component?: React.ReactElement;
  hasVersions?: boolean;
  versions?: ComponentVersion[];
}

// Mock data
const mockUser: User = {
  id: "1",
  name: "John Doe",
  email: "john.doe@company.com",
  phone: "+1 (555) 123-4567",
  avatar: "",
  lastActive: new Date('2024-12-22T10:00:00Z').toISOString()
};

const generateMockHeatmapData = () => {
  const timeSlots = [];
  const totalEngagements = 1247;
  
  const seededRandom = (day: number, hour: number) => {
    const seed = day * 100 + hour;
    return ((seed * 9301 + 49297) % 233280) / 233280;
  };
  
  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
      let baseEngagement = 5;
      const random = seededRandom(day, hour);
      
      if (day >= 1 && day <= 5) {
        if (hour >= 9 && hour <= 17) {
          baseEngagement = Math.floor(random * 50) + 20;
        } else if (hour >= 7 && hour <= 21) {
          baseEngagement = Math.floor(random * 30) + 10;
        } else {
          baseEngagement = Math.floor(random * 10) + 1;
        }
      } else {
        if (hour >= 10 && hour <= 20) {
          baseEngagement = Math.floor(random * 35) + 10;
        } else {
          baseEngagement = Math.floor(random * 8) + 1;
        }
      }
      
      timeSlots.push({
        dayOfWeek: day,
        hour,
        engagementCount: baseEngagement,
        intensity: Math.min(baseEngagement / 70, 1)
      });
    }
  }
  
  const hourTotals = Array(24).fill(0);
  const dayTotals = Array(7).fill(0);
  
  timeSlots.forEach(slot => {
    hourTotals[slot.hour] += slot.engagementCount;
    dayTotals[slot.dayOfWeek] += slot.engagementCount;
  });
  
  const peakHours = hourTotals
    .map((count, hour) => ({ hour, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);
  
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const peakDays = dayTotals
    .map((count, dayOfWeek) => ({ dayOfWeek, dayName: dayNames[dayOfWeek], count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);
  
  const fixedDate = new Date('2024-12-20T10:30:00Z');
  const startDate = new Date(fixedDate.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  return {
    timeSlots,
    totalEngagements,
    peakHours,
    peakDays,
    lastUpdated: fixedDate.toISOString(),
    dateRange: {
      start: startDate.toISOString().split('T')[0],
      end: fixedDate.toISOString().split('T')[0]
    }
  };
};

const componentInfo: Record<string, ComponentInfo> = {
  'user-profile-versions': {
    title: 'User Profile',
    description: 'Multiple variations of the user profile component',
    category: 'Profile Summary',
    hasVersions: true,
    versions: [
      {
        id: 'original',
        name: 'Original Version',
        description: 'Full-featured layout with detailed information',
        component: <UserProfile user={mockUser} />
      },
      {
        id: 'v1',
        name: 'Compact Version',
        description: 'Space-efficient horizontal layout',
        component: <UserProfileV1 user={mockUser} />
      },
      {
        id: 'v2',
        name: 'Card Style Version',
        description: 'Card-based layout with action buttons',
        component: <UserProfileV2 user={mockUser} />
      },
      {
        id: 'v3',
        name: 'Contact Details Version',
        description: 'Shows all emails, phones, and most interacted contact information',
        component: <UserProfileV3 user={mockUser} />
      },
      {
        id: 'v4',
        name: 'Recent Activity Version',
        description: 'Shows recent email and phone communication history',
        component: <UserProfileV4 user={mockUser} />
      }
    ]
  },
  'profile-badges': {
    title: 'Profile Badges',
    description: 'Achievement and status badges for the user',
    category: 'Profile Summary',
    component: <ProfileBadges />
  },
  'profile-badges-versions': {
    title: 'Profile Badges',
    description: 'Multiple variations of profile badges with sales intelligence',
    category: 'Profile Summary',
    hasVersions: true,
    versions: [
      {
        id: 'original',
        name: 'Original Version',
        description: 'Comprehensive badge system with detailed timelines',
        component: <ProfileBadges />
      },
      {
        id: 'v1',
        name: 'Sales Insights Version',
        description: 'Enhanced with sales intelligence and conversion insights',
        component: <ProfileBadgesV1 />
      },
      {
        id: 'v2',
        name: 'Sales Dashboard Version',
        description: 'Revenue-focused dashboard with deal value calculations',
        component: <ProfileBadgesV2 />
      },
      {
        id: 'v3',
        name: 'Customer Intelligence Version',
        description: 'Persona mapping and behavioral analysis for sales strategy',
        component: <ProfileBadgesV3 />
      }
    ]
  },
  'engagement-score': {
    title: 'Engagement Score',
    description: 'Overall engagement metrics and scoring',
    category: 'Engagement Metrics',
    component: <EngagementScore />
  },
  'engagement-score-versions': {
    title: 'Engagement Score',
    description: 'Multiple variations with lead temperature and recency analysis',
    category: 'Engagement Metrics',
    hasVersions: true,
    versions: [
      {
        id: 'original',
        name: 'Original Version',
        description: 'Standard engagement scoring with trend analysis',
        component: <EngagementScore />
      },
      {
        id: 'v1',
        name: 'Lead Temperature Version',
        description: 'Hot/Warm/Cold lead classification with sales actions',
        component: <EngagementScoreV1 />
      },
      {
        id: 'v2',
        name: 'Recency Bands Version',
        description: 'Time-based engagement analysis with conversion rates',
        component: <EngagementScoreV2 />
      },
      {
        id: 'v3',
        name: 'Smart Scoring Version',
        description: 'Combined temperature and recency for intelligent prioritization',
        component: <EngagementScoreV3 />
      }
    ]
  },
  'channel-engagement': {
    title: 'Channel Engagement',
    description: 'Engagement metrics across different communication channels',
    category: 'Engagement Metrics',
    component: <ChannelEngagement />
  },
  'engagement-feed': {
    title: 'Engagement Feed',
    description: 'Recent engagement activities and interactions',
    category: 'Engagement Metrics',
    component: <EngagementFeed />
  },
  'engagement-feed-versions': {
    title: 'Engagement Feed',
    description: 'Multiple visualization styles for engagement activities',
    category: 'Engagement Metrics',
    hasVersions: true,
    versions: [
      {
        id: 'original',
        name: 'Original Version',
        description: 'Standard feed with expandable details and filtering',
        component: <EngagementFeed />
      },
      {
        id: 'v1',
        name: 'Detailed Timeline Version',
        description: 'Enhanced timeline with expandable sub-activities for each engagement',
        component: <EngagementFeedV4 />
      },
      {
        id: 'v2',
        name: 'Priority Cards Version',
        description: 'Card-based layout with priority sorting and action recommendations',
        component: <EngagementFeedV2 />
      },
      {
        id: 'v3',
        name: 'Workflow Kanban Version',
        description: 'Kanban board organized by status with workflow management',
        component: <EngagementFeedV3 />
      }
      // {
      //   id: 'v1',
      //   name: 'Timeline Version',
      //   description: 'Visual timeline with chronological activity flow',
      //   component: <EngagementFeedV1 />
      // }
    ]
  },
  'key-interests': {
    title: 'Key Interests',
    description: 'User interests, topics, and preferences',
    category: 'Interests & Behavior',
    component: <KeyInterests />
  },
  'key-interests-versions': {
    title: 'Key Interests',
    description: 'Multiple visualization styles for user interests and behavioral insights',
    category: 'Interests & Behavior',
    hasVersions: true,
    versions: [
      {
        id: 'original',
        name: 'Original Version',
        description: 'Expandable sections with detailed interest breakdowns',
        component: <KeyInterests />
      },
      {
        id: 'v1',
        name: 'Distribution Chart Version',
        description: 'Hexagon distribution chart with activity timeline',
        component: <KeyInterestsV1 />
      },
      {
        id: 'v2',
        name: 'Timeline Version',
        description: 'Activity timeline with interest patterns and insights',
        component: <KeyInterestsV2 />
      },
      {
        id: 'v3',
        name: 'Metrics Dashboard Version',
        description: 'Data-driven dashboard with engagement scoring',
        component: <KeyInterestsV3 />
      },
      {
        id: 'v4',
        name: 'Visual Analytics Version',
        description: 'Charts and graphs with heatmaps and visual insights',
        component: <KeyInterestsV4 />
      }
    ]
  },
  'propensity-predictions': {
    title: 'Propensity Predictions',
    description: 'Behavioral predictions and likelihood assessments',
    category: 'Interests & Behavior',
    component: <PropensityPredictions />
  },
  'propensity-predictions-versions': {
    title: 'Propensity Predictions',
    description: 'Multiple visualization styles for behavioral predictions and scoring',
    category: 'Interests & Behavior',
    hasVersions: true,
    versions: [
      {
        id: 'original',
        name: 'Original Version',
        description: 'Expandable cards with detailed reasoning and insights',
        component: <PropensityPredictions />
      },
      {
        id: 'v1',
        name: 'Score Cards Version',
        description: 'Grade-based cards with priority levels and summary metrics',
        component: <PropensityPredictionsV1 />
      },
      {
        id: 'v2',
        name: 'Gauge Charts Version',
        description: 'Circular gauge charts with confidence indicators',
        component: <PropensityPredictionsV2 />
      },
      {
        id: 'v3',
        name: 'Priority Matrix Version',
        description: 'Categorized by urgency and importance with action recommendations',
        component: <PropensityPredictionsV3 />
      },
      {
        id: 'v4',
        name: 'Funnel Visualization Version',
        description: 'Conversion funnel with stage performance analysis',
        component: <PropensityPredictionsV4 />
      }
    ]
  },
  'activity-timeline': {
    title: 'Activity Timeline',
    description: 'Chronological timeline of user activities',
    category: 'Activity & Timeline',
    component: <ActivityTimeline />
  },
  'activity-timeline-versions': {
    title: 'Activity Timeline',
    description: 'Multiple views for sales engagement and customer behavior analysis',
    category: 'Activity & Timeline',
    hasVersions: true,
    versions: [
      {
        id: 'original',
        name: 'Original Version',
        description: 'Scatter plot with channel filters and engagement tracking',
        component: <ActivityTimeline />
      },
      {
        id: 'v1',
        name: 'Engagement Sessions',
        description: 'Gantt-style sessions with response time analysis',
        component: <ActivityTimelineV1 />
      },
      {
        id: 'v2',
        name: 'Flow Diagram',
        description: 'Customer journey touchpoints and interaction patterns',
        component: <ActivityTimelineV2 />
      },
      {
        id: 'v3',
        name: 'Response Analysis',
        description: 'Sales team responsiveness and follow-up tracking',
        component: <ActivityTimelineV3 />
      },
      {
        id: 'v4',
        name: 'Customer Journey',
        description: 'End-to-end customer experience with stage progression',
        component: <ActivityTimelineV4 />
      }
    ]
  },
  'engagement-time-heatmap': {
    title: 'Engagement Time Heatmap',
    description: 'Time-based engagement patterns visualization',
    category: 'Activity & Timeline',
    component: <EngagementTimeHeatmap data={generateMockHeatmapData()} />
  },
  'engagement-time-heatmap-versions': {
    title: 'Engagement Time Heatmap',
    description: 'Multiple visualization styles for time-based engagement patterns',
    category: 'Activity & Timeline',
    hasVersions: true,
    versions: [
      {
        id: 'original',
        name: 'Original Version',
        description: 'Standard heatmap with aggregate statistics and activity patterns',
        component: <EngagementTimeHeatmap data={generateMockHeatmapData()} />
      },
      {
        id: 'v1',
        name: 'Classic Grid Heatmap',
        description: 'Traditional 24x7 grid with toggle between engagement count and duration metrics',
        component: <EngagementTimeHeatmapV1 />
      },
      {
        id: 'v2',
        name: 'Interactive Weekly View',
        description: 'Selectable days with heatmap and chart modes, detailed engagement breakdowns',
        component: <EngagementTimeHeatmapV2 />
      },
      {
        id: 'v3',
        name: 'Radial Time Visualization',
        description: 'Circular 24-hour radar view with channel distribution and real-time insights',
        component: <EngagementTimeHeatmapV3 />
      },
      {
        id: 'v4',
        name: 'Channel Distribution Analysis',
        description: 'Detailed engagement time patterns with comprehensive channel breakdown and trends',
        component: <EngagementTimeHeatmapV4 />
      }
    ]
  },
  'action-recommendations': {
    title: 'Action Recommendations',
    description: 'Next best actions and recommended steps',
    category: 'Recommendations',
    component: <ActionRecommendations />
  },
  'action-recommendations-versions': {
    title: 'Action Recommendations',
    description: 'Multiple approaches for managing and displaying action items and recommendations',
    category: 'Recommendations',
    hasVersions: true,
    versions: [
      {
        id: 'original',
        name: 'Original Version',
        description: 'Carousel-based layout with dismissible action cards and priority indicators',
        component: <ActionRecommendations />
      },
      {
        id: 'v1',
        name: 'Filtered List View',
        description: 'Comprehensive list with priority and category filtering, expandable details',
        component: <ActionRecommendationsV1 />
      },
      {
        id: 'v2',
        name: 'Kanban Board',
        description: 'Drag-and-drop workflow organized by category with visual pipeline management',
        component: <ActionRecommendationsV2 />
      },
      {
        id: 'v3',
        name: 'Timeline Scheduler',
        description: 'Time-based view with scheduling, progress tracking, and status management',
        component: <ActionRecommendationsV3 />
      },
      {
        id: 'v4',
        name: 'Sales Intelligence',
        description: 'Enhanced with deal values, conversion rates, sales insights, and smart action buttons',
        component: <ActionRecommendationsV4 />
      }
    ]
  },
  'similar-profiles-carousel': {
    title: 'Similar Profiles',
    description: 'Carousel of similar user profiles',
    category: 'Recommendations',
    component: <SimilarProfilesCarousel />
  },
  'other-engaged-projects': {
    title: 'Other Engaged Projects',
    description: 'Related project recommendations',
    category: 'Recommendations',
    component: <OtherEngagedProjects />
  },
  'churn-monitoring': {
    title: 'Churn Monitoring',
    description: 'Churn risk indicators and monitoring',
    category: 'Monitoring',
    component: <ChurnMonitoring />
  },
  'recency-monitor': {
    title: 'Recency Monitor',
    description: 'Recent activity monitoring and alerts',
    category: 'Monitoring',
    component: <RecencyMonitor />
  }
};

export default function ComponentDisplay({ selectedComponent }: ComponentDisplayProps) {
  if (!selectedComponent) {
    return (
      <div className="p-8 h-full flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="mb-4">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
            Select a Component
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            Choose a component from the sidebar to preview it here. You can explore all available components organized by category.
          </p>
        </div>
      </div>
    );
  }

  const componentData = componentInfo[selectedComponent as keyof typeof componentInfo];

  if (!componentData) {
    return (
      <div className="p-8 h-full flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
            Component Not Found
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            The selected component could not be found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 h-full overflow-y-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {componentData.title}
          </h1>
          <Badge variant="secondary" className="text-xs">
            {componentData.category}
          </Badge>
          {'hasVersions' in componentData && componentData.hasVersions && (
            <Badge variant="outline" className="text-xs">
              {componentData.versions?.length} Versions
            </Badge>
          )}
        </div>
        <p className="text-slate-600 dark:text-slate-400">
          {componentData.description}
        </p>
      </div>

      {/* Component Preview */}
      {'hasVersions' in componentData && componentData.hasVersions && componentData.versions ? (
        // Grid layout for versioned components
                      <div className={`grid grid-cols-1 gap-6 ${
                componentData.title === 'Activity Timeline' ? '' : 
                componentData.title === 'Engagement Time Heatmap' ? '' : 
                componentData.title === 'Action Recommendations' ? '' : 
                componentData.title === 'Engagement Feed' ? 'md:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-3'
              }`}>
          {componentData.versions.map((version) => (
            <div key={version.id} className="space-y-3">
              {/* Version Info */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {version.name}
                  </h3>
                  <Badge variant="outline" className="text-xs">
                    {version.id.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {version.description}
                </p>
              </div>
              
              {/* Version Preview */}
              <Suspense
                fallback={
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                }
              >
                <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 bg-white dark:bg-white">
                  {version.component}
                </div>
              </Suspense>
            </div>
          ))}
        </div>
      ) : (
        // Single component layout
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Component Preview</CardTitle>
            <CardDescription>
              Live preview of the {componentData.title} component
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense
              fallback={
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              }
            >
              <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 bg-white dark:bg-white">
                {'component' in componentData ? componentData.component : null}
              </div>
            </Suspense>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
