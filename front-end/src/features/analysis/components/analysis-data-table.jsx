import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { DataTable } from "@/components/custom/data-table";
import { DataTablePagination } from "@/components/custom/pagination";
import { useEffect, useMemo, useState } from "react";
import axios from "@/config/axios.config";
import { Filter } from "@/components/custom/filter";
import FileDownload from "@/features/custom/components/excel-pdf-download";

export function AnalysisTable({ columns }) {
  const [analysisData, setAnalysisData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    role: "",
    startDate: null,
    startTime: "",
    endDate: null,
    endTime: "",
  });
  useEffect(() => {
    axios
      .get("/get-bot-analysis")
      .then((res) => {
        setAnalysisData(res.data?.bots);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  useEffect(() => {
    let filteredData = analysisData;
    if (filters.role.length > 0) {
      filteredData = filteredData.filter(
        (bot) => bot.operatorRole?.toLowerCase() === filters.role.toLowerCase(),
      );
    }
    if (filters.startDate) {
      if (filters.startDate) {
        filteredData = filteredData.filter(
          (bot) => new Date(bot.time) >= filters.startDate,
        );
      }
      if (filters.endDate) {
        filteredData = filteredData.filter(
          (bot) => new Date(bot.time) <= filters.endDate,
        );
      }
    }
    if (filters.startTime) {
      filteredData = filteredData.filter((bot) => {
        const botTime = new Date(bot.time).toTimeString().slice(0, 5);
        return botTime >= filters.startTime;
      });
    }
    if (filters.endDate) {
      filteredData = filteredData.filter(
        (bot) =>
          filters.endDate.toLocaleDateString() >=
          new Date(bot.time).toLocaleDateString(),
      );
    }
    if (filters.endTime) {
      filteredData = filteredData.filter((bot) => {
        const botTime = new Date(bot.time).toTimeString().slice(0, 5);
        return botTime <= filters.endTime;
      });
    }
    setFilteredData(filteredData);
  }, [filters, analysisData]);
  const table = useReactTable({
    data: filteredData ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
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
      tabledata: filteredData.map((bot) => [
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
  }, [filteredData]);
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
