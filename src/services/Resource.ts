import { ArtifactsApi } from "artifacts-api-client";
import { components } from "artifacts-api-client/dist/api/types/api-schema.types.js";
import { artifactsApi } from "../config/api.ts";

export class Resource {
  protected api: ArtifactsApi = artifactsApi;

  protected resources: components["schemas"]["ResourceSchema"][] = [];

  async getAllResources(): Promise<components["schemas"]["ResourceSchema"][]> {
    if (this.resources.length) {
      return this.resources;
    }

    const temp = await this.api.resources.getAll();

    if (!temp.pages) {
      return [];
    }

    for (let i = 1; i <= temp.pages; i++) {
      const result = await this.api.resources.getAll({ page: i });
      this.resources = [...this.resources, ...result.data];
    }

    return this.resources;
  }

  getResourceByCode(code: string): components["schemas"]["ResourceSchema"];
  getResourceByCode(
    codes: string[]
  ): components["schemas"]["ResourceSchema"][];
  getResourceByCode(code: unknown) {
    if (typeof code === "string") {
      return this.resources.find((resource) => resource.code === code);
    } else if (Array.isArray(code)) {
      return this.resources.filter((resource) => code.includes(resource.code));
    }
  }
}
