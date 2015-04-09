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
			$.get('/api/users/current', function(response){
				if (!response.error) {
					MODEL.set(response);
					callback();
				} else {
					callback(response.error)
				}
			}.bind(this)).error(function(error){
				callback(error)
			}.bind(this));
		},

	}


	
});