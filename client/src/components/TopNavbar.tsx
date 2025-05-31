import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type TopNavbarProps = {
  currentPath: Array<string>;
};

// Custom path display names in case the path is ugly
// e.g. "host" -> "Host", "create-listing" -> "Create a Listing"
const pathMappings: Record<string, string> = {
  host: 'Host',
  'create-listing': 'Create a Listing',
  dashboard: 'Dashboard',
  approvals: 'Pending Approvals',
};

export const TopNavbar: React.FC<TopNavbarProps> = ({ currentPath }) => {
  const navigate = useNavigate(); // navigate to previous page in the top navbar tab
  const displayPath = currentPath.map((path) => pathMappings[path] || path.charAt(0).toUpperCase() + path.slice(1));

  return (
    <nav className="flex py-3 px-4 items-center w-full gap-2">
      <SidebarTrigger />
      <Separator className="mx-2" orientation="vertical" />

      {displayPath.map((path, index) => (
        <React.Fragment key={index}>
          <span
            className={`text-sm px-2 cursor-pointer hover:text-stone-900 ${index < displayPath.length - 1 ? 'text-stone-500' : ''}`}
            onClick={() => navigate(`/${currentPath.slice(0, index + 1).join('/')}`)}
          >
            {path}
          </span>
          {index < displayPath.length - 1 && (
            <ChevronRight className="w-4 h-4 text-gray-500" />
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};