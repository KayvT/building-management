import React from "react";


import { Route, Routes} from "react-router";
import TopologyRoute from "../../routes/topology/route";
import TasksRoute from "../../routes/tasks/route";
import OperativesRoute from "../../routes/operatives/route";

export default function RoutesWrapper() {
  return (
    <Routes>
      <Route path="/:tenantId/topology" element={<TopologyRoute />} />
      <Route path="/:tenantId/tasks" element={<TasksRoute />} />
      <Route path="/:tenantId/operatives" element={<OperativesRoute />} />
    </Routes>
  );
}
