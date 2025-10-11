import { StrictMode } from "react";

import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "@fortawesome/fontawesome-free/css/all.min.css";

import "./index.css";
import "../src/i18n/i18n.js";
import App from "./App.jsx";

// Use Vite's BASE_URL (derived from vite.config.js base) as router basename.
// Trim trailing slash because React Router expects a clean path.
const basename = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </StrictMode>
);
