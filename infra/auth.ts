// =============================================================
// DO NOT MODIFY — managed by platform team
// Cognito User Pool for authentication
// =============================================================

export const userPool = new sst.aws.CognitoUserPool("PocUserPool", {
  // No usernames config = Cognito default: login with the username set by admin-create-user.
  // SST only accepts "email" or "phone" here — neither is needed for username/password auth.
});

// Web app client — no OAuth redirect, uses direct SRP auth via Amplify
export const userPoolClient = userPool.addClient("PocWebClient");
