import OBR from "@owlbear-rodeo/sdk";
import { ID } from "./main";

export function setupContextMenu() {
  OBR.contextMenu.create({
    id: `${ID}/context-menu-add-remove`,
    icons: [
      {
        icon: "/img/add.svg",
        label: "Add Sheet from Beyond",
        filter: {
          every: [
            { key: "layer", value: "CHARACTER" },
            { key: ["metadata", `${ID}/metadata`], value: undefined },
          ],
        },
      },
      {
        icon: "/img/remove.svg",
        label: "Remove Location Key",
        filter: {
          every: [{ key: "layer", value: "CHARACTER" }],
        },
      },
    ],
    onClick(context) {
      const add = context.items.every(
        (item) => item.metadata[`${ID}/metadata`] === undefined
      );
      if (add) {
        const characterSheetURL = window.prompt("Enter the character's sheet URL:");
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
          console.error("Invalid URL:", characterSheetURL);
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
  // OBR.contextMenu.create({
  //   id: `${ID}/context-menu-expand`,
  //   icons: [
  //     {
  //       icon: "/img/expand.svg",
  //       label: "Reveal Location Key",
  //       filter: {
  //         every: [{ key: "layer", value: "TEXT" }],
  //       },
  //     },
  //   ],
  //   onClick(context) {
  //     track("reveal_location_key");
  //     analytics.track("reveal_location_key");
  //     OBR.broadcast.sendMessage(`${ID}/broadcast`, `${context.items[0].id}`, {
  //       destination: "LOCAL",
  //     });
  //   },
  // });
}
