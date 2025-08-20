'use client';

import { useState } from 'react';
import ComponentDisplay from '@/components/layout/component-display';
import ComponentsLayout from '@/components/layout/components-layout';
import ComponentsSidebar from '@/components/layout/components-sidebar';

export default function ComponentsPage() {
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <ComponentsLayout
      sidebar={
        <ComponentsSidebar 
          selectedComponent={selectedComponent}
          onSelectComponent={setSelectedComponent}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      }
      sidebarCollapsed={sidebarCollapsed}
    >
      <ComponentDisplay selectedComponent={selectedComponent} />
    </ComponentsLayout>
  );
}
