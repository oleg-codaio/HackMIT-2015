var express = require('express');
var app = express();

// Root route (ha).
app.get('/', function (req, res) {
  res.send('Ooops! There\'s nothing here. We will win HackMIT.');
});

// Post a single item.
// req header must include valid user ID.
app.get('/post_item', function (req, res) {

});

// Delete a single item.
// req header must include valid user ID. 
app.get('/delete_item', function (req, res) {

});


// Get all items.
// req header must include valid user ID.
app.get('/items', function (req, res) {

});

// Mongo is running on: http://localhost:27017

// Init server.
var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Listening at http://%s:%s', host, port);
});