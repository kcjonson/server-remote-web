define([
	'jquery',
	'underscore',
	'backbone',
	'backbone-relational',
	'app/models/checkins/Checkin',
	'app/models/Checkins'
], function(
	$,
	_,
	Backbone,
	Checkin,
	Checkins
){



	
	return Backbone.RelationalModel.extend({

		idAttribute: '_id',
		//urlRoot: SERVER + 'api/users/user',

		url: function() {
			return SERVER + 'api/users/' + this.id;
		},

		// relations: [
		// 	{
		// 		key: 'checkins',
		// 		type: Backbone.HasMany,
		// 		collectionType: Checkins,
		// 		relatedModel: Checkin
		// 	}
		// ]

	});

});