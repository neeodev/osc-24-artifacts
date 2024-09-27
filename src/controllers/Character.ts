import { ArtifactsApi } from "artifacts-api-client";
import { artifactsApi } from "../config/api.ts";
import { Bank } from "../services/Bank.ts";
import { Item } from "../services/Item.ts";
import { Map } from "../services/Map.ts";
import { Resource } from "../services/Resource.ts";
import { Monster } from "../services/Monster.ts";
import { components } from "artifacts-api-client/dist/api/types/api-schema.types.js";
import { skins } from "../config/constant.ts";
import { Sleep } from "../decorators/Sleep.ts";

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
