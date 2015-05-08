define([
	'jquery',
	'underscore',
	'backbone',
	'app/models/actions/Action'
], function(
	$,
	_,
	Backbone,
	ActionModel
){
	
	return Backbone.Collection.extend({
		url: function() {
			return SERVER + 'api/actions'
		},

		model: ActionModel




	
	});

});