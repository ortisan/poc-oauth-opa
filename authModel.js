const jwt = require("jsonwebtoken");
const configs = require("./configs");

const clients = [
  {
    clientId: "marcelo",
    clientSecret: "password",
    grants: ["authorization_code"],
    scope: "read write",
  },
  {
    clientId: "system",
    clientSecret: "password",
    grants: ["authorization_code"],
    scope: "read write",
  },
];

const tokens = {};

module.exports = {
  /**
   * Retrieve a client by clientId and clientSecret.
   */
  getClient(clientId, clientSecret) {
    return clients.find(
      (client) =>
        client.clientId === clientId && client.clientSecret === clientSecret
    );
  },

  /**
   * Validate the redirect URI.
   */
  validateRedirectUri(client, redirectUri) {
    return client.redirectUris.includes(redirectUri);
  },

  /**
   * Generate an authorization code.
   */
  saveAuthorizationCode(code, client, user) {
    const authCode = {
      code: crypto.randomBytes(20).toString("hex"), // Unique authorization code
      clientId: client.clientId,
      userId: user.id,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // Expires in 5 minutes
      redirectUri: code.redirectUri,
      scope: code.scope,
    };

    authorizationCodes[authCode.code] = authCode;
    return authCode;
  },

  /**
   * Retrieve an authorization code.
   */
  getAuthorizationCode(code) {
    return authorizationCodes[code];
  },

  /**
   * Revoke an authorization code after it's used.
   */
  revokeAuthorizationCode(code) {
    delete authorizationCodes[code.code];
    return true;
  },

  /**
   * Issue an access token.
   */
  saveToken(token, client, user) {
    const jwtToken = jwt.sign(
      {
        userId: user.id,
        clientId: client.clientId,
        scope: token.scope,
      },
      configs.serverKey,
      { expiresIn: "1h" } // Token expiration
    );

    tokens[jwtToken] = { client, user, scope: token.scope };

    return {
      accessToken: jwtToken,
      accessTokenExpiresAt: new Date(Date.now() + 3600 * 1000), // 1 hour
      client,
      user,
    };
  },

  /**
   * Retrieve an access token for validation.
   */
  getAccessToken(accessToken) {
    try {
      const decoded = jwt.verify(accessToken, configs.serverKey);
      return {
        accessToken,
        client: clients.find((c) => c.clientId === decoded.clientId),
        user: users.find((u) => u.id === decoded.userId),
        scope: decoded.scope,
      };
    } catch (err) {
      return null; // Token invalid or expired
    }
  },

  /**
   * Validate the requested scope.
   */
  validateScope(user, client, scope) {
    return scope; // For demo, we accept all requested scopes
  },

  /**
   * Verify that the token's scope allows the requested action.
   */
  verifyScope(token, scope) {
    const allowedScopes = token.scope ? token.scope.split(" ") : [];
    const requestedScopes = scope.split(" ");
    return requestedScopes.every((s) => allowedScopes.includes(s));
  },
};
