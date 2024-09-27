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

  getMapByType(type: string): components["schemas"]["MapSchema"];
  getMapByType(...types: string[]): components["schemas"]["MapSchema"][];
  getMapByType(type: unknown) {
    if (typeof type === "string") {
      return this.maps.find((map) => map.content?.type === type);
    } else if (Array.isArray(type)) {
      return this.maps.filter((map) => type.includes(map.content?.type));
    }
  }

  getMapLocationByType(type: string): Location | null {
    const map = this.getMapByType(type);

    if (!map) {
      return null;
    }

    return {
      x: map.x,
      y: map.y,
    };
  }
}
