const jwt = require("jsonwebtoken");
const { serverKey } = require("./configs");

const users = [{ id: 1, username: "marcelo", password: "password" }];

const clients = [
  {
    clientId: "marcelo",
    clientSecret: "secret",
    grants: ["password", "authorization_code"],
    scope:
      "read:profile write:profile write:cashout:payments read:cashout:payments auto-approve:cashout:payments",
  },
  {
    clientId: "system",
    clientSecret: "secret",
    grants: ["password", "authorization_code"],
    scope: "read:cashout:payments",
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

  getUser(username, password) {
    const user = users.find(
      (u) => u.username === username && u.password === password
    );
    return user ? user : null; // Return user if found, otherwise null
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
      serverKey,
      { expiresIn: "1h" } // Token expiration
    );

    const accessTokenExpiresAt = new Date(Date.now() + 3600 * 1000);

    tokens[jwtToken] = {
      client,
      user,
      scope: token.scope,
      accessTokenExpiresAt,
    };

    return {
      accessToken: jwtToken,
      accessTokenExpiresAt, // 1 hour
      client,
      user,
    };
  },

  /**
   * Retrieve an access token for validation.
   */
  getAccessToken(accessToken) {
    try {
      const decoded = jwt.verify(accessToken, serverKey);
      return {
        accessToken,
        client: clients.find((c) => c.clientId === decoded.clientId),
        user: users.find((u) => u.id === decoded.userId),
        scope: decoded.scope,
        accessTokenExpiresAt: new Date(decoded.exp * 1000),
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
