import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

import { useUser } from '@/contexts/UserContext';

export default function NavUser() {
  const { currentUser } = useUser();

  if (!currentUser) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={currentUser.avatar} alt="User Avatar" />
            <AvatarFallback>
              {currentUser.firstName.charAt(0).toUpperCase()}
              {currentUser.lastName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">
              {currentUser.firstName}
            </span>
            <span className="truncate text-xs">{currentUser.userName}</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
