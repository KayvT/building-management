import React from "react";

export const TaskTableColumns = [
  {
    field: "id",
    headerName: "ID",
    width: 100,
    flex: 1,
  },
  {
    field: "location",
    headerName: "Location || ID",
    width: 100,
    flex: 1,
    renderCell: (params) => {
      return (
        <div>
          <span>{`${params.row.location.name} || ${params.row.location.id}`}</span>
        </div>
      );
    },
  },

  {
    field: "createdAt",
    headerName: "Created At",
    width: 100,
    flex: 1.5,
    renderCell: (params) => {
      return <div>{new Date(params.row.createdAt).toLocaleString()}</div>;
    },
  },
  {
    field: "dueAt",
    headerName: "Due At",
    width: 100,
    flex: 1.5,
    renderCell: (params) => {
      return <div>{new Date(params.row.dueAt).toLocaleString()}</div>;
    },
  },
  {
    field: "priority",
    headerName: "Priority",
    width: 100,
    flex: 1,
    renderCell: (params) => {
      return (
        <div>
          {params.row.priority === "LOW" ? (
            // green
            <span className="bg-green-500 text-white text-xs font-medium me-2 px-2.5 py-0.5 rounded-full">
              {params.row.priority}
            </span>
          ) : params.row.priority === "MEDIUM" ? (
            // yellow
            <span className="bg-yellow-500 text-white text-xs font-medium me-2 px-2.5 py-0.5 rounded-full">
              {params.row.priority}
            </span>
          ) : params.row.priority === "HIGH" ? (
            // red
            <span className="bg-red-500 text-white text-xs font-medium me-2 px-2.5 py-0.5 rounded-full">
              {params.row.priority}
            </span>
          ) : (
            // purple
            <span className="bg-purple-500 text-white text-xs font-medium me-2 px-2.5 py-0.5 rounded-full">
              {params.row.priority}
            </span>
          )}
        </div>
      );
    },
  },
  {
    field: "operative.id",
    headerName: "Operative",
    flex: 1,
    renderCell: (params) => {
      return (
        <div>
          {params.row.operative?.id ? (
            <span className="text-gray-600">{params.row.operative?.id}</span>
          ) : (
            <span className="text-gray-400">N/A</span>
          )}
        </div>
      );
    },
  },
  {
    field: "state",
    headerName: "State",
    width: 100,
    flex: 1,
    renderCell: (params) => {
      return (
        <div>
          {params.row.state === "OPEN" ? (
            <span className="bg-green-700 text-white text-xs font-medium me-2 px-2.5 py-0.5 rounded-full">
              CLOSED
            </span>
          ) : (
            <span className="bg-red-900 text-white text-xs font-medium me-2 px-2.5 py-0.5 rounded-full">
              OPEN
            </span>
          )}
        </div>
      );
    },
  },
];
