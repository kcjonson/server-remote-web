define([
	'../models/User'
], function(
	UserModel
){

	var MODEL = new UserModel({});
	var IS_LOGGED_IN = false;

	return {

		getModel: function() {
			return MODEL;
		},

		set: function(userData) {
			console.log('/util/User.setLoggedIn()', userData);
			MODEL.set(userData);
			IS_LOGGED_IN = true;
		},

		getIsLoggedIn: function() {
			return IS_LOGGED_IN;
		},

		authenticate: function(callback) {
			$.ajax({
				url: SERVER + 'api/users/current',
				timeout: 6000,
				success: function(response){
					if (!response.error) {
						MODEL.set(response);
						callback();
					} else {
						callback(response.error)
					}
				}.bind(this)
			}).error(function(err){
			 	callback(err)
			}.bind(this));

		},

	}


	
});