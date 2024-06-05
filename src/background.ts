import OBR from "@owlbear-rodeo/sdk";
import { setupContextMenu } from "./contextMenu";

const setTheme = (theme: string): void => {
  document.getElementById("html_root")?.setAttribute("data-bs-theme", theme);
};

OBR.onReady(() => {
  setupContextMenu();

  OBR.theme.getTheme().then((theme) => {
    setTheme(theme.mode.toLowerCase());
  });
  OBR.theme.onChange((theme) => {
    setTheme(theme.mode.toLowerCase());
  });
});
