import OBR from "@owlbear-rodeo/sdk";
import React, { useEffect, useState } from "react";

import SceneNotReady from "./SceneNotReady";
import { Badge, Card, Container, Form } from "react-bootstrap";
import { setupContextMenu } from "../contextMenu";
import { ID } from "../main";
import { useLocalStorage } from "@uidotdev/usehooks";

const setTheme = (theme: string): void => {
  document.getElementById("html_root")?.setAttribute("data-bs-theme", theme);
};

const App: React.FC = () => {
  const [sceneReady, setSceneReady] = useState(false);
  const [isPopoverMode, setIsPopoverMode] = useLocalStorage(
    `${ID}/popoverMode`,
    false
  );

  const [version, setVersion] = useState("unknown")
  useEffect(() => {
    fetch("public/manifest.json")
      .then(b => b.json())
      .then(j => j.version)
      .then(setVersion)
  }, [])

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
      <Card className="mb-3 text-justify">
        <Card.Body>
          <Card.Title>Display Mode</Card.Title>
          <Card.Text>
            <Form.Check
              type="radio"
              id="popupMode"
              name="displayMode"
              value="popup"
              checked={!isPopoverMode}
              onChange={() => handleOnChange(false)}
              label="Popup Window Mode"
              inline
            />
            <Form.Check
              type="radio"
              id="popoverMode"
              name="displayMode"
              value="popover"
              checked={isPopoverMode}
              onChange={() => handleOnChange(true)}
              label="Popover Mode"
              inline
            />
          </Card.Text>
        </Card.Body>
      </Card>
      <Card className="mb-3">
        {/* <Card.Img variant="top" src="../assets/setting-popup-window.png" /> */}
        <Card.Body>
          <Card.Title>Popup Window Mode <Badge bg="secondary">Recommended</Badge></Card.Title>
          <Card.Text>
            In this mode the character sheet will be displayed in a new browser
            window. Even though this is less user-friendly, the new window will
            have access to the current browser session, which means that you
            won't need to login every time, and also won't have issues with
            sites blocking the page from being loaded.
          </Card.Text>
        </Card.Body>
      </Card>
      <Card className="mb-3">
        {/* <Card.Img variant="top" src="../assets/setting-popover.png" /> */}
        <Card.Body>
          <Card.Title>Popover Mode</Card.Title>
          <Card.Text>
            In this mode the character sheet will be displayed inside Owlbear
            Rodeo's scene. Even though the usability is better, it has the
            following limitations:
            <br />
            <br />
            - It won't have access to the current browser session. Therefore, you
            will need to accept cookies, login, etc, every time the sheet is
            displayed
            <br />
            <br />
            - Some sites will block the page from being loaded, such as Google
            Drive and Dropbox
            <br />
          </Card.Text>
        </Card.Body>
      </Card>
      <em className="text-secondary mb-3">Version: {version}</em>
    </Container>
  ) : (
    <SceneNotReady />
  );
};

export default App;
