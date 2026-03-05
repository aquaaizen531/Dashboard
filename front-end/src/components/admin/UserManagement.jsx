import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import "../../css/dropdown.css";
import "../../css/Bg.css";
import { toast } from "react-toastify";
import axios from "../../config/axios.config";
import { RiArrowDownWideLine } from "react-icons/ri";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Dropdown } from "primereact/dropdown";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
const UserManagement = () => {
  const [search, setsearch] = useState("");
  const [users, setusers] = useState([]);
  const [filteredUsers, setfilteredUsers] = useState([]);
  const [userRole, setuserRole] = useState("");
  const [activityStatus, setactivityStatus] = useState(null);
  const [isAddUserOpen, setisAddUserOpen] = useState(false);
  const [isEdit, setisEdit] = useState(false);
  const [updation, setupdation] = useState(true);
  const [showpass, setshowpass] = useState({
    key: false,
    email: null,
  });
  const [formvalue, setformvalue] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    location: "",
    role: "",
  });
  const [pass, setpass] = useState([]);
  useEffect(() => {
    const fetchdata = () => {
      axios
        .get("/getusers")
        .then((res) => {
          console.log(res);
          setusers(res.data.data || []);
        })
        .catch((err) => {
          console.log(err);
          setusers([]);
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
  }, [isEdit, updation, isAddUserOpen, activityStatus]);
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
      if (search.trim().length > 0) {
        filtered = filtered.filter(
          (user) =>
            user.name?.toLocaleLowerCase().includes(search.toLowerCase()) ||
            user.email?.toLocaleLowerCase().includes(search.toLowerCase()) ||
            String(user.phone)
              ?.toLowerCase()
              .includes(search.toLocaleLowerCase()),
        );
      }
      setfilteredUsers(filtered);
    };
    handleFilter();
  }, [search, users, userRole, activityStatus, pass]);
  const toggleaddUser = () => {
    setisAddUserOpen(!isAddUserOpen);
  };
  const [editId, seteditId] = useState(null);
  const handleEdit = (user) => {
    setisEdit(true);
    seteditId(user._id);
    setformvalue({
      name: user.name,
      email: user.email,
      phone: user.phone,
      location: user.location,
      role: user.role,
      activityStatus: user.activityStatus,
    });
    setisAddUserOpen(true);
  };
  const handleDelete = (id) => {
    axios
      .delete(`/deleteuser/${id}`)
      .then((res) => {
        setusers(res.data.users);
        toast.success("User Deleted");
        setupdation(!updation);
      })
      .catch((err) => {
        console.log(err.message);
        toast.error("Delete Failed!");
      });
  };
  const handleAddUser = (e) => {
    e.preventDefault();
    axios
      .post("/adduser", formvalue)
      .then((res) => {
        // console.log(res.data);
        setusers(res.data.users);
        toggleaddUser();
        setformvalue({
          name: "",
          email: "",
          phone: "",
          location: "",
          role: "",
        });
        toast.success("New User Added");
      })
      .catch((err) => {
        console.log(err);
        toast.error("Failed to Add New User!");
      });
  };
  const handleEditSubmit = (e) => {
    console.log("first");
    e.preventDefault();
    axios
      .patch(`/edituser/${editId}`, formvalue)
      .then((res) => {
        console.log(res);
        setusers(res.data.users);
        setisEdit(false);
        toggleaddUser();
        setformvalue({
          name: "",
          email: "",
          phone: "",
          location: "",
          role: "",
        });
        toast.success("User Updated");
      })
      .catch((err) => {
        console.log(err.message);
        toast.error("Failed to Update User!");
      });
  };
  const roleOptions = ["All", "admin", "Operator", "Analyst"];
  return (
    <div className="m-2">
      <div className="mb-2 flex gap-1 md:gap-2">
        <div>
          <input
            type="search"
            placeholder="Search"
            className="search"
            value={search}
            onChange={(e) => setsearch(e.target.value)}
          />
        </div>
        {/* role dropdown */}
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
        {/*  activity status dropdown */}
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
        {/*  add new user section */}
        <div className="dropdown-prnt-div ">
          <button className="add-user-btn" onClick={toggleaddUser}>
            Add User
          </button>
        </div>
      </div>
      {/* add user modal */}
      {isAddUserOpen &&
        createPortal(
          <div className="add-user-modal-prnt-div">
            <div className="overlay-blur-div"></div>
            <div
              className="add-usr-modal rounded-lg shadow-lg p-5 w-full
           max-w-md sm:max-w-lg md:max-w-xl min-h-[500px] flex flex-col z-50"
            >
              {/* <div className="backdrop-blur-2xl add-user-div"></div> */}
              <form
                className="p-5"
                onSubmit={isEdit ? handleEditSubmit : handleAddUser}
              >
                <div className="text-center text-xl font-semibold mb-4 add-usr-hdng">
                  {isEdit ? "Edit User" : "Add User"}
                </div>
                {(isEdit
                  ? ["Name", "Email", "Phone", "Password", "Location", "Role"]
                  : ["Name", "Email", "Phone", "Location", "Role"]
                ).map((feild) => {
                  const roleOptions = [
                    { label: "Admin", value: "admin" },
                    { label: "Operator", value: "operator" },
                    { label: "Analyst", value: "analyst" },
                  ];
                  const locationOptions = [
                    { label: "Kochi", value: "kochi" },
                    { label: "Chennai", value: "chennai" },
                  ];
                  if (feild === "Role") {
                    return (
                      <div key={feild} className="relative mb-2 mt-1">
                        <Dropdown
                          value={formvalue.role || null}
                          options={roleOptions}
                          onChange={(e) =>
                            setformvalue({
                              ...formvalue,
                              role: e.value,
                            })
                          }
                          className="custom-select bg-white w-full h-[50px] rounded-lg pl-[20px] text-xs 
                        border border-black-300 focus:outline-none "
                          required
                          placeholder="Role"
                        />
                      </div>
                    );
                  } else if (feild === "Location") {
                    return (
                      <div key={feild} className="relative mb-1 mt-1">
                        <Dropdown
                          value={formvalue.location || null}
                          options={locationOptions}
                          onChange={(e) =>
                            setformvalue({
                              ...formvalue,
                              location: e.value,
                            })
                          }
                          className="custom-select bg-white w-full h-[50px] rounded-lg pl-[20px] text-xs 
                        border border-black-300 focus:outline-none "
                          required
                          placeholder="Location"
                        />
                      </div>
                    );
                  }
                  return (
                    <input
                      key={feild}
                      className="bg-white w-full h-[50px] rounded-lg pl-[20px] text-xs mb-1 mt-1
                   border border-black-300 focus:outline-none placeholder-gray-950"
                      placeholder={feild}
                      name={feild}
                      value={formvalue[feild.toLowerCase()]}
                      onChange={(e) =>
                        setformvalue({
                          ...formvalue,
                          [feild.toLowerCase()]: e.target.value,
                        })
                      }
                      type={
                        feild === "Email"
                          ? "email"
                          : feild === "Phone"
                            ? "number"
                            : feild === "Password"
                              ? "password"
                              : "text"
                      }
                    />
                  );
                })}
                {/* {console.log(isUserActive)} */}
                {/* <div
                  onClick={() => {
                    const status = !isUserActive;
                    setisUserActive(status);
                    setformvalue((prev) => ({
                      ...prev,
                      activityStatus: status
                    }));
                  }}
                  className={`flex justify-center mt-2 mb-2 w-full p-2  rounded-md text-white cursor-pointer 
                   ${isUserActive ? "bg-red-500" : "bg-green-500"}`}
                >
                  {isUserActive ? "Deactivate" : "Activate"}
                </div> */}
                <button
                  type="submit"
                  className={`w-full py-2 add-user-btn rounded-md text-white font-semibold transition-colors 
                    duration-200 ${isEdit ? "" : "mt-2"}`}
                >
                  {isEdit ? "Update" : "Add"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    toggleaddUser();
                    setisEdit(!isEdit);
                    setformvalue({
                      name: "",
                      email: "",
                      phone: "",
                      password: "",
                      location: "",
                      role: "",
                    });
                  }}
                  className="w-full mt-2 py-2 bg-red-500 hover:bg-red-600 rounded-md text-white font-semibold transition-colors
                 duration-200"
                >
                  Cancel
                </button>
              </form>
            </div>
          </div>,
          document.body,
        )}
      <div className="max-h-[calc(100vh-180px)] ">
        <dir className="tbldiv">
          <table className="tbl">
            <thead className="tblhead">
              <tr>
                {[
                  "Sl. no.",
                  "Full name",
                  "Email",
                  "Phone",
                  "Password",
                  "Location",
                  "User role",
                  "Activity status",
                  "Action",
                ].map((heading, idx) => (
                  <th key={idx} className="tblhdng">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, idx) => (
                <tr key={user._id} className="bg-e-o">
                  <td className="tblhdng ">{idx + 1}</td>
                  <td className="tblhdng ">{user.name}</td>
                  <td className="tblhdng ">{user.email}</td>
                  <td className="tblhdng ">{user.phone} </td>
                  <td className="tblhdng ">
                    {showpass.key === true && showpass.email === user.email
                      ? user.pass
                      : "*******"}{" "}
                    <button
                      type="button"
                      className="text-gray-500 hover:text-gray-700"
                      onClick={() =>
                        setshowpass({
                          key: !(showpass.key && showpass.email === user.email),
                          email: user.email,
                        })
                      }
                    >
                      {showpass.key && showpass.email === user.email ? (
                        <FaEyeSlash />
                      ) : (
                        <FaEye />
                      )}
                    </button>
                  </td>
                  <td className="tblhdng ">{user.location} </td>
                  <td className="tblhdng ">{user.role}</td>
                  <td className="tblhdng flex items-center gap-2">
                    <span
                      className={`h-3 w-3 rounded-full ${
                        user.online ? "bg-green-500" : "bg-red-500"
                      }`}
                    ></span>
                    {user.online ? "Online" : "Offline"}
                  </td>
                  <td className="tblhdn p-2 ">
                    <div className="flex gap-1">
                      <button
                        className="edt-btn"
                        onClick={() => handleEdit(user)}
                      >
                        Edit
                      </button>
                      <button
                        className="dlt-btn"
                        onClick={() => handleDelete(user._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </dir>
      </div>
    </div>
  );
};

export default UserManagement;
