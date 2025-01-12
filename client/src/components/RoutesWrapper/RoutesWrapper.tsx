import { Route, Routes, Navigate } from "react-router";
import TopologyLayout from "../../routes/topology/TopologyLayout";
import OperativesRoute from "../../routes/operatives/route";
import { FloorView } from "../TopologyContent/FloorView";
import { LocationView } from "../TopologyContent/LocationView";
import TasksLayout from "../../routes/tasks/TasksLayout";
import { TaskDetailView } from "../TaskDetailView/TaskDetailView";
import { useTenant } from "../../contexts/TenantIdContext/useTenant";

export default function RoutesWrapper() {
  const { currentTenantId } = useTenant();

  return (
    <Routes>
      <Route index element={
        currentTenantId ? 
        <Navigate to={`/${currentTenantId}/topology`} replace /> : 
        null
      } />
      <Route path="/" element={
        currentTenantId ? 
        <Navigate to={`/${currentTenantId}/topology`} replace /> : 
        null
      } />
      <Route path="/:tenantId/topology" element={<TopologyLayout />}>
        <Route path="floors/:floorId" element={<FloorView />} />
        <Route
          path="floors/:floorId/locations/:locationId"
          element={<LocationView />}
        />
      </Route>
      <Route path="/:tenantId/tasks" element={<TasksLayout />}>
        <Route path="/:tenantId/tasks/:taskId" element={<TaskDetailView />} />
      </Route>
      <Route path="/:tenantId/operatives" element={<OperativesRoute />} />
    </Routes>
  );
}
