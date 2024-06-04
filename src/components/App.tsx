import OBR from "@owlbear-rodeo/sdk";
import React, { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import SPA from "./SPA";
import SceneNotReady from "./SceneNotReady";

const App: React.FC = () => {
  const [sceneReady, setSceneReady] = useState(false);
  useEffect(() => {
    OBR.scene.isReady().then(setSceneReady);
    return OBR.scene.onReadyChange(setSceneReady);
  }, []);

  return sceneReady ? (
    <BrowserRouter>
      <SPA />
    </BrowserRouter>
  ) : (
    <SceneNotReady />
  );
};

export default App;
