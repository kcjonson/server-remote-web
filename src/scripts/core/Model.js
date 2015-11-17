define([
	'backbone',
	'underscore',
	'./_fetch'
], function(
	Backbone,
	_,
	_fetch
){

	var Model =  Backbone.Model.extend({

		get: function(attr) {
			if (_.isFunction(this[attr])) {
				return this[attr]();
			} else {
				return Backbone.Model.prototype.get.call(this, attr);
			}
		},
		

	});

	_.extend(Model.prototype, _fetch);

	return Model;

});