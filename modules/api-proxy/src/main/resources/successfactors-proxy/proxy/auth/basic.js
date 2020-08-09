var base64 = require("utils/v4/base64");

exports.getAuthorizationHeader = function(userId, companyId, password) {
    return "Basic " + base64.encode(userId + "@" + companyId + ":" + password);
};