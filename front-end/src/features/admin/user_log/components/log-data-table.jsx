import { DataTable } from "@/components/custom/data-table";
import { DataTablePagination } from "@/components/custom/pagination";
import React, { useEffect, useMemo, useState } from "react";
import "@/css/dropdown.css";
import axios from "@/config/axios.config";

import {
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import FileDownload from "@/features/custom/components/excel-pdf-download";

const LogDataTable = ({ columns }) => {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [total, setTotal] = useState(0);
  const [logs, setlogs] = useState([]);
  useEffect(() => {
    axios
      .get("/getlogs", {
        params: {
          page: pagination.pageIndex + 1,
          limit: pagination.pageSize,
        },
      })
      .then((res) => {
        setlogs(res.data.logs);
        setTotal(res.data.total);
      });
  }, [pagination]);

  const table = useReactTable({
    data: logs,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    state: { pagination },
    onPaginationChange: setPagination,
    pageCount: Math.ceil(total / pagination.pageSize),
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
      tabledata: logs.map((log) => [
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
  }, [logs]);
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
