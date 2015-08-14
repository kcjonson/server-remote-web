define([
	'app/core/Model'
], function(
	Model
){

	
	return Model.extend({
		urlRoot: localStorage.getItem('server') + 'api/alarms',
		idAttribute: '_id'
	});

});