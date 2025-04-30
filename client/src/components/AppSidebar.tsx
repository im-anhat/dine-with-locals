import { 
  LayoutDashboard,
  Newspaper,
  Map,
  LayoutList,
  MessageSquare
 } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar"

import NavGroup from "@/components/sidebar/nav-main"
import NavUser from "@/components/sidebar/nav-user"

import { useUser } from "@/contexts/UserContext";


// Menu items.
const items = {
  navExplore: [
    {
      title: "Dashboard",
      url: "/",
      icon: LayoutDashboard,
    },
    {
      title: "Feed",
      url: "/feed",
      icon: Newspaper,
    },
    {
      title: "Places",
      url: "/places",
      icon: Map,
    }
  ],
  navManageBookings: [
    {
      title: "Chats",
      url: "/chats",
      icon: MessageSquare,
    },
    {
      title: "Pending Approvals",
      url: "/approvals",
      icon: LayoutList,
    }
  ],
};

export function AppSidebar() {
  const { currentUser } = useUser();

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <img className="w-16 h-16" src="/logo.svg" alt="" />
      </SidebarHeader>

      {/* Main navigation */}
      <SidebarContent>
        <NavGroup groupLabel='Explore' items={items.navExplore} />
        <NavGroup groupLabel='Manage Bookings' items={items.navManageBookings} />
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