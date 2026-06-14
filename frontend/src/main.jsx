import React from "react";
import ReactDOM from "react-dom/client";
import "@/index.css";
import App from "@/App";
import { AuthProvider } from "@/contexts/AuthContext";
import { PublicDataProvider } from "@/contexts/PublicDataContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <PublicDataProvider>
        <App />
      </PublicDataProvider>
    </AuthProvider>
  </React.StrictMode>,
);
