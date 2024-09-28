import { ArtifactsApi } from "artifacts-api-client";
import { components } from "artifacts-api-client/dist/api/types/api-schema.types.js";
import { artifactsApi } from "../config/api.ts";
import { skins } from "../config/constant.ts";
import { Sleep } from "../decorators/Sleep.ts";
import { Bank } from "../services/Bank.ts";
import { Item } from "../services/Item.ts";
import { Map } from "../services/Map.ts";
import { Monster } from "../services/Monster.ts";
import { Resource } from "../services/Resource.ts";
import { Location } from "../config/types.ts";

export class Character {
  protected name: string;
  protected api: ArtifactsApi = artifactsApi;
  protected cooldown: number = 0;
  protected map: Map = new Map();
  protected bank: Bank = new Bank();
  protected monster: Monster = new Monster();
  protected resource: Resource = new Resource();
  protected items: Item = new Item();

  protected character: components["schemas"]["CharacterSchema"];

  protected canFight (code: string): boolean{
    const monster = this.monster.getMonsterByCode(code);

    const characterHp = this.character.hp;
    const monsterHp = monster.hp;

    let turn = 0;

    while (characterHp > 0 && monsterHp > 0 && turn < 100){
      
    }

    return characterHp > 0 && monsterHp < 0 && turn < 100
  }

  protected constructor(
    name: string,
    character: components["schemas"]["CharacterSchema"]
  ) {
    this.name = name;
    this.character = character;
  }

  private async Cooldown<
    T extends { data: U },
    U extends { cooldown?: V },
    V extends components["schemas"]["CooldownSchema"]
  >(action: () => Promise<T>): Promise<T> {
    if (this.cooldown > 0) {
      await Sleep(this.cooldown);
    }

    const result = await action();

    if (result.data.cooldown) {
      this.cooldown =
        new Date(result.data.cooldown.expiration).getTime() - Date.now();
    } else {
      this.cooldown = 0;
    }

    await this.updateCharacter();

    return result;
  }

  public async preRun() {
    await this.updateCharacter();
  }

  public async run() {
    console.log(`Running ${this.name}`);
  }

  protected async move(destination: string){

    const location = this.map.getMapLocationByCode(destination);

    if(!location){
      console.error("Destionation not found !");
      return;
    }

    if (this.character.x === location.x && this.character.y === location.y){
      console.log("Character already at destination");
      return;
    }

    await this.Cooldown(async () => await this.api.myCharacters.move(this.name, location));
    console.log(`Moved at destination ${destination} for ${this.name}`)
  }

  protected async acceptTask(){
    if(this.character.task){
      console.log(`${this.name} already as a task`);
      return;
    }

    await this.move("monsters");

    await this.Cooldown(async () => await this.api.myCharacters.acceptTask(this.name));
  }

  protected async completeTask(){
    if (!this.character.task){
      console.log(`${this.name} does not have a task`);
      await this.acceptTask();
    }

    if(this.character.task_progress < this.character.task_total){
      await this.doTask();
    } else {
      await this.move("monsters");
      await this.Cooldown(async () => await this.api.myCharacters.completeTask(this.name));
      console.log(`Task ${this.character.task} is done for ${this.name}`);
    }
  }

  protected async doTask(){
    // Logic
  }

  private async updateCharacter() {
    const character = await this.api.characters.get(this.name);
    this.character = character.data;
  }

  public static async getOrCreateCharacter(
    api: ArtifactsApi,
    name: string
  ): Promise<components["schemas"]["CharacterSchema"]> {
    try {
      const character = await api.characters.get(name);
      return character.data;
    } catch {
      console.log(`Character not found, creating a new one named ${name}.`);
      const resp = await api.characters.create({
        name: name,
        skin: skins[Math.floor(Math.random() * skins.length)],
      });

      return resp.data;
    }
  }

  public static async resetCharacter(
    api: ArtifactsApi,
    name: string
  ): Promise<void> {
    try {
      await api.characters.delete({
        name,
      });
      console.log(`Character ${name} has been reset.`);
    } catch {
      console.log(`Character not found.`);
    }
  }
}
