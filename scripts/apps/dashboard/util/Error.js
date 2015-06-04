define([], function(){
	var ERRORS = [];
	return {
		show: function(error, router) {
			router = router || this.router
			ERRORS.push(error);
			console.error(error);
			if (router) {
				router.navigate('error', {trigger: true});
			}
		},
		
		getAll: function() {
			return ERRORS;
		},

		setRouter: function(router) {
			this.router = router;
		}
	}
});