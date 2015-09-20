var config = require("../../shared/config");
var observableModule = require("data/observable");
var validator = require("email-validator/index");
var fetch = require("fetch").fetch;

function User(info) {
	info = info || {};

	// You can add properties to observables on creation
	var viewModel = new observableModule.Observable({
		email: info.email || "",
		password: info.password || ""
	});

	viewModel.login = function() {
        user = viewModel.get("email");

		return fetch(config.apiUrl + "login/" + escape(user), {
			method: "GET",
			headers: {
				"Content-Type": "application/json"
			}
		})
		.then(handleErrors)
		.then(function(response) {
			debugger;
			return response.json();
		}).then(function(data) {
			debugger;
            console.log("Logged in as user " + user + ": " + data.username);
			config.userId = data.user;
		});
	};

	return viewModel;
}

function handleErrors(response) {
	if (!response.ok) {
		console.log(JSON.stringify(response));
		throw Error(response.statusText);
	}
	return response;
}

module.exports = User;
