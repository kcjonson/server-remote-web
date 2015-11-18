define([
	'jquery',
	'app/core/Collection',
	'app/models/users/User',
	'app/util/Cookie'
], function(
	$,
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
			var currentUserId = this._currentUserId || Cookie.get('remote.userId');
			if (currentUserId) {
				this._currentUserId  = currentUserId;
				return this.get(currentUserId)
			} else {
				this._authenticate(function(response){
					this._currentUserId= response._id;
					this.trigger('change');
				}.bind(this));
			}
		},

		_authenticate: function(callback) {
			$.ajax({
				url: localStorage.getItem('server') + 'api/users/current',
				timeout: 6000,
				success: function(response){
					if (!response.error && response._id) {
						callback(response);
					} else {
						console.error('an unknown error occurred while trying to authenticate the current user', response)
					}
				}.bind(this)
			}).error(function(e){
				console.error('an error occurred while trying to authenticate the current user', e)
			});
		}
	
	});

});