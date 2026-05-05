import {
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { DataTable } from "@/components/custom/data-table";
import { DataTablePagination } from "@/components/custom/pagination";
import { useEffect, useMemo, useState } from "react";
import axios from "@/config/axios.config";
import { Filter } from "@/components/custom/filter";
import FileDownload from "@/features/custom/components/excel-pdf-download";
import { toast } from "sonner";

export function AnalysisTable({ columns }) {
  const [analysisData, setAnalysisData] = useState([]);
  const [filters, setFilters] = useState({
    role: "",
    startDate: null,
    startTime: "",
    endDate: null,
    endTime: "",
  });
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [total, setTotal] = useState(0);
  useEffect(() => {
    if (
      (filters.startTime && !filters.startDate) ||
      (filters.endTime && !filters.endDate)
    ) {
      toast.error("Please select start date and end date to apply time filter");
      return;
    }
    const startDateTime = filters.startDate ? new Date(filters.startDate) : null;
    if (filters.startTime && startDateTime) {
      const [startHours, startMinutes] = filters.startTime.split(":");
      startDateTime.setHours(startHours, startMinutes);
    }
    const endDateTime = filters.endDate ? new Date(filters.endDate) : null;
    if (filters.endTime && endDateTime) {
      const [endHours, endMinutes] = filters.endTime.split(":");
      endDateTime.setHours(endHours, endMinutes);
    }
    axios
      .get("/get-bot-analysis", {
        params: {
          page: pagination.pageIndex + 1,
          limit: pagination.pageSize,
          role: filters.role,
          startDate: startDateTime?.toISOString(),
          endDate: endDateTime?.toISOString(),
          startTime: filters.startTime,
          endTime: filters.endTime,
        },
      })
      .then((res) => {
        setAnalysisData(res.data?.bots);
        setTotal(res.data?.total || 0);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [pagination, filters]);
  const table = useReactTable({
    data: analysisData ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    state: { pagination },
    onPaginationChange: setPagination,
    pageCount: Math.ceil(total / pagination.pageSize),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: (row, _, filterValue) => {
      const search = filterValue.toLowerCase();

      const UniqueCode = row.original.UniqueCode?.toLowerCase() ?? "";
      const botName = row.original.botName?.toLowerCase() ?? "";
      const location = row.original.location?.toLowerCase() ?? "";
      const operatorName = row.original.operatorName?.toLowerCase() ?? "";
      const operatorEmail = row.original.operatorEmail?.toLowerCase() ?? "";

      return (
        UniqueCode.includes(search) ||
        botName.includes(search) ||
        location.includes(search) ||
        operatorName.includes(search) ||
        operatorEmail.includes(search)
      );
    },
  });
  const fileData = useMemo(() => {
    return {
      tabledata: analysisData?.map((bot) => [
        bot.UniqueCode,
        bot.botName,
        bot.location,
        bot.operatorName,
        bot.operatorEmail,
        new Date(bot.time).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      ]),
      tablehead: [
        "UniqueCode",
        "botName",
        "location",
        "operatorName",
        "operatorEmail",
        "time",
      ],
      columnStyles: {
        0: { cellWidth: 20 },
        1: { cellWidth: 20 },
        2: { cellWidth: 20 },
        3: { cellWidth: 40 },
        4: { cellWidth: 40 },
        5: { cellWidth: 30 },
      },
    };
  }, [analysisData]);
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
        <div>
          <Filter filters={filters} setFilters={setFilters} />
        </div>
        <FileDownload fileData={fileData} />
      </div>
      <DataTable table={table} columns={columns} />
      <DataTablePagination table={table} />
    </div>
  );
}
