import React from "react";
import LogDataTable from "./log-data-table";
import { userLogColumns } from "../column-def";

const UserLogs = () => {
  return (
    <div className="m-2">
      <LogDataTable columns={userLogColumns} />
    </div>
  );
};

export default UserLogs;
