var categories = {
	"apples":		1209600000,
	"apple":		1209600000,
	"bananas":   	302400000,
	"banana":   	302400000,
	"clementines":   1512000000,
	"clementine":   1512000000,
	"bread":   1512000000,
};

exports.expectedExpiration = function(name) {
	name = name.toLowerCase();
	return categories[name];
};

exports.categories = categories;
exports.imageDir = __dirname + '/public';
