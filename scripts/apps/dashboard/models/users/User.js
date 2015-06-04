define([
	'app/core/Model'
], function(
	Model
){

	
	return Model.extend({
		urlRoot: SERVER + 'api/users',
		idAttribute: '_id'

	});

});