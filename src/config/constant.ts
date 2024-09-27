export const skins = [
  "men1",
  "men2",
  "men3",
  "women1",
  "women2",
  "women3",
] as const;

export type Skin = (typeof skins)[number];
