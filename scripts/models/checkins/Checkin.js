define([
	'app/core/Model'
], function(
	Model
){

	
	return Model.extend({
		name: 'Checkin',
		urlRoot: 'api/checkins/checkin/',
		idAttribute: '_id'
	});

});