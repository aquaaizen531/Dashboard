import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash, UserPen } from "lucide-react";
import axios from "@/config/axios.config";
import { toast } from "sonner";
import { useUserStateStore } from "../hooks/use-add-user-modal";
import { useConfirm } from "@/features/custom/hooks/useConfirm";

const UserTableOptions = ({ user }) => {
  const [DeleteUser, confirmDeleteUser] = useConfirm({
    title: "Delete User",
    description: "Are you sure you want to delete this user?",
    variant: "destructive",
  });
  const [updation, setupdation] = useState(true);
  const {
    setUserModalOpen,
    setIsEdit,
    setEditId,
    setFormValue: seteditForm,
    setUsers,
  } = useUserStateStore();
  const handleEdit = () => {
    setIsEdit(true);
    setEditId(user._id);
    seteditForm({
      name: user.name,
      email: user.email,
      phone: user.phone,
      location: user.location,
      role: user.role,
      activityStatus: user.activityStatus,
    });
    setUserModalOpen(true);
  };
  const handleDelete = async () => {
    const confirmed = await confirmDeleteUser();
    if (!confirmed) return;
    await axios
      .delete(`/deleteuser/${user._id}`)
      .then((res) => {
        setUsers(res.data.users);
        toast.success("User Deleted");
        setupdation(!updation);
      })
      .catch((err) => {
        console.log(err.message);
        toast.error("Delete Failed!");
      });
  };
  return (
    <DropdownMenu>
      <DeleteUser />
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={handleEdit}>
          <UserPen className="h-4 w-4" />
          Edit User
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDelete}>
          <Trash className="h-4 w-4" />
          Delete User
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserTableOptions;
