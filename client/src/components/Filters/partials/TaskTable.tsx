import { DataGrid } from "@mui/x-data-grid";
import React from "react";
import { TaskTableColumns } from "./TaskTableColumns";
type TaskTableProps = {
  tasks: {
    id: string;
    location: {
      name: string;
      id: string;
    };
    state: string;
    createdAt: string;
    dueAt: string;
    priority: string;
    operative: {
      id: string;
    };
  }[];
};
export default function TaskTable({ tasks }: TaskTableProps) {
  return (
    <div className="flex flex-row justify-between items-center w-full">
      <DataGrid
        rows={tasks}
        disableColumnResize
        disableColumnSelector
        showCellVerticalBorder
        showColumnVerticalBorder
        disableColumnFilter
        disableColumnMenu
        disableColumnSorting
        hideFooter
        pageSizeOptions={[20]}
        columns={TaskTableColumns}
        
      />
    </div>
  );
}
