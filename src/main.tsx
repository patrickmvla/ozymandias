import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import HomePage from "./app/page.tsx";
import { Toaster } from "./components/ui/sonner.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HomePage />
    <Toaster />
  </StrictMode>
);
