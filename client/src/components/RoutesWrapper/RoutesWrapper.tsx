import React from "react";

import { useTenant } from "../../contexts/useTenant";
import { Route, Routes, Navigate } from "react-router";
import TopologyRoute from "../../routes/topology/route";
import TasksRoute from "../../routes/tasks/route";
import OperativesRoute from "../../routes/operatives/route";

export default function RoutesWrapper() {
  const { currentTenantId } = useTenant();
  return (
    <Routes>
      <Route
        path="/"
        element={
          currentTenantId ? (
            <Navigate to={`/${currentTenantId}/topology`} replace />
          ) : null
        }
      />

      <Route path="/:tenantId/topology" element={<TopologyRoute />} />
      <Route path="/:tenantId/tasks" element={<TasksRoute />} />
      <Route path="/:tenantId/operatives" element={<OperativesRoute />} />
    </Routes>
  );
}
