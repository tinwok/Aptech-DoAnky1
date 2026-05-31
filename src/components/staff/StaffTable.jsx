import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

import { Badge } from "../ui/badge";

export default function StaffTable({ staffs }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Assigned Customers</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {staffs.map((staff) => (
          <TableRow key={staff.id}>
            <TableCell>{staff.id}</TableCell>
            <TableCell>{staff.name}</TableCell>
            <TableCell>{staff.email}</TableCell>
            <TableCell>{staff.phone}</TableCell>
            <TableCell>{staff.role}</TableCell>
            <TableCell>{staff.assignedCustomers}</TableCell>
            <TableCell>
              <Badge>{staff.status}</Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
