import { ArtifactsApi } from "artifacts-api-client";
import { components } from "artifacts-api-client/dist/api/types/api-schema.types.js";
import { artifactsApi } from "../config/api.ts";
import type { Location } from "../config/types.ts";

export class Map {
  protected api: ArtifactsApi = artifactsApi;

  protected maps: components["schemas"]["MapSchema"][] = [];

  async getAllMaps(): Promise<components["schemas"]["MapSchema"][]> {
    if (this.maps.length) {
      return this.maps;
    }

    const temp = await this.api.maps.getAll();

    if (!temp.pages) {
      return [];
    }

    for (let i = 1; i <= temp.pages; i++) {
      const result = await this.api.maps.getAll({ page: i });
      this.maps = [...this.maps, ...result.data];
    }

    return this.maps;
  }

  getMapByCode(code: string): components["schemas"]["MapSchema"];
  getMapByCode(codes: string[]): components["schemas"]["MapSchema"][];
  getMapByCode(code: unknown) {
    if (typeof code === "string") {
      return this.maps.find((map) => map.content?.code === code);
    } else if (Array.isArray(code)) {
      return this.maps.filter((map) => code.includes(map.content?.code));
    }
  }

  getMapLocationByCode(code: string): Location | null {
    const map = this.getMapByCode(code);

    if (!map) {
      return null;
    }

    return {
      x: map.x,
      y: map.y,
    };
  }
}
