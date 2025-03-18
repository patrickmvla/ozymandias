import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import HomePage from "./app/page.tsx";
import { Toaster } from "./components/ui/sonner.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <body
      className={`bg-gray-50 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] h-full w-full`}
    >
      <div className="fixed w-full h-full top-0 bg-[radial-gradient(100%_50%_at_50%_0%,rgba(0,163,255,0.13)_0,rgba(0,163,255,0)_50%,rgba(0,163,255,0)_100%)]">
        <div className="relative">
          <HomePage />
          <Toaster />
        </div>
      </div>
    </body>
  </StrictMode>
);
