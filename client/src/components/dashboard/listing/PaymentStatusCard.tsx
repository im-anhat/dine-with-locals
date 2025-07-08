import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PaymentStatusCardProps {
  status?: 'Pending' | 'Paid';
  amount?: number;
  receivedDate?: string;
}

function PaymentStatusCard({
  status = 'Pending',
  amount = 123,
  receivedDate = '12/3/2025',
}: PaymentStatusCardProps) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Payment Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="font-medium">Status</span>
            <Badge variant="outline" className="text-xs">
              {status}
            </Badge>
          </div>
          <div>
            <span className="block text-gray-500 text-xs mb-1">$</span>
            <span className="text-xl font-bold">${amount}</span>
          </div>
          <div>
            <span className="block text-xs text-gray-500 mb-1">
              Received Date
            </span>
            <span className="text-sm">{receivedDate}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default PaymentStatusCard;
