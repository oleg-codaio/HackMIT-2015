var config = require("../../shared/config");
var countdown = require("../../lib/countdown");
var observableArrayModule = require("data/observable-array");

function GroceryListViewModel(items) {
	var viewModel = new observableArrayModule.ObservableArray(items);

	viewModel.load = function() {
		viewModel.push({
			name: "Apples",
			item_id: 1,
			id: 1234125,
			expiration_date: new Date().getTime() - 64800000 // 18 hrs expired
		});
		viewModel.push({
			name: "Bananas",
			item_id: 2,
			id: 1234126,
			expiration_date: new Date().getTime() + 64800000 // 18 hrs til expiration
		});
		viewModel.push({
			name: "Strawberries",
			item_id: 3,
			id: 1234127,
			expiration_date: new Date().getTime() + 172800000 // 2 days til expiration
		});
		viewModel.push({
			name: "Watermelon",
			item_id: 4,
			id: 1234128,
			expiration_date: new Date().getTime() + 345600000 // 4 days til expiration
		});
		viewModel.push({
			name: "Tomatoes",
			item_id: 5,
			id: 1234129,
			expiration_date: new Date().getTime() + 691200000 // 8 days til expiration
		}); 

		viewModel.forEach(function(item) {
			
			item.color_class = _getColorClass(item.expiration_date);
			item.expiration_string = _getExpirationString(item.expiration_date);
			console.log(item.color_class);
			console.log(item.expiration_string); 
		});

		/*
		return fetch(config.apiUrl + "Groceries", {
			headers: {
				"Authorization": "Bearer " + config.token
			}
		})
		.then(handleErrors)
		.then(function(response) {
			return response.json();
		}).then(function(data) {
			data.Result.forEach(function(grocery) {
				viewModel.push({
					name: grocery.Name,
					id: grocery.Id
				});
			});
		}); */
	};

	viewModel.empty = function() {
		while (viewModel.length) {
			viewModel.pop();
		}
	};

	viewModel.add = function(grocery) {
		return fetch(config.apiUrl + "Groceries", {
			method: "POST",
			body: JSON.stringify({
				Name: grocery
			}),
			headers: {
				"Authorization": "Bearer " + config.token,
				"Content-Type": "application/json"
			}
		})
		.then(handleErrors)
		.then(function(response) {
			return response.json();
		})
		.then(function(data) {
			viewModel.push({ name: grocery, id: data.Result.Id });
		});
	};

	viewModel.delete = function(index) {
		return fetch(config.apiUrl + "Groceries/" + viewModel.getItem(index).id, {
			method: "DELETE",
			headers: {
				"Authorization": "Bearer " + config.token,
				"Content-Type": "application/json"
			}
		})
		.then(handleErrors)
		.then(function() {
			viewModel.splice(index, 1);
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

function _getColorClass(expirationDate) {
	currentTime = new Date().getTime();
	var oneDay = currentTime + 86400000;
	var threeDays = currentTime + 259200000;
	var fiveDays = currentTime + 432000000;

	if (expirationDate < currentTime) {
		return "expired";
	} else if (expirationDate < oneDay) {
		return "under1day";
	} else if (expirationDate < threeDays) {
		return "under3days";
	} else if (expirationDate < fiveDays) {
		return "under5days";
	} else {
		return "above5days";
	}
}

function _getExpirationString(expirationDate) {
	currentTime = new Date().getTime();
	oneDay = currentTime + 86400000;
	sevenDays = currentTime + 604800000;

	if (expirationDate < currentTime) {
		return "Expired";
	} else if (expirationDate < oneDay) {
		var countdownObj = countdown(currentTime, expirationDate, countdown.HOURS);
		return countdownObj.hours + "h";
	} else if (expirationDate < sevenDays) {
		var countdownObj = countdown(currentTime, expirationDate, countdown.DAYS|countdown.HOURS);
		return countdownObj.days + "d " + countdownObj.hours + "h";
	} else {
		var countdownObj = countdown(currentTime, expirationDate, countdown.MONTHS|countdown.WEEKS|countdown.DAYS);
		return countdownObj.weeks + "w " + countdownObj.days + "d";
	}
}

module.exports = GroceryListViewModel;