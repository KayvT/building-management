import {
  Box,
  CircularProgress,
  Button,
  SelectChangeEvent,
} from "@mui/material";
import { useState } from "react";
import Filters from "../../components/Filters/Filters";
import { useQuery } from "@apollo/client";
import { GET_TASKS } from "../../graphql/queries";
import TaskTable from "../../components/Filters/partials/TaskTable";
import AddTaskDialog from "../../components/Dialogs/AddTaskDialog/AddTaskDialog";
import { Outlet } from "react-router";
import { GET_OPERATIVES } from "../../graphql/queries";

export default function TasksLayout() {
  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [filters, setFilters] = useState<{
    priority: string | undefined;
    state: string | undefined;
    operativeId: string | undefined | null;
  }>({
    priority: undefined,
    state: undefined,
    operativeId: undefined,
  });
  const { data: operativesData } = useQuery(GET_OPERATIVES);
  const { data, loading, error, refetch } = useQuery(GET_TASKS, {
    variables: {
      filter: filters,
    },
  });

  const handlePriorityChange = (value: string) => {
    if (value === filters.priority) {
      setFilters({ ...filters, priority: undefined });
    } else {
      setFilters({ ...filters, priority: value });
    }
    refetch({
      variables: {
        filter: filters,
      },
    });
  };

  const handleStateChange = (value: string) => {
    if (value === filters.state) {
      setFilters({ ...filters, state: undefined });
    } else {
      setFilters({ ...filters, state: value });
    }
    refetch({
      variables: {
        filter: filters,
      },
    });
  };

  const handleOperativeChange = (event?: SelectChangeEvent<string | null>) => {
    if (!event) {
      setFilters({ ...filters, operativeId: null });
    }
    if (event?.target.value === filters.operativeId) {
      setFilters({ ...filters, operativeId: undefined });
    } else {
      setFilters({ ...filters, operativeId: event?.target.value });
    }
    refetch({
      variables: {
        filter: filters,
      },
    });
  };

  const handleClear = () => {
    setFilters({
      ...filters,
      priority: undefined,
      state: undefined,
      operativeId: undefined,
    });
    refetch({
      variables: {
        filter: filters,
      },
    });
  };

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          height: "calc(100vh - 250px)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </div>
    );
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
              <Filters
                operatives={operativesData?.tenant?.operatives}
                filters={filters}
                handlePriorityChange={handlePriorityChange}
                handleStateChange={handleStateChange}
                handleOperativeChange={handleOperativeChange}
                handleClear={handleClear}
              />
              <Button
                variant="contained"
                color="primary"
                sx={{
                  marginTop: "32px",
                }}
                onClick={() => {
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
