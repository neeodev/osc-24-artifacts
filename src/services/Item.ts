import { ArtifactsApi } from "artifacts-api-client";
import { artifactsApi } from "../config/api.ts";
import { components } from "artifacts-api-client/dist/api/types/api-schema.types.js";

export class Item {
  protected api: ArtifactsApi = artifactsApi;

  protected items: components["schemas"]["ItemSchema"][] = [];

  async getAllItems(): Promise<components["schemas"]["ItemSchema"][]> {
    if (this.items.length) {
      return this.items;
    }

    const temp = await this.api.items.getAll();

    if (!temp.pages) {
      return [];
    }

    for (let i = 1; i <= temp.pages; i++) {
      const result = await this.api.items.getAll({ page: i });
      this.items = [...this.items, ...result.data];
    }

    return this.items;
  }

  getItemByCode(code: string): components["schemas"]["ItemSchema"];
  getItemByCode(...codes: string[]): components["schemas"]["ItemSchema"][];
  getItemByCode(code: unknown) {
    if (typeof code === "string") {
      return this.items.find((item) => item.code === code);
    } else if (Array.isArray(code)) {
      return this.items.filter((item) => code.includes(item.code));
    }
  }
}
