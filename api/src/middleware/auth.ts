// =============================================================
// DO NOT MODIFY — managed by platform team
// Validates Cognito JWT on every /api/* request.
// The verified user payload is available via c.get("user").
// =============================================================

import type { Context, Next } from "hono";
import { CognitoJwtVerifier } from "aws-jwt-verify";

declare module "hono" {
  interface ContextVariableMap {
    user: { username: string; sub: string };
  }
}

const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.USER_POOL_ID!,
  clientId: process.env.USER_POOL_CLIENT_ID!,
  tokenUse: "access",
});

export async function authMiddleware(c: Context, next: Next) {
  const authHeader = c.req.header("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  try {
    const payload = await verifier.verify(authHeader.slice(7));
    c.set("user", {
      username: (payload as Record<string, string>)["username"] ?? payload.sub,
      sub: payload.sub,
    });
    await next();
  } catch {
    return c.json({ error: "Invalid or expired token" }, 401);
  }
}
