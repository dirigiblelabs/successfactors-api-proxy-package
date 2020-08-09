var extensions = require("core/v4/extensions");

const SUCCESS_FACTORS_CONFIG_EXTENSION_POINT = "successfactors-proxy-config";

exports.getHost = function () {
    let configExtensions = extensions.getExtensions(SUCCESS_FACTORS_CONFIG_EXTENSION_POINT);
    validateConfigExtensions(configExtensions);

    let configExtension = require(configExtensions[0]);
    return configExtension.getHost();
};

function validateConfigExtensions(configExtensions) {
    if (!configExtensions || configExtensions.length === 0) {
        let errorMessage = "No extension is provided for the [" + SUCCESS_FACTORS_CONFIG_EXTENSION_POINT + "] extension point";
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
}