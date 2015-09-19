// Retrieve
var MongoClient = require('mongodb').MongoClient;

// Database connection.
var database = null;

// Collections.
var users;
/* Users
- id	
- username
*/
var items;
/* Items
- id	
- item_id	
- name		
- expiration_date (ms)
*/
var durability;
/* Durability
- item_id	
- durability (ms)
*/

// Connect to Mongo Database.
MongoClient.connect("mongodb://localhost:27017/exampleDb", function(err, db) {
	if(err) throw err;
	console.log("Database connection successful.");
	database = db;
	initCollections();
});

// Create collections.
function initCollections() {
	database.collection('Users', function(err, collection) {
		if (err) throw err;
		users = collection;
	});
	database.collection('Items', function(err, collection) {
		if (err) throw err;
		items = collection;
	});
	database.collection('Durability', function(err, collection) {
		if (err) throw err;
		durability = collection;
	});
}

// Get User.
// Client sends a username. We should send back at User ID.
exports.getIDForUsername = function(username, res) {
	users.find({username: username}).toArray(function (err, userData) {
		// if the result size is zero, generate and add and ID.
		if (userData.length == 0) {
			var id = Math.floor(Math.random() * 1000000) + 1000000;
			users.insert({username: username, id: id});
			res.send({
				id: id
			})
		}
		else {
			// otherwise, send the first result's username.
			var userRecord = userData[0];
			console.log(userRecord)
			res.send({
				id: userRecord.id
			})
		}
	});
}

// Add Item.
// Adds an item to the database.
// Should also decide what that item is.
