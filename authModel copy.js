const jwt = require("jsonwebtoken");
const {serverKey} = require("./configs");

const users = [
  { id: 1, username: "marcelo", password: "password", roles: ["user"] },
  { id: 2, username: "system", password: "password", roles: ["system"] },
];

module.exports = {
  getClient(clientId, clientSecret) {
    return { id: "client1", grants: ["password", "refresh_token"] };
  },
  getUser(username, password) {
    return users.find(
      (u) => u.username === username && u.password === password
    );
  },
  saveToken(token, client, user) {
    // Create a signed JWT
    const accessToken = jwt.sign(
      {
        user: user.username,
        scope: ["read", "write", "assume_role"], // Example scope
      },
      serverKey,
      { expiresIn: "1h" }
    );
    return { accessToken, client, user };
  },
  getAccessToken(accessToken) {
    try {
      const decoded = jwt.verify(accessToken, serverKey);
      return { user: decoded.user, scope: decoded.scope };
    } catch (err) {
      return null;
    }
  },
  validateScope(token, scope) {
    return token.scope.includes(scope);
  },
};
