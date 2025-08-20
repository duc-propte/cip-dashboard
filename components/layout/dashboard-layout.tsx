import { ReactNode } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
  leftSidebar?: ReactNode;
  rightSidebar?: ReactNode;
}

export default function DashboardLayout({ 
  children, 
  leftSidebar, 
  rightSidebar 
}: DashboardLayoutProps) {
  return (
    <div className="h-screen bg-slate-50 dark:bg-slate-900 flex overflow-hidden">
      {/* Left Sidebar */}
      {leftSidebar && (
        <div className="w-90 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex-shrink-0 overflow-y-auto scrollbar-hide">
          {leftSidebar}
        </div>
      )}
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <main className="flex-1 overflow-y-auto scrollbar-hide">
          {children}
        </main>
      </div>
      
      {/* Right Sidebar */}
      {rightSidebar && (
        <div className="w-90 bg-white dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700 flex-shrink-0 overflow-y-auto scrollbar-hide">
          {rightSidebar}
        </div>
      )}
    </div>
  );
}
