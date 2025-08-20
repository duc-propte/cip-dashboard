import { ReactNode } from 'react';

interface ComponentsLayoutProps {
  children: ReactNode;
  sidebar: ReactNode;
  sidebarCollapsed: boolean;
}

export default function ComponentsLayout({ 
  children, 
  sidebar,
  sidebarCollapsed
}: ComponentsLayoutProps) {
  return (
    <div className="h-screen bg-slate-50 dark:bg-slate-900 flex overflow-hidden">
      {/* Left Sidebar */}
      <div className={`${
        sidebarCollapsed ? 'w-16' : 'w-80'
      } bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex-shrink-0 overflow-y-auto scrollbar-hide transition-all duration-300 ease-in-out`}>
        {sidebar}
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <main className="flex-1 overflow-y-auto scrollbar-hide">
          {children}
        </main>
      </div>
    </div>
  );
}
