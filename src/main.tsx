import "bootstrap/dist/css/bootstrap.min.css";
import { createRoot } from "react-dom/client";
import App from "./components/App";
import PluginGate from "./components/PluginGate";

export const ID = "gr.greybraingames.owllinks";

const container = document.getElementById("app");
const root = createRoot(container!);

const urlParams = new URLSearchParams(window.location.search);
const isFromOBR = urlParams.has("obrref");

root.render(
  isFromOBR ? (
    <PluginGate>
      <App />
    </PluginGate>
  ) : (
    <iframe src="/README.html" title="README" id="readme" width="800" height="1200"></iframe>
  )
);
