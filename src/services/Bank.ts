import { ArtifactsApi } from "artifacts-api-client";
import { artifactsApi } from "../config/api.ts";
import { components } from "artifacts-api-client/dist/api/types/api-schema.types.js";
import { Item } from "./Item.ts";

export class Bank {
  protected api: ArtifactsApi = artifactsApi;

  async getAllItems(): Promise<components["schemas"]["ItemSchema"][]> {
    const bankItems = (await this.api.myAccount.getBankItems()).data;

    const items = await new Item().getItemByCode(
      bankItems.map((item) => item.code)
    );

    return items;
  }

  async hasItem(code: string): Promise<boolean>;
  async hasItem(codes: string[]): Promise<boolean[]>;
  async hasItem(code: unknown) {
    const items = await this.getAllItems();

    if (typeof code === "string") {
      return items.some((item) => item.code === code);
    } else if (Array.isArray(code)) {
      return code.map((c) => items.some((item) => item.code === c));
    }
  }
}
