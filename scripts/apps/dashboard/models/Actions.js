define([
	'app/core/Collection',
	'app/models/actions/Action'
], function(
	Collection,
	ActionModel
){
	
	return Collection.extend({
		url: function() {
			return SERVER + 'api/actions'
		},

		model: ActionModel




	
	});

});