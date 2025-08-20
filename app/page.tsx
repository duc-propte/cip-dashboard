import DashboardLayout from '@/components/layout/dashboard-layout';
import LeftSidebar from '@/components/layout/left-sidebar';
import RightSidebar from '@/components/layout/right-sidebar';
import MainContent from '@/components/layout/main-content';
import ActionRecommendations from '@/components/main/action-recommendations';
import ActivityTimeline from '@/components/main/activity-timeline';
import SimilarProfilesCarousel from '@/components/main/similar-profiles-carousel';
import OtherEngagedProjects from '@/components/main/other-engaged-projects';
import EngagementTimeHeatmap from '@/components/main/engagement-time-heatmap';

export default function Home() {
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

  return (
    <DashboardLayout
      leftSidebar={<LeftSidebar />}
      rightSidebar={<RightSidebar />}
    >
      <MainContent title="Waurn Ponds">
        <div className="space-y-6">
          {/* Action Recommendations Section */}
          <ActionRecommendations />
          
          {/* Activity Timeline Section */}
          <ActivityTimeline />
          
          {/* Similar Profiles Carousel Section */}
          <SimilarProfilesCarousel />
          
          {/* Other Engaged Projects Section */}
          <OtherEngagedProjects />
          
          {/* Engagement Time Heatmap Section */}
          <EngagementTimeHeatmap data={heatmapData} />
          
        </div>
      </MainContent>
    </DashboardLayout>
  );
}