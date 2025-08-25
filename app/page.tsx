'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/dashboard-layout';
import MainContent from '@/components/layout/main-content';
import ActionRecommendations from '@/components/main/action-recommendations';
import ActivityTimeline from '@/components/main/activity-timeline';
import SimilarProfilesCarousel from '@/components/main/similar-profiles-carousel';
import OtherEngagedProjects from '@/components/main/other-engaged-projects';
import EngagementTimeHeatmap from '@/components/main/engagement-time-heatmap';

// Import versioned components for demonstration
import ActionRecommendationsV4 from '@/components/action-recommendations-versions/action-recommendations-v4';
import ActivityTimelineV1 from '@/components/activity-timeline-versions/activity-timeline-v1';
import EngagementTimeHeatmapV4 from '@/components/engagement-time-heatmap-versions/engagement-time-heatmap-v4';

// Import versioned sidebar components
import UserProfileV4 from '@/components/user-profile-versions/user-profile-v4';
import EngagementFeedV4 from '@/components/engagement-feed-versions/engagement-feed-v4';

// Import regular sidebar components for other versions
import UserProfile from '@/components/sidebar/user-profile';
import EngagementScore from '@/components/sidebar/engagement-score';
import KeyInterests from '@/components/sidebar/key-interests';
import ChannelEngagement from '@/components/sidebar/channel-engagement';
import PropensityPredictions from '@/components/sidebar/propensity-predictions';
import ProfileBadges from '@/components/sidebar/profile-badges';
import EngagementFeed from '@/components/sidebar/engagement-feed';
import ChurnMonitoring from '@/components/sidebar/churn-monitoring';
import RecencyMonitor from '@/components/sidebar/recency-monitor';
import PurchaseCycle from '@/components/sidebar/purchase-cycle';
import { User } from '@/types';

// Define available dashboard versions
const dashboardVersions = [
  { 
    id: 'original', 
    name: 'Version 1', 
    description: 'Enhanced dashboard for land sales with purchase cycle and prospect timeline' 
  },
  { 
    id: 'v2', 
    name: 'Version 2', 
    description: 'Classic real estate dashboard with standard prospect management' 
  },
];

export default function Home() {
  const [selectedVersion, setSelectedVersion] = useState('original');

  // Mock user data with suburb information
  const mockUser: User = {
    id: "1",
    name: "John Doe",
    email: "john.doe@company.com",
    phone: "+61 3 5229 1234", // Australian phone number with country code
    avatar: "", // Empty string will fall back to initials
    lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago active
    location: "Geelong, Victoria",
    suburb: "Waurn Ponds"
  };
  // Mock data for engagement time heatmap - using deterministic data to avoid hydration issues
  const generateMockHeatmapData = () => {
    const timeSlots = [];
    const totalEngagements = 1247;
    
    // Seed for deterministic "random" numbers based on day and hour
    const seededRandom = (day: number, hour: number) => {
      const seed = day * 100 + hour;
      return ((seed * 9301 + 49297) % 233280) / 233280;
    };
    
    // Generate engagement data for each day and hour
    for (let day = 0; day < 7; day++) {
      for (let hour = 0; hour < 24; hour++) {
        // Create realistic patterns (higher engagement during business hours on weekdays)
        let baseEngagement = 5;
        const random = seededRandom(day, hour);
        
        // Weekday vs weekend patterns
        if (day >= 1 && day <= 5) { // Weekdays
          if (hour >= 9 && hour <= 17) {
            baseEngagement = Math.floor(random * 50) + 20; // 20-70 during business hours
          } else if (hour >= 7 && hour <= 21) {
            baseEngagement = Math.floor(random * 30) + 10; // 10-40 during extended hours
          } else {
            baseEngagement = Math.floor(random * 10) + 1; // 1-11 during off hours
          }
        } else { // Weekends
          if (hour >= 10 && hour <= 20) {
            baseEngagement = Math.floor(random * 35) + 10; // 10-45 during weekend active hours
          } else {
            baseEngagement = Math.floor(random * 8) + 1; // 1-9 during weekend off hours
          }
        }
        
        timeSlots.push({
          dayOfWeek: day,
          hour,
          engagementCount: baseEngagement,
          intensity: Math.min(baseEngagement / 70, 1) // Normalize to 0-1
        });
      }
    }
    
    // Calculate peak hours and days
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
    
    // Use fixed dates to avoid hydration mismatch
    const fixedDate = new Date('2024-12-20T10:30:00Z');
    const startDate = new Date(fixedDate.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    return {
      timeSlots,
      totalEngagements,
      peakHours,
      peakDays,
      lastUpdated: fixedDate.toISOString(),
      dateRange: {
        start: startDate.toISOString().split('T')[0], // YYYY-MM-DD format
        end: fixedDate.toISOString().split('T')[0]    // YYYY-MM-DD format
      }
    };
  };

  const heatmapData = generateMockHeatmapData();

  // Create version-aware left sidebar
  const renderLeftSidebar = () => {
    return (
      <div className="min-h-full">
        {/* Profile Header - Version specific */}
        {selectedVersion === 'original' ? (
          <UserProfileV4 user={mockUser} />
        ) : (
          <UserProfile user={mockUser} />
        )}
        
        {selectedVersion === 'original' ? (
          <>
            {/* Engagement Score - directly under profile summary */}
            <EngagementScore />
            
            {/* Purchase Cycle - below engagement score */}
            <PurchaseCycle />
            
            {/* Other components */}
            <ProfileBadges />
            <KeyInterests />
            <PropensityPredictions />
            <ChannelEngagement />
          </>
        ) : (
          <>
            {/* V2 (former original) layout */}
            <EngagementScore />
            <ProfileBadges />
            <KeyInterests />
            <PropensityPredictions />
            <ChannelEngagement />
          </>
        )}
      </div>
    );
  };

  // Create version-aware right sidebar
  const renderRightSidebar = () => {
    return (
      <div className="min-h-full">
        {/* Engagement Feed - Version specific */}
        {selectedVersion === 'original' ? (
          <EngagementFeedV4 />
        ) : (
          <EngagementFeed />
        )}
        
        {/* Other components remain the same for now */}
        <ChurnMonitoring />
        <RecencyMonitor />
      </div>
    );
  };

  // Component renderers based on version
  const renderActionRecommendations = () => {
    switch (selectedVersion) {
      case 'original': return <ActionRecommendationsV4 />;
      case 'v2': return <ActionRecommendations />;
      default: return <ActionRecommendationsV4 />;
    }
  };

  const renderActivityTimeline = () => {
    switch (selectedVersion) {
      case 'original': return <ActivityTimelineV1 />;
      case 'v2': return <ActivityTimeline />;
      default: return <ActivityTimelineV1 />;
    }
  };

  const renderEngagementTimeHeatmap = () => {
    switch (selectedVersion) {
      case 'original': return <EngagementTimeHeatmapV4 />;
      case 'v2': return <EngagementTimeHeatmap data={heatmapData} />;
      default: return <EngagementTimeHeatmapV4 />;
    }
  };

  return (
    <DashboardLayout
      leftSidebar={renderLeftSidebar()}
      rightSidebar={renderRightSidebar()}
    >
      <MainContent 
        title="Waurn Ponds Estate"
        subtitle={`Real Estate Sales Dashboard ${selectedVersion === 'original' ? '' : selectedVersion.toUpperCase()} - Project-Level Profile Analytics`}
        dashboardVersion={selectedVersion}
        onVersionChange={setSelectedVersion}
        availableVersions={dashboardVersions}
      >
        <div className="space-y-6">
          {/* Action Recommendations Section */}
          {renderActionRecommendations()}
          
          {/* Activity Timeline Section */}
          {renderActivityTimeline()}
          
          {/* Engagement Time Heatmap Section */}
          {renderEngagementTimeHeatmap()}

          {/* Other Engaged Projects Section */}
          <OtherEngagedProjects />
          
          {/* Similar Profiles Carousel Section */}
          <SimilarProfilesCarousel />          
        </div>
      </MainContent>
    </DashboardLayout>
  );
}