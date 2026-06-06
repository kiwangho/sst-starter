/// <reference path="./.sst/platform/config.d.ts" />

// =============================================================
// DO NOT MODIFY — managed by platform team
// Infrastructure entry point. Stages are isolated environments.
//   Deploy:   npx sst deploy --stage <your-name> --profile awskiwangho
//   Teardown: npx sst remove --stage <your-name> --profile awskiwangho
// =============================================================

export default $config({
  app(input) {
    return {
      name: "vibe-poc",
      // Always remove all resources on `sst remove`
      removal: "remove",
      home: "aws",
    };
  },
  async run() {
    // Resources are created in dependency order:
    // auth + storage → api (links the table) → frontend (needs auth + api IDs)
    const { userPool } = await import("./infra/auth");
    await import("./infra/storage");
    await import("./infra/api");
    const { frontend } = await import("./infra/frontend");

    return {
      // CloudFront URL printed after deploy
      url: frontend.url,
      // User Pool ID
      userPoolId: userPool.id,
    };
  },
});
