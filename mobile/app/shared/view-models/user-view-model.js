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

		return fetch(config.apiUrl + "login?user=" + escape(user), {
			method: "GET",
			headers: {
				"Content-Type": "application/json"
			}
		})
		.then(handleErrors)
		.then(function(response) {
			return response.json();
		}).then(function(data) {
            console.log("Logged in as user " + user + ": " + data);
			config.userId = data.user;
		});
	};

	// viewModel.register = function() {
	// 	return fetch(config.apiUrl + "Users", {
	// 		method: "POST",
	// 		body: JSON.stringify({
	// 			Username: viewModel.get("email"),
	// 			Email: viewModel.get("email"),
	// 			Password: viewModel.get("password")
	// 		}),
	// 		headers: {
	// 			"Content-Type": "application/json"
	// 		}
	// 	})
	// 	.then(handleErrors);
	// };

	// viewModel.isValidEmail = function() {
	// 	var email = this.get("email");
	// 	return validator.validate(email);
	// };

    viewModel.getList = function() {
		return fetch(config.apiUrl + "items", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
            	"X-User-Id": config.userId
			}
		})
		.then(handleErrors);
    };

    viewModel.addToList = function(picture) {
        encodedPicture = picture.toBase64String("jpg", 100);

		return fetch(config.apiUrl + "items", {
			method: "POST",
			body: JSON.stringify({
				image: encodedPicture,
			}),
			headers: {
				"Content-Type": "application/json",
            	"X-User-Id": config.userId
			}
		})
		.then(handleErrors)
		.then(function(response) {
			return response.json();
		}).then(function(data) {
            console.log("added picture: " + data);
            viewModel.push({
                name: data.name,
                id: data.id,
                expiration_date: data.expiration_date
            });
		});
    };

    viewModel.removeFromList = function(itemId) {
		return fetch(config.apiUrl + "item?id=" + itemId, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
            	"X-User-Id": config.userId
			}
		})
		.then(handleErrors)
		.then(function(response) {
			return response.json();
		}).then(function(data) {
            console.log("Deleted item: " + data);
            allItemIds = viewModel.map(function(item) { return item.id; });
            viewModel.splice(allItemIds.indexOf(itemId), 1);
		});
    }

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
