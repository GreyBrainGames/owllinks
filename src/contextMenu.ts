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
    id: `${ID}/context-menu-view`,
    icons: [
      {
        icon: "/img/view.svg",
        label: "View Sheet",
        filter: {
          roles: ["GM"],
          every: [
            { key: "layer", value: "CHARACTER" },
            { key: ["metadata", `${ID}/metadata`], value: undefined, operator: "!="},
          ],
        },
      },
    ],
    onClick(context, elementId) {
      const metadata: { characterSheetURL: string } = context.items[0].metadata[
        `${ID}/metadata`
      ] as { characterSheetURL: string };
      OBR.popover.open({
        id: `${ID}/popover`,
        url: `${metadata.characterSheetURL}`,
        height: 600,
        width: 400,
        anchorElementId: elementId,
      });
    },
  });
}
