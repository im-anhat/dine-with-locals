import React from 'react';
import { useUser } from '@/contexts/UserContext';

function DashboardHeader() {
  const { currentUser } = useUser();
  return (
    <div>
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Today's Matches</h1>
          <p className="text-muted-foreground mt-1">
            Find new connections and upcoming meetups
          </p>
        </div>
        <div className="text-right">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200">
            {currentUser?.role}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardHeader;
