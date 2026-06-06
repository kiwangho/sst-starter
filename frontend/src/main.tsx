// DO NOT MODIFY — managed by platform team
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "./_auth/AuthProvider";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);
