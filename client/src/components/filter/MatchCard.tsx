import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  Calendar,
  MessageCircle,
  User,
  MapPin,
  Clock,
  FileText,
} from 'lucide-react';
const MatchCard = ({
  name,
  date,
  time,
  description,
  tags = [],
  avatar,
  initials,
}) => (
  <Card className="w-full max-w-md hover:shadow-md transition-shadow">
    <CardHeader className="pb-3">
      <div className="flex items-start gap-3">
        <Avatar className="w-12 h-12">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback className="bg-blue-100 text-blue-600 font-medium">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <CardTitle className="text-lg truncate">{name}</CardTitle>
          <div className="text-sm text-muted-foreground">
            {date} • {time}
          </div>
        </div>
      </div>
    </CardHeader>

    {/* CARD CONTENT */}
    <CardContent className="space-y-3">
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      <div className="flex gap-2 pt-2">
        <Button size="sm" className="flex-1">
          Accept
        </Button>
        <Button size="sm" variant="outline" className="flex-1">
          <MessageCircle className="w-3 h-3 mr-1" />
          Message
        </Button>
      </div>
    </CardContent>
  </Card>
);

export default MatchCard;
