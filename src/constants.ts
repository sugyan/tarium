export const EVENT_MENU_RELOAD = "tauri-reload";

export const Theme = {
  Dark: "dark",
  Light: "light",
} as const;
export type Theme = (typeof Theme)[keyof typeof Theme];
