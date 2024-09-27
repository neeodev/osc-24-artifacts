import { ArtifactsApi } from "artifacts-api-client";

export const artifactsApi = ArtifactsApi.create({
  token: process.env.ARTIFACTS_TOKEN,
});
