var httpClient = require("http/v4/client");
var session = require("http/v4/session");
var user = require("security/v4/user");
var configProvider = require("successfactors-proxy/proxy/config/provider");
var authProvider = require("successfactors-proxy/proxy/auth/provider");

exports.execute = function(entity, parameters) {
	var api = getBaseApi() + "/" + entity;
	var httpResponse = httpClient.get(api, {
		headers: getHeaders(),
		params: parameters
	});
	setHeaders(httpResponse);
	return httpResponse;
};

exports.executePut = function(entity, payload, contentType) {
	var api = getBaseApi() + "/" + entity;
	var requestContentType = contentType ? contentType : "application/json";
	var headers = getHeaders();
	if (contentType === "application/json") {
		headers.push(getAcceptJsonHeader());
	}
	var httpResponse = httpClient.put(api, {
		headers: headers,
		text: payload,
		contentType: requestContentType,
		characterEncodingEnabled: false
	});
	setHeaders(httpResponse);
	return httpResponse;
};

exports.executePost = function(entity, payload, contentType) {
	var api = getBaseApi() + "/" + entity;
	var requestContentType = contentType ? contentType : "application/json";
	var headers = getHeaders();
	if (contentType === "application/json") {
		headers.push(getAcceptJsonHeader());
	}
	var httpResponse = httpClient.post(api, {
		headers: headers,
		text: payload,
		contentType: requestContentType,
		characterEncodingEnabled: false
	});
	setHeaders(httpResponse);
	return httpResponse;
};

exports.executeDelete = function(entity, parameters) {
	var api = getBaseApi() + "/" + entity;
	var httpResponse = httpClient.delete(api, {
		headers: getHeaders(),
		params: parameters
	});
	setHeaders(httpResponse);
	return httpResponse;
};

function getBaseApi() {
	return configProvider.getHost() + "/odata/v2";
}

function getHeaders() {
	var headers = [];
	headers.push(getAuthorizationHeader());
	headers.push(getCookieHeader());
	headers.push(getCSRFHeader());
	return headers.filter(header => header);
}

function setHeaders(response) {
	if (response) {
		setCookieHeader(response);
		setCSRFHeader(response);
	}
}

function getAuthorizationHeader() {
	let userId = user.getName();
	let authorizationHeader = authProvider.getAuthorizationHeader(userId);
	return {
		name: "Authorization",
		value: authorizationHeader
	};
}

function getCookieHeader() {
	var cookieValue = session.getAttribute("SFSF_Cookie");
	if (cookieValue) {
		return {
			name: "Cookie",
			value: cookieValue
		}
	}
}

function setCookieHeader(response) {
	if (!session.getAttribute("SFSF_Cookie")) {
		for (var i = 0; i < response.headers.length; i ++) {
			if (response.headers[i].name === "Set-Cookie") {
				var cookieValue = response.headers[i].value.split(";")[0];
				session.setAttribute("SFSF_Cookie", cookieValue)
				break;
			}
		}
	}
}

function getCSRFHeader() {
	var csrfHeaderValue = session.getAttribute("SFSF_CSRF_Header");
	if (csrfHeaderValue) {
		return {
			name: "X-CSRF-Token",
			value: csrfHeaderValue
		}
	}
}

function setCSRFHeader(response) {
	if (!session.getAttribute("SFSF_CSRF_Header")) {
		for (var i = 0; i < response.headers.length; i ++) {
			if (response.headers[i].name === "X-CSRF-Token") {
				var cookieValue = response.headers[i].value.split(";")[0];
				session.setAttribute("SFSF_CSRF_Header", cookieValue)
				break;
			}
		}
	}
}

function getAcceptJsonHeader() {
	return {
		name: "Accept",
		value: "application/json"
	};
}
