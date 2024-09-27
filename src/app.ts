const run = process.env.ARTIFACTS_RUN === "true";

if (run) {
  import("./run.ts");
} else {
  import("./delete.ts");
}
