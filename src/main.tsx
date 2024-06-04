import React from "react";
import ReactDOM from "react-dom/client";

import App from "./components/App.tsx";
import Homepage from "./components/Homepage.tsx";
import PluginGate from "./components/PluginGate.tsx";

export const ID = "es.memorablenaton.sheet-from-beyond";

const urlParams = new URLSearchParams(window.location.search);
const isFromOBR = urlParams.has("obrref");

ReactDOM.createRoot(document.getElementById("root")!).render(
  isFromOBR ? (
    <PluginGate>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </PluginGate>
  ) : (
    <Homepage />
  )
);
