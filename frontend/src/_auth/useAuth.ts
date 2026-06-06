// =============================================================
// DO NOT MODIFY — managed by platform team
// Hook for accessing the current user and auth utilities.
// Import this in your components: import { useAuth } from "./_auth/useAuth"
// =============================================================

import { useAuthenticator } from "@aws-amplify/ui-react";
import { fetchAuthSession } from "aws-amplify/auth";

export function useAuth() {
  const { user, signOut } = useAuthenticator((ctx) => [ctx.user]);

  return {
    user: {
      username: user?.signInDetails?.loginId ?? user?.username ?? "",
    },
    signOut,
    /** Returns the Cognito access token for API calls:
     *  Authorization: `Bearer ${await getAccessToken()}`  */
    getAccessToken: async (): Promise<string> => {
      const session = await fetchAuthSession();
      return session.tokens?.accessToken?.toString() ?? "";
    },
  };
}
