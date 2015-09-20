var fs = require('fs');
var db = require('./database');
var constants = require('./constants');

// Yes, this is our access token. Go ahead, use it.
var Clarifai = require('./clarifai');
var clarifai = new Clarifai({
  'accessToken': 'o132JLXLqOow4oUksuvQYZEPi3SRtN'
});

var ACCEPT_THRESHOLD = 0.65;


exports.handleImageUpload = function (req, res) {
  // We are hardcoding the image directory. Bad.
	classifyImage('http://104.131.45.245/images' + req.file.filename, function(matchData) {
    // Delete our temp stored image
    fs.unlink(req.file.path);

    if (matchData === null) {
      res.send(400, { message: 'Cannot recognize image' });
    }

    var item = {
      expirationDate: new Date(Date.now() + constants.expectedExpiration(matchData.category)),
      category: matchData.category
    };

    // TODO Add item to database

    res.send(item);
  });
}

// Tries to find a matching category for a given image
// and passes it to callback in an object with fields score and category.
// Passes null if no matching category found with score > threshold.
var classifyImage = function (imageUrl, callback) {
  // Stores objects for each image / category with results of prediction
  var resultsCount = 0;
  var currentBest = null;

  var categories = Object.keys(constants.categories);

  // Slow, but api doesn't really provide any better ways for
  // handling this currently
  for (var i = 0; i < categories.length; i++) {
    clarifai.predict(imageUrl, categories[i], function(obj) {
      resultsCount++;

      if (obj.success) {
        var result = {
          score: obj.score,
          category: categories[i]
        };

        if (result.score >= ACCEPT_THRESHOLD && (!currentBest || result.score > currentBest.score)) {
          currentBest = result;
        }
      }

      if (results.length == categories.length) {
        callback(currentBest);
      }
    });
  }
}
