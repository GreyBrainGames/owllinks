import React, { useEffect } from "react";
import { Link, Navigate, Route, Routes } from "react-router-dom";

import OBR, { Item, Player, isImage } from "@owlbear-rodeo/sdk";
import { setupContextMenu } from "../contextMenu";
import Help from "./Help";
import Navbar from "./Navbar";
import { paths } from "./util/constants";
import Sheets from "./Sheets";
import { ID } from "../main";

export interface Sheet {
  uuid: string;
  url: URL;
}

export default function SPA() {
  const [role, setRole] = React.useState<"GM" | "PLAYER">("GM");

  const [sheets, setSheets] = React.useState<Sheet[]>([]);

  const setTheme = (theme: string): void => {
    document.getElementById("html_root")?.setAttribute("data-bs-theme", theme);
  };

  const handlePlayerChange = (player: Player) => {
    setRole(player.role);
  };

  const loadSheets = (items: Item[]) => {
    const newSheets: Sheet[] = items.map((item) => {
      return {
        uuid: item.id,
        url: new URL((item.metadata[`${ID}/metadata`] as {characterSheetURL: string}).characterSheetURL),
      };
    });
    setSheets(newSheets);
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

      OBR.scene.items
        .getItems((item) => {
          return (
            item.layer === "CHARACTER" &&
            item.metadata[`${ID}/metadata`] != undefined && isImage(item)
          );
        })
        .then((items) => loadSheets(items));
      OBR.scene.items.onChange((items) => {
        loadSheets(
          items.filter(
            (item) =>
              item.layer === "CHARACTER" &&
              item.metadata[`${ID}/metadata`] != undefined && isImage(item)
          )
        );
      });

      OBR.player.onChange(handlePlayerChange);
      OBR.player.getRole().then(setRole);
    });
  }, []);

  return role === "GM" ? (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Sheets sheets={sheets} />} />
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
