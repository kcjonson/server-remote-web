define([
	'backbone',
	'underscore',
	'./_fetch'
], function(
	Backbone,
	_,
	_fetch
){
	
	var Collection = Backbone.Collection.extend({});

	_.extend(Collection.prototype, _fetch);

	return Collection;

});