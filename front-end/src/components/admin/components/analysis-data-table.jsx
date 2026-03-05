import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { DataTable } from "@/components/custom/data-table";
import { DataTablePagination } from "@/components/custom/pagination";
import { useEffect, useState } from "react";
import axios from "@/config/axios.config";
import { Filter } from "@/components/custom/filter";

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
    console.log("first");
    axios
      .get("/get-bot-analysis")
      .then((res) => {
        console.log(res.data.bots);
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
      console.log(filters.startDate);
      filteredData = filteredData.filter(
        (bot) =>
          filters.startDate.toLocaleDateString() <=
          new Date(bot.time).toLocaleDateString(),
      );
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
    globalFilterFn: (row, columnId, filterValue) => {
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
      </div>
      <DataTable table={table} columns={columns} />
      <DataTablePagination table={table} />
    </div>
  );
}
