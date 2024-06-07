import OBR from "@owlbear-rodeo/sdk";
import { ID } from "./main";

export function setupContextMenu() {
  OBR.contextMenu.create({
    id: `${ID}/context-menu-add-remove`,
    icons: [
      {
        icon: "/img/add.svg",
        label: "Add Sheet",
        filter: {
          roles: ["GM"],
          every: [
            { key: "layer", value: "CHARACTER" },
            { key: ["metadata", `${ID}/metadata`], value: undefined },
          ],
        },
      },
      {
        icon: "/img/remove.svg",
        label: "Remove Sheet",
        filter: {
          roles: ["GM"],
          every: [{ key: "layer", value: "CHARACTER" }],
        },
      },
    ],
    onClick(context) {
      const add = context.items.every(
        (item) => item.metadata[`${ID}/metadata`] === undefined
      );
      if (add) {
        const characterSheetURL = window.prompt(
          "Enter the character's sheet URL:"
        );
        if (!characterSheetURL) {
          OBR.notification.show("No URL entered", "ERROR");
          return;
        }

        try {
          new URL(characterSheetURL);
          OBR.scene.items.updateItems(context.items, (items) => {
            for (const item of items) {
              item.metadata[`${ID}/metadata`] = {
                characterSheetURL: characterSheetURL,
              };
            }
          });
        } catch (error) {
          OBR.notification.show("Invalid URL", "ERROR");
          return;
        }
      } else {
        OBR.scene.items.updateItems(context.items, (items) => {
          for (const item of items) {
            delete item.metadata[`${ID}/metadata`];
          }
        });
      }
    },
  });
  OBR.contextMenu.create({
    id: `${ID}/context-menu-view-new-tab`,
    icons: [
      {
        icon: "/img/view.svg",
        label: "View in new tab",
        filter: {
          roles: ["GM", "PLAYER"],
          every: [
            { key: "layer", value: "CHARACTER" },
            {
              key: ["metadata", `${ID}/metadata`],
              value: undefined,
              operator: "!=",
            },
          ],
        },
      },
    ],
    onClick(context) {
      const metadata: { characterSheetURL: string } = context.items[0].metadata[
        `${ID}/metadata`
      ] as { characterSheetURL: string };
      const screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
      const screenHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
      const windowWidth = 400;
      const windowHeight = 800;
      const left = Math.max(0, (screenWidth - windowWidth) / 2);
      const top = Math.max(0, (screenHeight - windowHeight) / 2);
      window.open(
        metadata.characterSheetURL,
        "_blank",
        `left=${left},top=${top},width=${windowWidth},height=${windowHeight}`
      );
    },
  });
}
