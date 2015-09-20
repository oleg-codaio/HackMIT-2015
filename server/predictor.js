var fs = require('fs');
var db = require('./database');
var constants = require('./constants');

// Yes, this is our access token. Go ahead, use it.
var Clarifai = require('./clarifai');
var clarifai = new Clarifai({
  accessToken: 'o132JLXLqOow4oUksuvQYZEPi3SRtN',
  collectionId: 'hackmit',
  nameSpace: 'hackathon'
});

var ACCEPT_THRESHOLD = 0.65;
// Ensures unique names for images
var imageCount = 0;


exports.handleImageUpload = function (req, res) {
  var imageName = imageCount + '.jpg';
  var imagePath = constants.imageDir + '/images/' + imageName;
  imageCount++;

  var decodedImage = new Buffer(req.body.image, 'base64');
  fs.writeFileSync(imagePath, decodedImage);


  // We are hardcoding the image directory. Bad.
	classifyImage('http://104.131.45.245/images' + imageName, function(matchData) {
    // Delete our temp stored image
    fs.unlink(imagePath);

    if (matchData === null) {
      res.status(400).send({ message: 'Cannot recognize image' });
      return;
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
  clarifai.predict_top(imageUrl,'apple', function(obj) {
    var result = null;

    if (obj.success) {
      result = {
        score: obj.score,
        category: obj.cname
      };
    }

    if (result && result.score >= ACCEPT_THRESHOLD) {
      callback(result);
    }
    else {
      callback(null);
    }
  });
}
