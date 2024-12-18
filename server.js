const express = require("express");
const OAuth2Server = require("oauth2-server");
const bodyParser = require("body-parser");
const configs = require("./configs");
const oauthModel = require("./authModel");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const Request = OAuth2Server.Request;
const Response = OAuth2Server.Response;

const oauth = new OAuth2Server({
  model: oauthModel,
  grants: ["authorization_code", "refresh_token"],
  accessTokenLifetime: 60 * 60 * 24, // 24 hours, or 1 day
  allowEmptyState: true,
  allowExtendedTokenAttributes: true,
});

// Token endpoint
app.post("/oauth/token", async (req, res) => {
  const request = new Request(req);
  const response = new Response(res);

  try {
    const token = await oauth.token(request, response);
    res.json(token);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/oauth/exchange", async (req, res) => {
  const { token, role } = req.body;

  try {
    // Verify the original token
    const decoded = jwt.verify(token, configs.serverKey);
    console.log("Decoded token:", decoded);

    // Perform custom validation or checks (e.g., user role, scopes)
    if (!decoded.scope.includes("assume_role")) {
      return res.status(403).json({ error: "Token lacks assume_role scope" });
    }

    // Create a new token with the assumed role
    const newToken = jwt.sign(
      {
        user: decoded.user,
        assumedRole: role,
        scope: ["read", "write"], // Define new scopes
        issuedAt: Date.now(),
      },
      configs.serverKey,
      { expiresIn: "1h" }
    );

    res.json({ token: newToken });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Protected endpoint
app.get("/secure", async (req, res) => {
  const request = new Request(req);
  const response = new Response(res);

  try {
    const token = await oauth.authenticate(request, response);
    res.json({ message: "You have accessed a secure endpoint!", user: token });
  } catch (err) {
    res.status(401).json({ error: "Unauthorized" });
  }
});

app.listen(3000, () =>
  console.log("OAuth2 Server running on http://localhost:3000")
);
