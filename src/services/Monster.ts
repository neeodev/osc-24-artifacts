import { ArtifactsApi } from "artifacts-api-client";
import { components } from "artifacts-api-client/dist/api/types/api-schema.types.js";
import { artifactsApi } from "../config/api.ts";

export class Monster {
  protected api: ArtifactsApi = artifactsApi;

  protected monsters: components["schemas"]["MonsterSchema"][] = [];

  async getAllMonsters(): Promise<components["schemas"]["MonsterSchema"][]> {
    if (this.monsters.length) {
      return this.monsters;
    }

    const temp = await this.api.monsters.getAll();

    if (!temp.pages) {
      return [];
    }

    for (let i = 1; i <= temp.pages; i++) {
      const result = await this.api.monsters.getAll({ page: i });
      this.monsters = [...this.monsters, ...result.data];
    }

    return this.monsters;
  }

  getMonsterByCode(code: string): components["schemas"]["MonsterSchema"];
  getMonsterByCode(
    ...codes: string[]
  ): components["schemas"]["MonsterSchema"][];
  getMonsterByCode(code: unknown) {
    if (typeof code === "string") {
      return this.monsters.find((monster) => monster.code === code);
    } else if (Array.isArray(code)) {
      return this.monsters.filter((monster) => code.includes(monster.code));
    }
  }
}
