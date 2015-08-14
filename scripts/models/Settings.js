define([
	'app/core/Model'
], function(
	Model
){


	return Model.extend({
		idAttribute: '_id',
		urlRoot: localStorage.getItem('server') + 'api/settings'

	});

});