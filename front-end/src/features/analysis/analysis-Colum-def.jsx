export const analysisColumns = [
  {
    accessorKey: "UniqueCode",
    header: "Bot ID",
  },
  {
    accessorKey: "botName",
    header: "Bot Name",
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "Status",
    header: "Status",
  },
  {
    accessorKey: "operatorName",
    header: "Operator Name",
  },
  {
    accessorKey: "operatorEmail",
    header: "Operator Email",
  },
  {
    accessorKey: "operatorRole",
    header: "Operator Role",
  },
  {
    accessorKey: "time",
    header: "Time",
    cell: ({ row }) => {
      const date = new Date(row.original.time);
      return `${date.toLocaleTimeString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })}`;
    },
  },
];
