var extensions = require("core/v4/extensions");

const SUCCESS_FACTORS_AUTH_EXTENSION_POINT = "successfactors-proxy-auth";

exports.getAuthorizationHeader = function (userId) {
    let authExtensions = extensions.getExtensions(SUCCESS_FACTORS_AUTH_EXTENSION_POINT);
    validateAuthExtensions(authExtensions);

    let authExtension = require(authExtensions[0]);
    return authExtension.getAuthorizationHeader(userId);
};

function validateAuthExtensions(authExtensions) {
    if (!authExtensions || authExtensions.length === 0) {
        let errorMessage = "No extension is provided for the [" + SUCCESS_FACTORS_AUTH_EXTENSION_POINT + "] extension point";
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
}