import { DataTable } from "@/components/custom/data-table";
import { DataTablePagination } from "@/components/custom/pagination";
import React, { useEffect, useMemo, useState } from "react";
import "@/css/dropdown.css";
import axios from "@/config/axios.config";

import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import FileDownload from "@/features/custom/components/excel-pdf-download";

const LogDataTable = ({ columns }) => {
  const [logs, setlogs] = useState([]);
  useEffect(() => {
    axios.get("/getlogs").then((res) => {
      setlogs(res.data.logs);
    });
  }, []);

  const flattenedLogs = useMemo(() => {
    return logs
      .flatMap((log) =>
        log.actions.map((action) => ({
          logId: log?._id,
          name: log?.user?.name,
          email: log?.user?.email,
          action: action?.action,
          details: action?.details,
          time: action?.createdAt,
        })),
      )
      .sort((a, b) => new Date(b.time) - new Date(a.time));
  }, [logs]);
  const table = useReactTable({
    data: flattenedLogs,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: (row, _, filterValue) => {
      const search = filterValue.toLowerCase();

      const name = row.original.name?.toLowerCase() ?? "";
      const action = row.original.action?.toLowerCase() ?? "";

      return name.includes(search) || action.includes(search);
    },
  });
  const fileData = useMemo(() => {
    return {
      tabledata: flattenedLogs.map((log) => [
        log.name,
        log.email,
        log.action,
        log.details,
        new Date(log.time).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      ]),
      tablehead: ["Full Name", "Email", "Action", "Details", "Time"],
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 30 },
        2: { cellWidth: 20 },
        3: { cellWidth: 50 },
        4: { cellWidth: 35 },
      },
    };
  }, [flattenedLogs]);
  return (
    <div className="flex flex-col gap-2">
      <div className="flex pb-2 gap-2">
        <div>
          <input
            type="search"
            placeholder="Search"
            className="search border"
            onChange={(e) => table.setGlobalFilter(e.target.value)}
          />
        </div>
        <FileDownload fileData={fileData} />
      </div>
      <DataTable table={table} columns={columns} />
      <DataTablePagination table={table} />
    </div>
  );
};

export default LogDataTable;
