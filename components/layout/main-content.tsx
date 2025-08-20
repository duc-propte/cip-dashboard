import { ReactNode } from 'react';

interface MainContentProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export default function MainContent({ 
  children, 
  title = "Dashboard", 
  subtitle = "Welcome to your CIP Dagster dashboard" 
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
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 p-6 overflow-auto">
        {children}
      </div>
    </div>
  );
}
