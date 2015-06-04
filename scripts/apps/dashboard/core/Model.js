define([
	'jquery',
	'underscore',
	'backbone'
], function(
	$,
	_,
	Backbone
){

	return Backbone.Model.extend({
		get: function(attr) {
			if (_.isFunction(this[attr])) {
				return this[attr]();
			} else {
				return Backbone.Model.prototype.get.call(this, attr);
			}
		},
		parse: function(res, req) {
			if (res.error) {
				console.error(res.error)
				delete res.error;
			}
			return res;
		}
	});

});