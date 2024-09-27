import { components } from "artifacts-api-client/dist/api/types/api-schema.types.js";
import { Character } from "./Character.ts";

export class Attacker extends Character {
  constructor(
    name: string,
    character: components["schemas"]["CharacterSchema"]
  ) {
    super(name, character);
  }

  override async preRun() {
    console.log(`Pre-running attacker : ${this.name}`);
  }

  override async run() {
    console.log(`Running attacker : ${this.name}`);
  }
}
