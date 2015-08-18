define([
	'app/core/Collection',
	'app/models/users/User'
], function(
	Collection,
	UserModel
){

	return Collection.extend({
		name: 'users',
		url: function() {
			return localStorage.getItem('server') + 'api/users'
		},
		model: UserModel
	
	});

});