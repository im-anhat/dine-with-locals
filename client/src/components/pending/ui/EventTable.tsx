import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

const guests = [
  {
    firstname: 'Jamie',
    lastname: 'Oliver',
    phone: '123456789',
    _id: '1',
  },
  {
    firstname: 'Success',
    lastname: 'abe45@example.com',
    phone: '123456789',
    _id: '2',
  },
];

function EventTable() {
  return (
    <div className="rounded-xl border bg-white text-gray-900 shadow p-6 mb-4 w-full max-w-5xl mx-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-8"></TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead className="text-right px-4">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {guests.map((guest) => (
            <TableRow key={guest._id}>
              <TableCell>
                <Checkbox />
              </TableCell>
              <TableCell className="font-medium">
                {guest.firstname} {guest.lastname}
              </TableCell>
              <TableCell className="font-medium">{guest.phone}</TableCell>

              <TableCell className="text-right">
                <div className="flex flex-row gap-2 justify-end">
                  <Button>Approve</Button>
                  <Button className="bg-gray-200 text-gray-900">Reject</Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default EventTable;
