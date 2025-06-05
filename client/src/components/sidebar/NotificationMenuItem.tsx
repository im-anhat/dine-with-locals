import React from 'react';
import { NotificationCenter } from '@/components/NotificationCenter';
import { SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';

export const NotificationMenuItem: React.FC = () => {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <div className="cursor-pointer">
          <NotificationCenter />
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};
