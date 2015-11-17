define([
	'underscore',
	'backbone'
], function(
	_,
	Backbone
){
	var ERRORS = [];

	var Error = {
		show: function(error, router) {
			router = router || this.router

			if (error !== 401) {
				ERRORS.push(error);
				console.error(error);
				this.trigger('add', error);
				if (router) {
					router.navigate('error', {trigger: true});
				}
			} else {
				if (router) {
					router.navigate('login', {trigger: true});
				}
			}
		},
		
		getAll: function() {
			return ERRORS;
		},

		setRouter: function(router) {
			this.router = router;
		}
	}

	return _.extend(Error, Backbone.Events);
	
});


