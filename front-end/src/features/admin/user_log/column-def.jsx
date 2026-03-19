import "@/css/dropdown.css";

export const userLogColumns = [
  {
    id: "si.no",
    header: "S.No",
    cell: ({ row }) => {
      return row.index + 1;
    },
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "action",
    header: "Action",
  },
  {
    accessorKey: "details",
    header: "Details",
    cell: ({ row }) => {
      const details = row.original.details;
      return (
        <div className="max-w-[500px] wrap-break-word whitespace-normal">
          {details}
        </div>
      );
    },
  },
  {
    accessorKey: "time",
    header: "Time",
    cell: ({ row }) => {
      const time = row.original.time;
      return (
        <div>
          {new Date(time).toLocaleString("en-IN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })}
        </div>
      );
    },
  },
];
