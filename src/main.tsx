import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/global.css";
import App from "./App.tsx";
import Header from "./widgets/Components/Header.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Header />
    <div className="flex justify-center mt-[4rem]">
      <App />
    </div>
  </StrictMode>,
);
