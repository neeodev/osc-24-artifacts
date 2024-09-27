import { artifactsApi } from "./config/api.ts";
import { Character } from "./controllers/Character.ts";

const envNames = process.env.CHARACTER_NAMES;
const characterNames = envNames ? envNames.split(",") : [];

for (const name of characterNames) {
  await Character.resetCharacter(artifactsApi, name);
}
