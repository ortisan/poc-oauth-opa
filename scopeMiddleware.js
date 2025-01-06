const { oauthServer, Request, Response } = require("./oauthServer"); // Import your OAuth2 server instance

/**
 * Middleware to check if the token has a required scope
 * @param {string} requiredScope
 */
const checkScope = (requiredScope) => async (req, res, next) => {
  const request = new Request(req);
  const response = new Response(res);

  try {
    // Authenticate token and extract its details
    const token = await oauthServer.authenticate(request, response);

    // Verify the token's scopes
    if (!oauthServer.options.model.verifyScope(token, requiredScope)) {
      return res.status(403).json({ error: "Insufficient scope" });
    }

    const policies = await checkPolicy("payments", token);

    console.log(policies);

    // Token and scope are valid
    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized or invalid token" });
  }
};

const opaClient = require("./opaClient");

async function checkPolicy(policyPath, input) {
    const response = await opaClient.post(`/data/${policyPath}`, { input });
    return response;
}

module.exports = checkScope;
