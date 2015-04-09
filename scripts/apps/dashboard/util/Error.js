define([], function(){


	var ERRORS = [];

	return {
		show: function(error, router) {
			ERRORS.push(error);
			router.navigate('error', {trigger: true});
		},
		
		getAll: function() {
			return ERRORS;
		}
	}

});