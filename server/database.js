// Retrieve MongoClient
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

// Connect to Mongo Database.
MongoClient.connect("mongodb://localhost:27017/exampleDb", function (err, db) {
	if(err) throw err;
	console.log("Database connection successful.");
	database = db;
	initCollections();
});

// Create collections.
function initCollections () {
	database.collection('users', function (err, collection) {
		if (err) throw err;
		users = collection;
	});
	database.collection('items', function (err, collection) {
		if (err) throw err;
		items = collection;
	});
}

// Get User.
// Client sends a username. We should send back at User ID.
exports.getIDForUsername = function (username, res) {
	users.find({username: username}).toArray(function (err, data) {
res.send({id:12131231});
return;
		if (err) throw err;
		// if the result size is zero, generate and add and ID.
		console.log(data);
		if (data.length == 0) {
			var id = Math.floor(Math.random() * 1000000) + 1000000;
			users.insert({username: username, id: id});
			res.send({
				id: id
			})
		}
		// otherwise, send the first result's username.
		else {
			var userRecord = data[0];
			console.log(userRecord)
			res.send({
				id: userRecord.id
			})
		}
	});
}

// Get Items.
// Gets all items out of the database for a given user ID.
exports.getItems = function (id, res) {
	items.find({id: parseInt(id, 10)}).sort({ expirationDate: -1 }).toArray(function (err, data) {
		if (err) throw err;
		res.send(data);
	});
}

// Delete Item.
// Deletes an item with a given ID from a user with the same ID.
exports.deleteItem = function (id, itemID, res) {
console.log(id + ' ' + itemID)
	items.remove({id: id, itemID: itemID});
	res.sendStatus(200);
}

// Add Item.
// Adds an item to the database.
exports.addItem = function (userID, itemID, name, expirationDate) {
	items.insert({id: userID, 
		itemID: Math.floor(Math.random() * 1000000) + 1000000,
		name: name,
		expiration_date:  expirationDate
	})
}

