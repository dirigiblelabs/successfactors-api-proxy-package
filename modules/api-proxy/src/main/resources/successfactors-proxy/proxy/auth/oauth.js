let httpClient = require("http/v4/client");
let config = require("core/v4/configurations");
let tokenCache = new TokenCache();

exports.getToken = function(idpUrl, tokenUrl, clientId, companyId, userId, privateKey) {
    let token = tokenCache.getToken(clientId, userId);
    if (!token) {
        let assertion = getSAMLAssertion(idpUrl, tokenUrl, clientId, userId, privateKey);
        token = getAccessToken(tokenUrl, clientId, companyId, userId, assertion);
        tokenCache.setToken(clientId, userId, token);
    }
    return token;
};

exports.getAuthorizationHeader = function(token) {
    return token.token_type + " " + token.access_token;
};

function getSAMLAssertion(idpUrl, tokenUrl, clientId, userId, privateKey) {
     let assertionResponse = httpClient.post(idpUrl, {
        params: [{
            name: "token_url",
            value: tokenUrl
        }, {
            name: "client_id",
            value: clientId
        }, {
            name: "user_id",
            value: userId
        }, {
            name: "private_key",
            value: privateKey
        }],
        headers: [{
            name: "Content-Type",
            value: "application/x-www-form-urlencoded"
        }]
    });
    return assertionResponse.text;
}

function getAccessToken(tokenUrl, clientId, companyId, userId, assertion) {
    let tokenResponse = httpClient.post(tokenUrl, {
        params: [{
            name: "grant_type",
            value: "urn:ietf:params:oauth:grant-type:saml2-bearer"
        }, {
            name: "client_id",
            value: clientId
        }, {
            name: "company_id",
            value: companyId
        }, {
            name: "user_id",
            value: userId
        }, {
            name: "assertion",
            value: assertion
        }],
        headers: [{
            name: "Content-Type",
            value: "application/x-www-form-urlencoded"
        }]
    });
    return JSON.parse(tokenResponse.text);
}

function TokenCache() {

    const CACHE_NAME = "SFSF_Token_Cache";

    this.setToken = function(clientId, userId, token) {
        let tokenCache = getTokenCache();
        tokenCache[clientId + "-" + userId] = {
            value: token,
            expires: new Date().getTime() + token.expires_in * 1000 - 60 * 1000
        };
        updateTokenCache(tokenCache);
    };

    this.getToken = function(clientId, userId) {
        let tokenCache = getTokenCache();
        let token = tokenCache[clientId + "-" + userId];
        if (token && token.expires > new Date().getTime()) {
            token.value.expires_in = Math.round((token.expires - new Date().getTime()) / 1000)
            return token.value;
        }
    };

    function getTokenCache() {
        return JSON.parse(config.get(CACHE_NAME, "{}"));
    }

    function updateTokenCache(tokenCache) {
        config.set(CACHE_NAME, JSON.stringify(tokenCache));
    }
}
