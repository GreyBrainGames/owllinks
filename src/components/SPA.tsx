import React, { useEffect } from "react";
import { Link, Navigate, Route, Routes } from "react-router-dom";

import OBR, { Player } from "@owlbear-rodeo/sdk";
import { setupContextMenu } from "../contextMenu";
import Help from "./Help";
import Navbar from "./Navbar";
import { paths } from "./util/constants";

export default function SPA() {
  const [role, setRole] = React.useState<"GM" | "PLAYER">("GM");

  const setTheme = (theme: string): void => {
    document.getElementById("html_root")?.setAttribute("data-bs-theme", theme);
  };

  const handlePlayerChange = (player: Player) => {
    setRole(player.role);
  };

  useEffect(() => {
    OBR.onReady(() => {
      setupContextMenu();
      OBR.theme.getTheme().then((theme) => {
        setTheme(theme.mode.toLowerCase());
      });
      OBR.theme.onChange((theme) => {
        setTheme(theme.mode.toLowerCase());
      });
      OBR.player.onChange(handlePlayerChange);
      OBR.player.getRole().then(setRole);
    });
  }, []);

  return role === "GM" ? (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route
          index
          element={
            <div className="p-3"></div>}
        />
        <Route path={paths.help} element={<Help />} />
        <Route path="*" element={<NoMatch />} />
      </Route>
    </Routes>
  ) : (
    <Routes>
      <Route path="/" element={<Navigate to={paths.playerView} />} />
    </Routes>
  );
}

function Layout() {
  return <Navbar />;
}

function NoMatch() {
  return (
    <div className="p-3">
      <h2>Nothing to see here!</h2>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  );
}
