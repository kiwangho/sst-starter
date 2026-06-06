// =============================================================
// DO NOT MODIFY — managed by platform team
// Lambda function + URL for backend API
// =============================================================

import { userPool, userPoolClient } from "./auth";
import { table } from "./storage";

export const api = new sst.aws.Function("PocApi", {
  handler: "api/src/index.handler",
  url: {
    cors: {
      allowOrigins: ["*"],
      allowHeaders: ["Content-Type", "Authorization"],
      allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    },
  },
  link: [table],
  environment: {
    USER_POOL_ID: userPool.id,
    USER_POOL_CLIENT_ID: userPoolClient.id,
  },
  nodejs: {
    install: [
      "aws-jwt-verify",
      "@aws-sdk/client-dynamodb",
      "@aws-sdk/lib-dynamodb",
    ],
  },
});
