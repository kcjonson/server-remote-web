define([
	'app/core/Model'
], function(
	Model
){


	return Model.extend({
		name: 'settings',
		idAttribute: '_id',
		urlRoot: localStorage.getItem('server') + 'api/settings'

	});

});