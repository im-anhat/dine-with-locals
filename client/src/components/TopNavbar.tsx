import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { ChevronRight } from 'lucide-react';

type TopNavbarProps = {
  currentPath: Array<string>;
};

export const TopNavbar: React.FC<TopNavbarProps> = ({ currentPath }) => {
  return (
    <nav className="flex py-3 px-4 items-center w-full gap-2">
      <SidebarTrigger />
      <Separator className="mx-2" orientation="vertical" />

      {currentPath.map((path, index) => (
        <React.Fragment key={index}>
          <span className="text-sm px-2">
            {path.charAt(0).toUpperCase() + path.slice(1)}
          </span>
          {index < currentPath.length - 1 && (
            <ChevronRight className="w-4 h-4 text-gray-500" />
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
