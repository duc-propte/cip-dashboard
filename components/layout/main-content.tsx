import { ReactNode } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings } from 'lucide-react';

interface MainContentProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  dashboardVersion?: string;
  onVersionChange?: (version: string) => void;
  availableVersions?: Array<{
    id: string;
    name: string;
    description: string;
  }>;
}

const defaultVersions = [
  { id: 'v1', name: 'Version 1', description: 'Standard dashboard layout' },
  { id: 'v2', name: 'Version 2', description: 'Enhanced dashboard with improved metrics' },
  { id: 'v3', name: 'Version 3', description: 'Advanced analytics dashboard' },
  { id: 'v4', name: 'Version 4', description: 'Latest dashboard with all features' },
];

export default function MainContent({ 
  children, 
  title = "Dashboard", 
  subtitle = "Welcome to your CIP Dagster dashboard",
  dashboardVersion = 'v1',
  onVersionChange,
  availableVersions = defaultVersions
}: MainContentProps) {
  return (
    <div className="min-h-full">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {subtitle}
              </p>
            )}
          </div>
          
          {/* Dashboard Version Selector */}
          {onVersionChange && availableVersions.length > 0 && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-slate-500" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Dashboard Version:
                </span>
              </div>
              <Select value={dashboardVersion} onValueChange={onVersionChange}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select version" />
                </SelectTrigger>
                <SelectContent>
                  {availableVersions.map((version) => (
                    <SelectItem key={version.id} value={version.id}>
                      {version.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 p-6 overflow-auto">
        {children}
      </div>
    </div>
  );
}
