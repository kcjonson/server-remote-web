define([
	'app/core/Collection',
	'app/models/actions/Action'
], function(
	Collection,
	ActionModel
){
	
	return Collection.extend({
		url: function() {
			return localStorage.getItem('server') + 'api/actions'
		},

		model: ActionModel




	
	});

});