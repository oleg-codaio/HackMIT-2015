durability = {
	"apples":		1209600000,
	"bananas":   	302400000,
	"clementines":   1512000000
}

exports.getTimeToExpiration = function (name) {
	name = name.toLowerCase();
	return durability[name];
}