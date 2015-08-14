define([
	'app/core/Model'
], function(
	Model
){

	
	return Model.extend({
		urlRoot: 'api/checkins/checkin/',
		idAttribute: '_id'
	});

});