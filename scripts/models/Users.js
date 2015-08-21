define([
	'app/core/Collection',
	'app/models/users/User',
	'app/util/Cookie'
], function(
	Collection,
	UserModel,
	Cookie
){

	return Collection.extend({
		name: 'users',
		url: function() {
			return localStorage.getItem('server') + 'api/users'
		},
		model: UserModel,

		getCurrent: function() {
			var userId = Cookie.get('remote.userId');
			var userModel = this.get(userId);
			return userModel
		}
	
	});

});