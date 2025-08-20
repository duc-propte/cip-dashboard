import UserProfile from "@/components/sidebar/user-profile"
import EngagementScore from "@/components/sidebar/engagement-score"
import KeyInterests from "@/components/sidebar/key-interests"
import ChannelEngagement from "@/components/sidebar/channel-engagement"
import PropensityPredictions from "@/components/sidebar/propensity-predictions"
import ProfileBadges from "@/components/sidebar/profile-badges"
import { User } from "@/types"

export default function LeftSidebar() {
  // Mock user data - in a real app, this would come from authentication context or API
  const mockUser: User = {
    id: "1",
    name: "John Doe",
    email: "john.doe@company.com",
    phone: "+1 (555) 123-4567",
    avatar: "", // Empty string will fall back to initials
    lastActive: new Date('2024-12-22T10:00:00Z').toISOString() // Fixed date to avoid hydration issues
  }

    return (
    <div className="min-h-full">
      {/* Profile Header */}
      <UserProfile user={mockUser} />
      
      {/* Engagement Score */}
      <EngagementScore />
      
      {/* Profile Badges */}
      <ProfileBadges />
      
      {/* Key Interests */}
      <KeyInterests />
        
      {/* Propensity Predictions */}
      <PropensityPredictions />
 
      {/* Channel Engagement */}
      <ChannelEngagement />
    </div>
  );
}
