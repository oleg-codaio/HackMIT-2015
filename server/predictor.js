var ACCEPT_THRESHOLD = 0.65;

// Tries to find a matching category for a given image
// and passes it to callback in an object with fields score and category.
// Passes null if no matching category found with score > threshold.
function getCategoryFromImage(imageUrl, callback) {
  // Stores objects for each image / category with results of prediction
  var resultsCount = 0;
  var currentBest = null;

  // Slow, but api doesn't really provide any better ways for
  // handling this currently
  for (var i = 0; i < categories.length; i++) {
    clarifai.predict(imageUrl, categories[i], function(obj) {
      if (obj.success) {
        var result = {
          score: obj.score,
          category: categories[i]
        };

        if (result.score >= ACCEPT_THRESHOLD && (!currentBest || result.score > currentBest.score)) {
          currentBest = result;
        }
      }

      resultsCount++;

      if (results.length == categories.length) {
        callback(currentBest);
      }
    }
  }
}