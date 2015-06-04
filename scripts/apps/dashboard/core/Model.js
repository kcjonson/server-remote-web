define([
	'backbone',
	'app/util/Error'
], function(
	Backbone,
	errorUtil
){

	return Backbone.Model.extend({

		initialize: function() {
			this.on('error', function(collection, res, options){
				errorUtil.show(res.responseText || res.statusText || res.status);
			})
		},

		get: function(attr) {
			if (_.isFunction(this[attr])) {
				return this[attr]();
			} else {
				return Backbone.Model.prototype.get.call(this, attr);
			}
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