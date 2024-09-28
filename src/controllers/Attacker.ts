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
    await this.map.getAllMaps();
    await this.items.getAllItems();
    await this.bank.getAllItems();
    await this.monster.getAllMonsters();
    await this.resource.getAllResources();
  }

  override async run() {
    const action = await this.pickAction();

    if(action){
      await action;
    }

    await this.run();
  }

  protected async pickAction(): Promise<any>{
    if (!this.character.task){
      return this.acceptTask()
    } else {
      return this.move("chicken");
    }
  }
}
