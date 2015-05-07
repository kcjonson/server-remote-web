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
		urlRoot: '/api/devices',
		defaults: {
			displayType: 'Thermostat'
		}
	});

});