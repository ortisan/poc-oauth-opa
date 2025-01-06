const OAuth2Server = require("oauth2-server");
const oauthModel = require("./authModel");

const Request = OAuth2Server.Request;
const Response = OAuth2Server.Response;

const oauthServer = new OAuth2Server({
  model: oauthModel,
  grants: ["authorization_code", "refresh_token"],
  accessTokenLifetime: 60 * 60 * 24, // 24 hours, or 1 day
  allowEmptyState: true,
  allowExtendedTokenAttributes: true,
});

module.exports = {
  oauthServer: oauthServer,
  Request,
  Response,
};
