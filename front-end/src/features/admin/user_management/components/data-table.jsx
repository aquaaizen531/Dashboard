import { useEffect, useState } from "react";
import axios from "@/config/axios.config";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { DataTable } from "@/components/custom/data-table";
import { DataTablePagination } from "@/components/custom/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { RiArrowDownWideLine } from "react-icons/ri";
import { useUserStateStore } from "../hooks/use-add-user-modal";

export function UserDataTable({ columns }) {
  const {
    isEdit,
    setIsEdit,
    setEditId,
    userModalOpen,
    setUserModalOpen,
    setFormValue,
    users,
    setUsers,
  } = useUserStateStore();
  const [filteredUsers, setfilteredUsers] = useState([]);
  const [userRole, setuserRole] = useState("");
  const [activityStatus, setactivityStatus] = useState(null);
  const [pass, setpass] = useState([]);
  useEffect(() => {
    const fetchdata = () => {
      axios
        .get("/getusers")
        .then((res) => {
          console.log(res);
          setUsers(res.data.data || []);
        })
        .catch((err) => {
          console.log(err);
          setUsers([]);
        });
      axios
        .get("/pass")
        .then((res) => {
          setpass(res.data.data || []);
        })
        .catch((err) => {
          console.log(err);
          setpass([]);
        });
    };
    fetchdata();
    const interval = setInterval(() => {
      fetchdata();
    }, 20000);
    return () => clearInterval(interval);
  }, [isEdit, activityStatus, setUsers]);

  useEffect(() => {
    const handleFilter = () => {
      const mergedData = users.map((user) => {
        const d1 = pass.find((pass) => pass.user === user._id);
        return {
          ...user,
          pass: d1 ? d1.pass : null,
        };
      });
      let filtered = mergedData;
      if (userRole) {
        filtered = filtered.filter((user) => {
          if (userRole === "All") return true;
          return user.role.toLowerCase() === userRole.toLowerCase();
        });
      }
      if (activityStatus !== null) {
        filtered = filtered.filter((user) => user.online === activityStatus);
      }
      setfilteredUsers(filtered);
    };
    handleFilter();
  }, [users, userRole, activityStatus, pass]);

  const toggleaddUser = () => {
    setIsEdit(false);
    setEditId(null);
    setFormValue({
      name: "",
      email: "",
      phone: "",
      password: "",
      location: "",
      role: "",
    });
    setUserModalOpen(!userModalOpen);
  };

  const roleOptions = ["All", "admin", "Operator", "Analyst"];

  const table = useReactTable({
    data: filteredUsers,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: (row, _, filterValue) => {
      const search = filterValue.toLowerCase();

      const name = row.original.name?.toLowerCase() ?? "";
      const email = row.original.email?.toLowerCase() ?? "";
      const phone = row.original.phone?.toLowerCase() ?? "";
      const location = row.original.location?.toLowerCase() ?? "";

      return (
        name.includes(search) ||
        email.includes(search) ||
        phone.includes(search) ||
        location.includes(search)
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-[130px] justify-between">
                {userRole ? (userRole === "All" ? "All" : userRole) : "Role"}
                <RiArrowDownWideLine />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[130px] p-1">
              {roleOptions.map((role, idx) => (
                <DropdownMenuItem key={idx} onClick={() => setuserRole(role)}>
                  {role}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-[130px] justify-between">
                {activityStatus === null
                  ? "Status"
                  : activityStatus === true
                    ? "Online"
                    : "Offline"}
                <RiArrowDownWideLine />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[130px] p-1">
              {["All", "Online", "Offline"].map((status, idx) => (
                <DropdownMenuItem
                  key={idx}
                  onClick={() =>
                    setactivityStatus(
                      status === "All"
                        ? null
                        : status === "Online"
                          ? true
                          : false,
                    )
                  }
                >
                  {status}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="dropdown-prnt-div ">
          <button className="add-user-btn" onClick={toggleaddUser}>
            Add User
          </button>
        </div>
      </div>
      <DataTable table={table} columns={columns} />
      <DataTablePagination table={table} />
    </div>
  );
}
