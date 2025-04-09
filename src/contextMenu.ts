import OBR from "@owlbear-rodeo/sdk";
import { ID } from "./main";


export function setupContextMenu() {
  OBR.contextMenu.create({
    id: `${ID}/context-menu-add-remove`,
    icons: [
      {
        icon: "/img/add-link.svg",
        label: "Add Link",
        filter: {
          roles: ["GM"],
          every: [
            { key: "layer", value: "CHARACTER", coordinator: "||" },
            { key: "layer", value: "PROP", coordinator: "||" },
            { key: "layer", value: "NOTE" },
            { key: ["metadata", `${ID}/metadata`], value: undefined },
          ],
        },
      },
      {
        icon: "/img/remove-link.svg",
        label: "Remove Link",
        filter: {
          roles: ["GM"],
          every: [
            { key: "layer", value: "CHARACTER", coordinator: "||" },
            { key: "layer", value: "PROP", coordinator: "||" },
            { key: "layer", value: "NOTE" },
          ],
        },
      },
    ],
    onClick(context) {
      const add = context.items.every(
        (item) => item.metadata[`${ID}/metadata`] === undefined
      );
      if (add) {
        const owlLinkURL = window.prompt(
          "Enter the character's sheet URL:"
        );
        if (!owlLinkURL) {
          return;
        }

        try {
          new URL(owlLinkURL);
          OBR.scene.items.updateItems(context.items, (items) => {
            for (const item of items) {
              item.metadata[`${ID}/metadata`] = {
                owlLinkURL: owlLinkURL,
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
        icon: "/img/open-link.svg",
        label: `Open Link`,
        filter: {
          roles: ["GM", "PLAYER"],
          every: [
            { key: "layer", value: "CHARACTER", coordinator: "||" },
            { key: "layer", value: "PROP", coordinator: "||" },
            { key: "layer", value: "NOTE" },
            {
              key: ["metadata", `${ID}/metadata`],
              value: undefined,
              operator: "!=",
            },
          ],
        },
      },
    ],
    onClick(context, elementId) {
      const metadata: { owlLinkURL: string } = context.items[0].metadata[
        `${ID}/metadata`
      ] as { owlLinkURL: string };
      if (localStorage.getItem(`${ID}/popoverMode`) === "true") {
        OBR.popover.open({
          id: `${ID}/popover`,
          url: `${metadata.owlLinkURL}`,
          height: localStorage.getItem(`${ID}/popoverHeight`) as unknown as number,
          width: localStorage.getItem(`${ID}/popoverWidth`) as unknown as number,
          anchorElementId: elementId,
        });
      } else {
        const screenWidth =
          window.innerWidth ||
          document.documentElement.clientWidth ||
          document.body.clientWidth;
        const screenHeight =
          window.innerHeight ||
          document.documentElement.clientHeight ||
          document.body.clientHeight;
        const windowWidth = 400;
        const windowHeight = 800;
        const left = Math.max(0, (screenWidth - windowWidth) / 2);
        const top = Math.max(0, (screenHeight - windowHeight) / 2);
        window.open(
          metadata.owlLinkURL,
          "_blank",
          `left=${left},top=${top},width=${windowWidth},height=${windowHeight}`
        );
      }
    },
  });
}
