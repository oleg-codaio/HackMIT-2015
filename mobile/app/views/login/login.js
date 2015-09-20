var dialogsModule = require("ui/dialogs");
var frameModule = require("ui/frame");
var viewModule = require("ui/core/view");
var UserViewModel = require("../../shared/view-models/user-view-model");

var user = new UserViewModel();

exports.loaded = function(args) {
	var page = args.object;

	// Change the color and style of the iOS UINavigationBar
	if (page.ios) {
		var navigationBar = frameModule.topmost().ios.controller.navigationBar;
		navigationBar.barTintColor = UIColor.colorWithRedGreenBlueAlpha(0, 177/255, 200/255, 1);
		navigationBar.titleTextAttributes = new NSDictionary([UIColor.whiteColor()], [NSForegroundColorAttributeName]);
		navigationBar.barStyle = 1;
		navigationBar.tintColor = UIColor.whiteColor();
	} else if (page.android) {
        // TODO(oleg): see if there is a way to hide the action bar here.
        // frameModule.topmost().android.showActionBar = false;
        // frameModule.topmost().android.activity.getActionBar().hide();
    }

	page.bindingContext = user;
};

exports.signIn = function() {
	user.login()
		.then(function() {
			frameModule.topmost().navigate("views/list/list");
		}).catch(function(error) {
			console.log(error);
			dialogsModule.alert({
				message: "Unfortunately we could not find your account.",
				okButtonText: "OK"
			});
		}); 
};

exports.register = function() {
	var topmost = frameModule.topmost();
	topmost.navigate("views/register/register");
};
