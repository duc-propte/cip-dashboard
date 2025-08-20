'use client';

import { ChevronLeft, ChevronRight, User, Activity, BarChart3, Target, Star, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useState } from 'react';

interface ComponentsSidebarProps {
  selectedComponent: string | null;
  onSelectComponent: (component: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

interface ComponentCategory {
  name: string;
  icon: React.ElementType;
  components: {
    id: string;
    name: string;
    description?: string;
  }[];
}

const componentCategories: ComponentCategory[] = [
  {
    name: 'Profile Summary',
    icon: User,
    components: [
      { id: 'user-profile-versions', name: 'User Profile', description: 'User information and avatar with multiple versions' },
      { id: 'profile-badges-versions', name: 'Profile Badges', description: 'Achievement badges with sales intelligence' },
    ]
  },
  {
    name: 'Engagement Metrics',
    icon: BarChart3,
    components: [
      { id: 'engagement-score-versions', name: 'Engagement Score', description: 'Lead temperature and recency analysis' },
      { id: 'channel-engagement', name: 'Channel Engagement', description: 'Engagement across different channels' },
      { id: 'engagement-feed-versions', name: 'Engagement Feed', description: 'Activity timeline and workflow management' },
    ]
  },
  {
    name: 'Interests & Behavior',
    icon: Target,
    components: [
      { id: 'key-interests-versions', name: 'Key Interests', description: 'User interests with multiple visualization styles' },
      { id: 'propensity-predictions-versions', name: 'Propensity Predictions', description: 'Behavioral predictions with multiple visualization styles' },
    ]
  },
  {
    name: 'Activity & Timeline',
    icon: Activity,
    components: [
      { id: 'activity-timeline-versions', name: 'Activity Timeline', description: 'Sales engagement and customer behavior analysis' },
      { id: 'engagement-time-heatmap-versions', name: 'Engagement Time Heatmap', description: 'Time-based engagement patterns with multiple visualization styles' },
    ]
  },
  {
    name: 'Recommendations',
    icon: Star,
    components: [
      { id: 'action-recommendations-versions', name: 'Action Recommendations', description: 'Multiple approaches for managing action items and recommendations' },
      { id: 'similar-profiles-carousel', name: 'Similar Profiles', description: 'Similar user profiles carousel' },
      { id: 'other-engaged-projects', name: 'Other Engaged Projects', description: 'Related project recommendations' },
    ]
  },
  {
    name: 'Monitoring',
    icon: Bell,
    components: [
      { id: 'churn-monitoring', name: 'Churn Monitoring', description: 'Churn risk indicators' },
      { id: 'recency-monitor', name: 'Recency Monitor', description: 'Recent activity monitoring' },
    ]
  }
];

export default function ComponentsSidebar({
  selectedComponent,
  onSelectComponent,
  collapsed,
  onToggleCollapse
}: ComponentsSidebarProps) {
  const [openCategories, setOpenCategories] = useState<string[]>(['Profile Summary']);

  const toggleCategory = (categoryName: string) => {
    if (collapsed) return;
    
    setOpenCategories(prev => 
      prev.includes(categoryName)
        ? prev.filter(name => name !== categoryName)
        : [...prev, categoryName]
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
        {!collapsed && (
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Components
          </h2>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Categories */}
      <div className="flex-1 overflow-y-auto p-2">
        {componentCategories.map((category) => {
          const Icon = category.icon;
          const isOpen = openCategories.includes(category.name);

          return (
            <Collapsible
              key={category.name}
              open={!collapsed && isOpen}
              onOpenChange={() => toggleCategory(category.name)}
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className={`w-full justify-start mb-1 p-2 ${
                    collapsed ? 'px-2' : 'px-3'
                  } hover:bg-slate-100 dark:hover:bg-slate-700`}
                  title={collapsed ? category.name : undefined}
                >
                  <Icon className={`h-4 w-4 ${collapsed ? '' : 'mr-2'} flex-shrink-0`} />
                  {!collapsed && (
                    <>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
                        {category.name}
                      </span>
                      <ChevronRight className={`h-3 w-3 ml-auto transition-transform ${
                        isOpen ? 'rotate-90' : ''
                      }`} />
                    </>
                  )}
                </Button>
              </CollapsibleTrigger>
              
              {!collapsed && (
                <CollapsibleContent className="ml-4 mb-2">
                  {category.components.map((component) => (
                    <Button
                      key={component.id}
                      variant="ghost"
                      className={`w-full justify-start mb-1 p-2 text-sm ${
                        selectedComponent === component.id
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-600 dark:text-slate-400'
                      }`}
                      onClick={() => onSelectComponent(component.id)}
                    >
                      <span className="truncate">{component.name}</span>
                    </Button>
                  ))}
                </CollapsibleContent>
              )}
            </Collapsible>
          );
        })}
      </div>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {componentCategories.reduce((acc, cat) => acc + cat.components.length, 0)} components available
          </div>
        </div>
      )}
    </div>
  );
}
