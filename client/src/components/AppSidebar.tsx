import {
  LayoutDashboard,
  Newspaper,
  Map,
  LayoutList,
  MessageSquare,
  User,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';

import NavGroup from '@/components/sidebar/nav-main';
import NavUser from '@/components/sidebar/nav-user';
import { NotificationMenuItem } from '@/components/sidebar/NotificationMenuItem';

import { useUser } from '@/contexts/UserContext';

// Menu items.
const items = {
  navExplore: [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'Places',
      url: '/places',
      icon: Map,
    },
    {
      title: 'Feed',
      url: '/feed',
      icon: Newspaper,
    },
    {
      title: 'Profile',
      url: '/profile',
      icon: User, // Change icon here
    },
  ],
  navManageBookings: [
    {
      title: 'Chats',
      url: '/chats',
      icon: MessageSquare,
    },
    {
      title: 'Pending Approvals',
      url: '/approvals',
      icon: LayoutList,
    },
  ],
};

export function AppSidebar() {
  const { currentUser } = useUser();

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center justify-between">
          <img className="w-16 h-16" src="/logo.svg" alt="" />
        </div>
      </SidebarHeader>

      {/* Main navigation */}
      <SidebarContent>
        <NavGroup groupLabel="Explore" items={items.navExplore} />
        <NavGroup
          groupLabel="Manage Bookings"
          items={items.navManageBookings}
        />
        {currentUser && (
          <SidebarGroup>
            <SidebarGroupLabel>Notifications</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <NotificationMenuItem />
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      {/* Footer: User Profile */}
      <SidebarFooter>
        {currentUser ? (
          <NavUser />
        ) : (
          <p className="p-4 text-sm">Not logged in</p>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
