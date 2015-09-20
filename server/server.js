// Link Files
var db = require('./database');
var predictor = require('./predictor');
var constants = require('./constants');
var bodyParser = require('body-parser');

// Init Express
var express = require('express');

var app = express();

// Public directory for image upload
app.use(express.static(constants.imageDir));
app.use(bodyParser.json());


// Root route (ha).
app.get('/', function (req, res) {
	res.send('Ooops! There\'s nothing here. We will win HackMIT(, though).');
});

app.get('/login/:username', function (req, res) {
	//res.send({
	//	id: db.getIDForUsername(req.params.username)
	//});
	db.getIDForUsername(req.params, res);
});

// Post a single item.
// req header must include valid user ID.
app.post('/items', function (req, res) {
	 // Get picture path
	 predictor.handleImageUpload(req, res);
	 // Lookup expected expiration times
	 // Store in DB
	 // Populate and send response
});

// Delete a single item.
// req header must include valid user ID. 
app.delete('/items', function (req, res) {
	db.deleteItem(req.params.id, req.params.itemid, res);
});


// Get all items.
// req header must include valid user ID.
app.get('/items', function (req, res) {
	db.getItems(req.id, res);
});

// Mongo is running on: http://localhost:27017

// Init server.
var server = app.listen(3000, function () {
	var host = server.address().address;
	var port = server.address().port;

	console.log('Listening at http://%s:%s', host, port);
});
