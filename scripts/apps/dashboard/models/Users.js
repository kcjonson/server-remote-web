define([
	'app/core/Collection',
	'app/models/users/User'
], function(
	Collection,
	UserModel
){

	return Collection.extend({
		url: function() {
			return SERVER + 'api/users'
		},
		model: UserModel
	
	});

});