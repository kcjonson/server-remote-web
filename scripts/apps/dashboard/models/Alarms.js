define([
	'app/core/Collection',
	'app/models/alarms/Alarm'
], function(
	Collection,
	AlarmModel
){
	
	return Collection.extend({
		url: function() {
			return SERVER + 'api/alarms'
		},

		model: AlarmModel




	
	});

});