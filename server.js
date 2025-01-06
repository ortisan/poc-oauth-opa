const express = require("express");
const bodyParser = require("body-parser");
const { oauthServer, Request, Response } = require("./oauthServer"); // Import your OAuth2 server instance
const checkScope = require("./scopeMiddleware");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Token endpoint
app.post("/oauth/token", async (req, res) => {
  const request = new Request(req);
  const response = new Response(res);
  try {
    const token = await oauthServer.token(request, response);
    res.json(token);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message, stack: err.stack });
  }
});

// Protected endpoint
app.get("/secure/profile", checkScope("read:profile"), (req, res) => {
  res.json({ message: "You have access to profile data!" });
});

app.post(
  "/secure/payments",
  checkScope("write:cashout:payments"),
  (req, res) => {
    
    res.status(201).json({ message: "payment sheduled", ...req.body });
  }
);

app.listen(3000, () =>
  console.log("OAuth2 Server running on http://localhost:3000")
);
