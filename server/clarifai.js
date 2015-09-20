var fs = require('fs');

// This file will: 
// (1) Read the user's upload. 
// (2) Save it in the file system.
// (3) Give it a public URL.
// (4) Pass it to the predict image.
// (5) Send predicted category back to ya boy front end.
// (6) Profit ??
var predict = require('./predictor')
var db = require('./database')

exports.handleImageUpload = function (req, res) {
	// Upload image.

	// Send URL for classification - watch out for async.
	classifyImage(url, res);
	//db.addItem();
}

var classifyImage = function (url, res) {
	// Cam implement this to return a name
	predict.getCategoryFromImage(url, function(category) {
		res.send(category);
	})
	// Once this completes, we can delete the file.
}