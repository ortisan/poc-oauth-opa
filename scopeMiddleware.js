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

    // Token and scope are valid
    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized or invalid token" });
  }
};

const checkScopeOpa = () => async (req, res, next) => {
  const request = new Request(req);
  const response = new Response(res);

  try {
    // Authenticate token and extract its details
    const token = getAccessToken(request);

    const policyResult = await checkPolicy("payments_jwt_decode", { token });

    req.auth = {
      ...policyResult,
    };

    // Token and scope are valid
    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized or invalid token" });
  }
};

const opaClient = require("./opaClient");

async function checkPolicy(policyPath, input) {
  const response = await opaClient.post(`/data/${policyPath}`, { input });
  return response.data.result;
}

function getAccessToken(request) {
  var token = request.get("Authorization");
  var matches = token.match(/Bearer\s(\S+)/);

  if (!matches) {
    throw new InvalidRequestError(
      "Invalid request: malformed authorization header"
    );
  }

  return matches[1];
}

module.exports = {
  checkScope,
  checkScopeOpa,
};
