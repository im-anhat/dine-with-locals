import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface GuestDetailsCardProps {
  name?: string;
  avatarUrl?: string;
  email?: string;
  phone?: string;
  dietary?: string[];
  notes?: string;
}

function GuestDetailsCard({
  name = 'Jane Doe',
  avatarUrl = '',
  email = 'jane.doe@email.com',
  phone = '(555) 123-4567',
  dietary = ['Vegan', 'Nut-Free'],
  notes = 'Looking forward to the event!',
}: GuestDetailsCardProps) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Guest Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src={avatarUrl} alt={name} />
              <AvatarFallback>
                {name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{name}</div>
              <div className="text-xs text-gray-500">{email}</div>
              <div className="text-xs text-gray-500">{phone}</div>
            </div>
          </div>
          <div>
            <span className="block text-xs text-gray-500 mb-1">
              Dietary Restrictions
            </span>
            <div className="flex flex-row gap-2 flex-wrap">
              {dietary.map((item, idx) => (
                <Badge key={item + idx} variant="outline" className="text-xs">
                  {item}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <span className="block text-xs text-gray-500 mb-1">Notes</span>
            <span className="text-sm">{notes}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default GuestDetailsCard;
