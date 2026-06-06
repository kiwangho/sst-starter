// =============================================================
// DO NOT MODIFY — managed by platform team
// S3 + CloudFront static site for frontend
// =============================================================

import { userPool, userPoolClient } from "./auth";
import { api } from "./api";

export const frontend = new sst.aws.StaticSite("PocFrontend", {
  path: "frontend",
  build: {
    command: "npm run build",
    output: "dist",
  },
  environment: {
    VITE_USER_POOL_ID: userPool.id,
    VITE_USER_POOL_CLIENT_ID: userPoolClient.id,
    VITE_API_URL: api.url.apply((url) => url.replace(/\/$/, "")),
    VITE_AWS_REGION: aws.getRegionOutput().name,
  },
});
