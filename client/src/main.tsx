import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../index.css";
import App from "../App";

import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <div className="h-screen w-screen bg-gray-100">
        <App />
      </div>
    </BrowserRouter>
  </StrictMode>
);
