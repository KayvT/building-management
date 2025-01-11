import React from "react";
import { Route, Routes } from "react-router";
import TopologyLayout from "../../routes/topology/TopologyLayout";
import TasksRoute from "../../routes/tasks/route";
import OperativesRoute from "../../routes/operatives/route";
import { FloorView } from "../TopologyContent/FloorView";
import { LocationView } from "../TopologyContent/LocationView";

export default function RoutesWrapper() {
  return (
    <Routes>
      <Route path="/:tenantId/topology" element={<TopologyLayout />}>
        <Route path="floors/:floorId" element={<FloorView />} />
        <Route
          path="floors/:floorId/locations/:locationId"
          element={<LocationView />}
        />
        <Route
          path="floors/:floorId/locations/:locationId/spots/:spotId"
          element={<div>Spot View</div>}
        />
      </Route>
      <Route path="/:tenantId/tasks" element={<TasksRoute />} />
      <Route path="/:tenantId/operatives" element={<OperativesRoute />} />
    </Routes>
  );
}
