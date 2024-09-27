import { artifactsApi } from "./config/api.ts";
import { Attacker } from "./controllers/Attacker.ts";
import { Character } from "./controllers/Character.ts";

const envNames = process.env.CHARACTER_NAMES;
const characterNames = envNames ? envNames.split(",") : [];
const characters: Character[] = [];

for (const name of characterNames) {
  const c = await Character.getOrCreateCharacter(artifactsApi, name);

  const character = new Attacker(name, c);

  characters.push(character);
}

for (const character of characters) {
  await character.preRun();
  await character.run();
}
