import { 
  LayoutDashboard,
  Soup,
  Newspaper,
  Map,
  LayoutList,
  MessageSquare
 } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import Logo from "../public/logo.svg";

// Menu items.
const items = {
  navMain: [
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
  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <img className="w-16 h-16" src="/logo.svg" alt="" />
      </SidebarHeader>

      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Explore</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Manage Bookings Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Manage Bookings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.navManageBookings.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
