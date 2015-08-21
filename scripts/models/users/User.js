define([
	'app/core/Model'
], function(
	Model
){

	
	return Model.extend({
		name: 'User',
		urlRoot: localStorage.getItem('server') + 'api/users',
		idAttribute: '_id'

	});

});