define([
	'app/core/Model'
], function(
	Model
){

	
	return Model.extend({
		name: 'Alarm',
		urlRoot: localStorage.getItem('server') + 'api/alarms',
		idAttribute: '_id'
	});

});