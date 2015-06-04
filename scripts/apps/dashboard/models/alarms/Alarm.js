define([
	'app/core/Model'
], function(
	Model
){

	
	return Model.extend({
		urlRoot: SERVER + 'api/alarms',
		idAttribute: '_id'
	});

});