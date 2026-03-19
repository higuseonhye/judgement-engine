import React from "react";
import ReactDOM from "react-dom/client";
import { Dashboard } from "./Dashboard";
import "./index.css";

const root = document.getElementById("root");
if (!root) throw new Error("Root element not found");

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <Dashboard />
  </React.StrictMode>
);
