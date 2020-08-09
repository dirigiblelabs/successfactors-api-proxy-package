var destinations = require("core/v4/destinations");

exports.getHost = function() {
    let destination = destinations.get("SFSF");
    return destination.URL;
};