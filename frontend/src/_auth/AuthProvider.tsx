// =============================================================
// DO NOT MODIFY — managed by platform team
// Wraps the app with Cognito authentication via Amplify UI.
// Users must log in before seeing any app content.
// =============================================================

import { Amplify } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_USER_POOL_ID,
      userPoolClientId: import.meta.env.VITE_USER_POOL_CLIENT_ID,
      loginWith: { username: true },
    },
  },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <Authenticator>{() => <>{children}</>}</Authenticator>;
}
