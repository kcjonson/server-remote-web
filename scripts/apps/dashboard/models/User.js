define([
	'jquery',
	'underscore',
	'backbone',
	'backbone-relational'
], function(
	$,
	_,
	Backbone
){



	
	return Backbone.RelationalModel.extend({

		idAttribute: '_id',
		urlRoot: '/api/users/user'

	});

});