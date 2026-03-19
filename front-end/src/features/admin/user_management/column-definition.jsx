import { Badge } from "@/components/ui/badge";
import PasswordCell from "./components/show-pass";
import UserTableOptions from "./components/user-table-options";

export const userColumns = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "password",
    header: "Password",
    cell: ({ row }) => {
      return <PasswordCell password={row.original.pass} />;
    },
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.online;
      return status  ? (
        <Badge variant="success">Online</Badge>
      ) : (
        <Badge variant="destructive">Offline</Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <UserTableOptions user={user} />
      )
    }
  },
];
