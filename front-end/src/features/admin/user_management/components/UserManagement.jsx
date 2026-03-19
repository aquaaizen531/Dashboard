import { userColumns } from "../column-definition";
import { UserDataTable } from "./data-table";
import UserAddEditModal from "./user-modal";

const UserManagement = () => {
  return (
    <div className="m-2">
      <UserDataTable columns={userColumns} />
      <UserAddEditModal />
    </div>
  );
};

export default UserManagement;
