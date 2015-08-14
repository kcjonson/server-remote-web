define([
	'app/core/Model'
], function(
	Model
){

	
	return Model.extend({
		urlRoot: localStorage.getItem('server') + 'api/users',
		idAttribute: '_id'

	});

});