import React from "react";
import ReactDOM from "react-dom/client";
import { I18nProvider } from "./i18n/I18nProvider";
import { Dashboard } from "./Dashboard";
import "./index.css";

const root = document.getElementById("root");
if (!root) throw new Error("Root element not found");

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <I18nProvider>
      <Dashboard />
    </I18nProvider>
  </React.StrictMode>
);
