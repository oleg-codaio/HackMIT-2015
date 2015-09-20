var categories = {
	"apples":		1209600000,
	"bananas":   	302400000,
	"clementines":   1512000000,
	"bread":   1512000000,
};

exports.expectedExpiration = function(name) {
	name = name.toLowerCase();
	return categories[name] || 0;
};

exports.categories = categories;
exports.imageDir = __dirname + '/public';
