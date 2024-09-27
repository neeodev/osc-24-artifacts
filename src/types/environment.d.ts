declare module "environment" {
  global {
    namespace NodeJS {
      interface ProcessEnv {
        NODE_ENV: "development" | "production";
        ARTIFACTS_TOKEN: string;
        CHARACTER_NAMES: string;
        ARTIFACTS_RUN: string;
      }
    }
  }
}
