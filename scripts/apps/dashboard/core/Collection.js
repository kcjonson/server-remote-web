define([
	'backbone',
	'app/util/Error'
], function(
	Backbone,
	errorUtil
){
	
	return Backbone.Collection.extend({

		initialize: function() {
			this.on('error', function(collection, res, options){
				errorUtil.show(res.responseText || res.statusText || res.status);
			})
		},

		parse: function(res, req) {
			if (res.error) {
				errorUtil.show(res.error);
				delete res.error;
			}
			return res;
		}
	
	});

});