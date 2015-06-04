define([
	'jquery',
	'underscore',
	'backbone'
], function(
	$,
	_,
	Backbone
){
	
	return Backbone.Collection.extend({

		parse: function(res, req) {
			if (res.error) {
				console.error(res.error)
				delete res.error;
			}
			return res;
		}
	
	});

});