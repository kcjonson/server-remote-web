define([
	'app/core/Model'
], function(
	Model
){


	return Model.extend({
		idAttribute: '_id',
		urlRoot: SERVER + 'api/settings'

	});

});