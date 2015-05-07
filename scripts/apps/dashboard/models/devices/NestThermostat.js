define([
	'jquery',
	'underscore',
	'backbone'
], function(
	$,
	_,
	Backbone
){



	
	return Backbone.Model.extend({
		idAttribute: "_id",
		url: function() {
			return SERVER + 'api/devices/' + this.id;
		},
		defaults: {
			displayType: 'Thermostat'
		}
	});

});