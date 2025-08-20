import EngagementFeed from "@/components/sidebar/engagement-feed"
import ChurnMonitoring from "@/components/sidebar/churn-monitoring"
import RecencyMonitor from "@/components/sidebar/recency-monitor"

export default function RightSidebar() {
  return (
    <div className="min-h-full">
      
      {/* Engagement Feed */}
      <EngagementFeed />
      
      {/* Churn Risk Monitoring */}
      <ChurnMonitoring />

      {/* Recency Monitor */}
      <RecencyMonitor />
    </div>
  );
}
