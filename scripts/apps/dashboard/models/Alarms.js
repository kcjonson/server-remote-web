define([
	'jquery',
	'underscore',
	'backbone',
	'app/models/alarms/Alarm'
], function(
	$,
	_,
	Backbone,
	AlarmModel
){
	
	return Backbone.Collection.extend({
		url: function() {
			return SERVER + 'api/alarms'
		},

		model: AlarmModel




	
	});

});