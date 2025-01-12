import React from "react";
import { Box, CircularProgress, Button } from "@mui/material";
import { useState } from "react";
import Filters from "../../components/Filters/Filters";
import { useQuery } from "@apollo/client";
import { GET_TASKS } from "../../graphql/queries/tasks";
import TaskTable from "../../components/Filters/partials/TaskTable";
import AddTaskDialog from "../../components/AddTaskDialog/AddTaskDialog";
import { Outlet } from "react-router";
export default function TasksLayout() {
  const { data, loading, error } = useQuery(GET_TASKS);
  const [openTaskModal, setOpenTaskModal] = useState(false);

  if (loading) return <CircularProgress />;
  if (error) return <div>Error: {error.message}</div>;
  return (
    <>
      <>
        <div
          style={{
            display: "flex",
            height: "calc(100vh - 250px)",
            justifyContent: "center",
            alignItems: "center",
            margin: "48px auto",
            flexDirection: "column",
          }}
        >
          <div
            className="flex flex-row justify-between items-center w-full"
            style={{
              width: "100%",
              maxWidth: "1100px",
            }}
          >
            <h1 className="text-5xl font-bold mb-4">Tasks</h1>
          </div>
          <Box
            className="flex flex-col"
            sx={{
              width: "100%",
              flex: 1,
              maxWidth: "1100px",
              boxShadow: "0 0 16px 0 rgba(0, 0, 0, 0.1)",
              backgroundColor: "white",
              borderRadius: "8px",
              height: "800px",
              overflowY: "auto",
              padding: "1rem 2rem",
            }}
            boxShadow={4}
          >
            <div className="flex flex-row justify-between items-center w-full">
              <Filters />
              <Button
                variant="contained"
                color="primary"
                sx={{
                  marginTop: "32px",
                }}
                onClick={() => {
                  console.log("add task");
                  setOpenTaskModal(true);
                }}
              >
                Add Task
              </Button>
            </div>
            <TaskTable tasks={data.tasks} />
          </Box>
          <Outlet />
          <AddTaskDialog
            open={openTaskModal}
            setOpenTaskModal={setOpenTaskModal}
            onClose={() => setOpenTaskModal(false)}
          />
        </div>
      </>
    </>
  );
}
