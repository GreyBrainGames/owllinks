import OBR from "@owlbear-rodeo/sdk";
import React, { useEffect, useState } from "react";

import SceneNotReady from "./SceneNotReady";
import { Container } from "react-bootstrap";
import { setupContextMenu } from "../contextMenu";
import { ID } from "../main";
import { useLocalStorage } from "@uidotdev/usehooks";

const setTheme = (theme: string): void => {
  document.getElementById("html_root")?.setAttribute("data-bs-theme", theme);
};

const App: React.FC = () => {
  const [sceneReady, setSceneReady] = useState(false);
  const [isPopoverMode, setIsPopoverMode] = useLocalStorage(`${ID}/popoverMode`, false);

  useEffect(() => {
    OBR.scene.isReady().then(setSceneReady);
    return OBR.scene.onReadyChange(setSceneReady);
  }, []);

  useEffect(() => {
    OBR.onReady(() => {
      setupContextMenu();
    
      OBR.theme.getTheme().then((theme) => {
        setTheme(theme.mode.toLowerCase());
      });
      OBR.theme.onChange((theme) => {
        setTheme(theme.mode.toLowerCase());
      });
    });
  });

  const handleOnChange = (popoverMode: boolean) => {
    console.log(`Setting popover mode to ${popoverMode}`);
    localStorage.setItem(`${ID}/popoverMode`, `${isPopoverMode}`);
    setIsPopoverMode(popoverMode);
  };

  return sceneReady ? (
    <Container className="mt-3">
      <h1>Settings</h1>
      <div>
        <h2>Display Mode</h2>
        <input
          type="radio"
          id="popoverMode"
          name="displayMode"
          value="popover"
          checked={isPopoverMode}
          onChange={() => handleOnChange(true)}
        />
        <label htmlFor="popoverMode">Popover Mode</label>
        <br />
        <input
          type="radio"
          id="popupMode"
          name="displayMode"
          value="popup"
          checked={!isPopoverMode}
          onChange={() => handleOnChange(false)}
        />
        <label htmlFor="popupMode">Popup Window Mode</label>
      </div>
    </Container>
  ) : (
    <SceneNotReady />
  );
};

export default App;
