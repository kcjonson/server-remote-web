define([
	'backbone',
	'app/util/Error'
], function(
	Backbone,
	errorUtil
){

	return Backbone.Model.extend({

		initialize: function() {

			if (!this.name) {
				throw new Error("Models must have name attribute");
			}

			this.on('error', function(collection, res, options){
				if (res.status !== 200) {
					errorUtil.show(res.responseText || res.statusText || res.status);
				}
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