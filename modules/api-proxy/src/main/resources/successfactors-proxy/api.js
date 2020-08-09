var rs = require("http/v4/rs");
var bytes = require("io/v4/bytes");
var sfsfClient = require("successfactors-proxy/proxy/client");

rs.service()
	.resource("odata/v2/{entity}")
		.get(function(ctx, request, response) {
			executeRequest(request, response, ctx.pathParameters.entity);
		})
		.put(function(ctx, request, response) {
			executePutRequest(request, response, ctx.pathParameters.entity);
		})
		.post(function(ctx, request, response) {
			executePostRequest(request, response, ctx.pathParameters.entity);
		})
		.delete(function(ctx, request, response) {
			executeDeleteRequest(request, response, ctx.pathParameters.entity);
		})
	.resource("odata/v2/{entity}/$batch")
		.post(function(ctx, request, response) {
			executePostRequest(request, response, ctx.pathParameters.entity + "/$batch");
		})
.execute();

function executeRequest(request, response, entity) {
	var parameters = [];
	var parameterNames = request.getParameterNames();
	
	for (var i = 0 ; i < parameterNames.length; i ++) {
		parameters.push({
			name: parameterNames[i],
			value: replaceAll(request.getParameter(parameterNames[i]), " ", "+")
		});
	}

	var sfsfResponse = sfsfClient.execute(entity, parameters);
	var status = sfsfResponse.statusCode;
	var data = sfsfResponse.text;

	response.setStatus(status);
	response.setContentType("application/json");
	response.println(data);
}

function executePutRequest(request, response, entity) {
	var payload = request.getText();
	var contentType = request.getContentType();
	var sfsfResponse = sfsfClient.executePut(entity, payload, contentType);
	var status = sfsfResponse.statusCode;
	var data = sfsfResponse.text;

	if (data === undefined) {
		data = bytes.byteArrayToText(sfsfResponse.data);
	}
	response.setStatus(status);
	response.setContentType("application/json");
	response.println(data);
}

function executePostRequest(request, response, entity) {
	var payload = request.getText();
	var contentType = request.getContentType();
	var sfsfResponse = sfsfClient.executePost(entity, payload, contentType);
	var status = sfsfResponse.statusCode;
	var data = sfsfResponse.text;

	if (data === undefined) {
		data = bytes.byteArrayToText(sfsfResponse.data);
	}
	response.setStatus(status);
	response.setContentType("application/json");
	response.println(data);
}

function executeDeleteRequest(request, response, entity) {
	var parameters = [];
	var parameterNames = request.getParameterNames();
	
	for (var i = 0 ; i < parameterNames.length; i ++) {
		parameters.push({
			name: parameterNames[i],
			value: replaceAll(request.getParameter(parameterNames[i]), " ", "+")
		});
	}

	var sfsfResponse = sfsfClient.executeDelete(entity, parameters);
	var status = sfsfResponse.statusCode;
	var data = sfsfResponse.text;

	response.setStatus(status);
	response.setContentType("application/json");
	response.println(data);
}

function replaceAll(target, search, replacement) {
    return target.replace(new RegExp(search, "g"), replacement);
}