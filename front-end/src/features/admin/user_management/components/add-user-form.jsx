import React, { useState } from "react";
import { toast } from "sonner";
import axios from "@/config/axios.config";
import { useUserStateStore } from "../hooks/use-add-user-modal";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AddUserForm = () => {
  const {
    isEdit,
    userModalOpen,
    setUserModalOpen,
    setUsers,
    editId,
    setEditId,
    setIsEdit,
    formValue,
    setFormValue,
  } = useUserStateStore();
  const [form, setForm] = useState({
    name: formValue.name,
    email: formValue.email,
    phone: formValue.phone,
    password: formValue.password,
    location: formValue.location,
    role: formValue.role,
  });
  const handleAddUser = (e) => {
    e.preventDefault();
    axios
      .post("/adduser", form)
      .then((res) => {
        setUsers(res.data.users);
        setUserModalOpen(!userModalOpen);
        setForm({
          name: "",
          email: "",
          phone: "",
          location: "",
          role: "",
        });
        setFormValue({
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
    e.preventDefault();
    axios
      .patch(`/edituser/${editId}`, form)
      .then((res) => {
        setUsers(res.data.users);
        setIsEdit(false);
        setUserModalOpen(!userModalOpen);
        setEditId(null);
        setForm({
          name: "",
          email: "",
          phone: "",
          location: "",
          role: "",
        });
        setFormValue({
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
  return (
    <Card className="w-full h-full border-none shadow-sm">
      <CardContent>
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
                  <Select
                    value={form.role || ""}
                    onValueChange={(value) =>
                      setForm((prev) => ({
                        ...prev,
                        role: value,
                      }))
                    }
                  >
                    <SelectTrigger
                      className="custom-select bg-white w-full h-[50px] rounded-lg pl-[20px] text-xs
                       border border-black-300 focus:outline-none"
                    >
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>

                    <SelectContent>
                      {roleOptions.map((opt, index) => (
                        <SelectItem key={index} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              );
            } else if (feild === "Location") {
              return (
                <div key={feild} className="relative mb-1 mt-1">
                  <Select
                    value={form.location || ""}
                    onValueChange={(value) =>
                      setForm((prev) => ({
                        ...prev,
                        location: value,
                      }))
                    }
                  >
                    <SelectTrigger
                      className="custom-select bg-white w-full h-[50px] rounded-lg pl-[20px] text-xs
                       border border-black-300 focus:outline-none"
                    >
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>

                    <SelectContent>
                      {locationOptions.map((opt, index) => (
                        <SelectItem key={index} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              );
            }
            return (
              <input
                key={feild}
                className="bg-white w-full h-[50px] rounded-lg px-[20px] text-xs mb-1 mt-1
                             border border-black-300 focus:outline-none placeholder-gray-950"
                placeholder={feild}
                name={feild}
                value={form[feild.toLowerCase()]}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    [feild.toLowerCase()]: e.target.value,
                  }))
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
          <button
            type="submit"
            className={`!w-full py-2 add-user-btn rounded-md text-white font-semibold transition-colors 
                              duration-200 ${isEdit ? "" : "mt-2"}`}
          >
            {isEdit ? "Update" : "Add"}
          </button>
          <button
            type="button"
            onClick={() => {
              setUserModalOpen(!userModalOpen);
              setIsEdit(!isEdit);
              setEditId(null);
              setFormValue({
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
      </CardContent>
    </Card>
  );
};

export default AddUserForm;
