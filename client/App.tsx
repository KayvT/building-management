import { gql, useQuery } from "@apollo/client";
import TasksRoute from "./src/routes/tasks/route";
import OperativesRoute from "./src/routes/operatives/route";
import { Link, Route } from "react-router";
import ToplogyRoute from "./src/routes/toplogy/route";
import { Routes } from "react-router";
import React from "react";

const GET_ALL_TENANTS = gql`
  query GetAllTenants {
    tenants {
      id
      name
    }
  }
`;

function App() {
  const { data } = useQuery(GET_ALL_TENANTS);
  console.log("#####", data);
  return (
    <div
      className="text-xl font-bold underline"
      style={{
        backgroundColor: "red",
        width: "600px",
        height: "600px",

        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Link to="/">Home</Link>
      <Link to="/tasks">Tasks</Link>
      <Link to="/topology">Topology</Link>
      <Link to="/operatives">Operatives</Link>
      <Routes>
        <Route path="/" element={<div>Home</div>} />
        <Route path="/tasks" element={<TasksRoute />} />
        <Route path="/topology" element={<ToplogyRoute />} />
        <Route path="/operatives" element={<OperativesRoute />} />
      </Routes>
    </div>
  );
}

export default App;
