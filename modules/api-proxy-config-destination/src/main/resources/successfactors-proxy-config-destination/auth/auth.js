var destinations = require("core/v4/destinations");
var oauth = require("successfactors-proxy/proxy/auth/oauth");

exports.getAuthorizationHeader = function(userId) {
    let destination = destinations.get("SFSF");

    let idpUrl = destination.URL + "/oauth/idp";
    let tokenUrl = destination.tokenServiceURL;
    let clientId = destination.audience;
    let companyId = destination.companyId;
    let privateKey = destination.clientKey;

    let token = oauth.getToken(idpUrl, tokenUrl, clientId, companyId, userId, privateKey);
    return oauth.getAuthorizationHeader(token);
}