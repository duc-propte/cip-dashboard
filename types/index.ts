// Global type definitions for the CIP Dagster frontend

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  lastActive?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
}

export interface EngagementEvent {
  name: string;
  contribution: number;
}

export interface EngagementTrendData {
  date: string;
  score: number;
  events?: EngagementEvent[];
}

export interface MomentumChange {
  period: string;
  percentage: number;
  direction: 'increase' | 'decrease' | 'stable';
}

export interface EngagementScoreData {
  totalScore: number;
  projectName: string;
  trendData: EngagementTrendData[];
  momentum: MomentumChange[];
}

export interface ChannelData {
  name: string;
  percentage: number;
  events: number;
  color: string;
}

export interface ChannelEngagementData {
  channels: ChannelData[];
  totalEvents: number;
}

export interface ReasoningFactor {
  factor: string;
  impact: 'positive' | 'negative' | 'neutral';
  weight: number;
  description: string;
}

export interface PropensityPrediction {
  metric: string;
  description: string;
  probability: number;
  confidence: 'high' | 'medium' | 'low';
  trend: 'increasing' | 'decreasing' | 'stable';
  icon: string;
  reasoning: ReasoningFactor[];
  keyInsights: string[];
}

export interface PropensityData {
  predictions: PropensityPrediction[];
  lastUpdated: string;
}

export interface LotDetail {
  lotNumber: string;
  clicks: number;
  brochureDownloads?: number;
  formSubmissions?: number;
  lastViewed: string;
  price?: number;
  size?: number;
}

export interface PriceRangeInterest {
  range: string;
  minPrice: number;
  maxPrice: number;
  views: number;
  brochures: number;
  lots: LotDetail[];
  lastActivity: string;
}

export interface LotSizeInterest {
  range: string;
  minSize: number;
  maxSize: number;
  lotsViewed: number;
  lots: LotDetail[];
}

export interface DirectIntent {
  phoneClicks: number;
  emailClicks: number;
  lastPhoneClick?: string;
  lastEmailClick?: string;
  followUpStatus?: 'pending' | 'contacted' | 'completed';
}

export interface KeyInterestsData {
  priceRangeFocus: PriceRangeInterest;
  mostViewedLots: LotDetail[];
  lotSizeInterest: LotSizeInterest;
  directIntent: DirectIntent;
}

export interface ActionRecommendation {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: 'follow-up' | 'engagement' | 'opportunity' | 'risk';
  actionType: 'call' | 'email' | 'meeting' | 'content' | 'alert';
  estimatedImpact: number;
  timeframe: string;
  basedOn: string[];
  suggestedActions: string[];
  icon: string;
}

export interface ActionRecommendationsData {
  recommendations: ActionRecommendation[];
  lastUpdated: string;
  totalRecommendations: number;
}

export interface ActivityEvent {
  id: string;
  timestamp: string;
  channel: 'website' | 'phone' | 'email';
  eventType: 'customer_engagement' | 'sales_outreach';
  description: string;
  details?: {
    pageViewed?: string;
    lotViewed?: string;
    documentDownloaded?: string;
    callDuration?: number;
    emailSubject?: string;
    outcome?: string;
  };
  intensity: number; // 1-10 scale for dot size
  outcome?: 'positive' | 'neutral' | 'negative';
}

export interface ActivityTimelineData {
  events: ActivityEvent[];
  dateRange: {
    start: string;
    end: string;
  };
  channels: Array<{
    id: 'website' | 'phone' | 'email';
    label: string;
    color: string;
  }>;
  totalEvents: number;
}

export type TimeFilterOption = 'day' | 'week' | 'month' | 'year';

// Similar Profiles Carousel Types
export interface SimilarProfile {
  id: string;
  name: string;
  avatar?: string;
  initials: string;
  location: string;
  engagementScore: number;
  similarityScore: number;
  lastActivity: string;
  preferredContact: 'email' | 'phone' | 'website';
  commonInterests: string[];
  demographics: {
    ageRange: string;
    familyStatus: string;
    income: string;
  };
}

export interface SimilarityReason {
  category: 'demographic' | 'behavioral' | 'preference' | 'engagement';
  reason: string;
  strength: 'high' | 'medium' | 'low';
  description: string;
}

export interface SimilarProfilesData {
  profiles: SimilarProfile[];
  similarityReasons: SimilarityReason[];
  lastUpdated: string;
  totalSimilarProfiles: number;
}

// Other Engaged Projects Types
export interface ProjectEngagement {
  projectId: string;
  projectName: string;
  location: string;
  engagementLevel: 'high' | 'medium' | 'low';
  engagementScore: number;
  lastEngagement: string;
  engagementType: 'active' | 'monitoring' | 'dormant';
  totalInteractions: number;
  keyActivities: string[];
  timeline: {
    firstEngagement: string;
    mostRecentActivity: string;
    peakEngagement: string;
  };
  projectDetails: {
    priceRange: string;
    propertyType: string;
    status: 'pre-launch' | 'selling' | 'sold-out' | 'completed';
    expectedCompletion?: string;
  };
}

export interface OtherEngagedProjectsData {
  projects: ProjectEngagement[];
  totalProjects: number;
  activeProjects: number;
  lastUpdated: string;
}

// Engagement Feed Types
export interface EngagementFeedItem {
  id: string;
  timestamp: string;
  type: 'interaction' | 'event' | 'milestone' | 'alert';
  channel: 'website' | 'phone' | 'email' | 'crm' | 'system';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  status?: 'new' | 'acknowledged' | 'resolved';
  metadata?: {
    duration?: number;
    pages?: string[];
    contactMethod?: string;
    outcome?: string;
    value?: number;
  };
}

export interface EngagementFeedData {
  items: EngagementFeedItem[];
  unreadCount: number;
  lastUpdated: string;
  totalItems: number;
}

// Profile Badge Types
export interface BadgeTimelineEvent {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  type: 'milestone' | 'activity' | 'achievement' | 'requirement';
  status: 'completed' | 'in_progress' | 'pending' | 'failed';
  points?: number;
  metadata?: {
    value?: number;
    threshold?: number;
    duration?: number;
    details?: string;
    current?: number;
    total?: number;
  };
}

export interface ProfileBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  category: 'engagement' | 'milestone' | 'behavior' | 'achievement' | 'special';
  status: 'earned' | 'in_progress' | 'locked' | 'expired';
  earnedDate?: string;
  progress?: {
    current: number;
    total: number;
    percentage: number;
  };
  requirements: string[];
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  points: number;
  timeline: BadgeTimelineEvent[];
  nextMilestone?: {
    title: string;
    requirement: string;
    estimatedTime?: string;
  };
}

export interface ProfileBadgesData {
  badges: ProfileBadge[];
  totalBadges: number;
  earnedBadges: number;
  totalPoints: number;
  currentRank: string;
  nextRank?: {
    name: string;
    pointsRequired: number;
    pointsToGo: number;
  };
  lastUpdated: string;
}

// Churn Monitoring Types
export interface ChurnRiskFactor {
  id: string;
  name: string;
  description: string;
  category: 'engagement' | 'behavior' | 'demographic' | 'external' | 'communication';
  impact: 'high' | 'medium' | 'low';
  direction: 'positive' | 'negative' | 'neutral';
  value: number;
  threshold: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  lastUpdated: string;
  details?: {
    historicalData?: Array<{
      date: string;
      value: number;
    }>;
    benchmark?: number;
    recommendation?: string;
  };
}

export interface ChurnPrevention {
  id: string;
  title: string;
  description: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  category: 'communication' | 'incentive' | 'support' | 'engagement';
  estimatedImpact: number;
  effort: 'low' | 'medium' | 'high';
  timeline: string;
  actions: string[];
  successRate?: number;
}

export interface ChurnPrediction {
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  timeToChurn?: string;
  primaryRiskFactors: string[];
  trend: 'improving' | 'worsening' | 'stable';
  lastCalculated: string;
}

export interface ChurnMonitoringData {
  prediction: ChurnPrediction;
  riskFactors: ChurnRiskFactor[];
  preventionStrategies: ChurnPrevention[];
  historicalRisk: Array<{
    date: string;
    riskScore: number;
    events?: string[];
  }>;
  benchmarks: {
    industryAverage: number;
    companyAverage: number;
    similarProfiles: number;
  };
  lastUpdated: string;
}

// Engagement Time Heatmap Types
export interface EngagementTimeSlot {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  hour: number; // 0-23
  engagementCount: number;
  intensity: number; // 0-1 normalized intensity
}

export interface EngagementTimeHeatmapData {
  timeSlots: EngagementTimeSlot[];
  totalEngagements: number;
  peakHours: {
    hour: number;
    count: number;
  }[];
  peakDays: {
    dayOfWeek: number;
    dayName: string;
    count: number;
  }[];
  lastUpdated: string;
  dateRange: {
    start: string;
    end: string;
  };
}

// Recency Monitor Types
export interface RecencyBucket {
  id: string;
  label: string;
  daysRange: {
    min: number;
    max: number | null; // null for "30+ days"
  };
  count: number;
  percentage: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  trendPercentage: number;
  color: string;
  description: string;
  lastActivity?: {
    type: 'website' | 'phone' | 'email' | 'meeting';
    description: string;
    timestamp: string;
  };
}

export interface RecencyInsight {
  id: string;
  type: 'warning' | 'opportunity' | 'info' | 'success';
  title: string;
  description: string;
  bucket?: string; // which bucket this insight relates to
  priority: 'high' | 'medium' | 'low';
  actionable: boolean;
  suggestedAction?: string;
}

export interface RecencyMonitorData {
  buckets: RecencyBucket[];
  totalContacts: number;
  averageRecency: number; // in days
  insights: RecencyInsight[];
  riskThreshold: number; // days after which contacts are considered at risk
  lastUpdated: string;
  periodComparison: {
    period: string;
    totalChange: number;
    bucketChanges: Array<{
      bucketId: string;
      change: number;
    }>;
  };
}