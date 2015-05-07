define([
	'jquery',
	'underscore',
	'backbone',
	'app/models/users/User'
], function(
	$,
	_,
	Backbone,
	UserModel
){
	
	return Backbone.Collection.extend({

		url: SERVER + 'api/users',
		models: UserModel
	
	});

});