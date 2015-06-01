define([
	'jquery',
	'underscore',
	'backbone',
	'app/models/devices/Device'
], function(
	$,
	_,
	Backbone,
	DeviceModel
){
	
	return Backbone.Collection.extend({

		url: function() {
			return SERVER + 'api/devices'
		},

		model: DeviceModel,

		comparator: function(model) {
    		return model.get('name');
		},

		constructor: function() {
			if (!!window.EventSource) {
				var source = new EventSource(SERVER + 'api/devices/push');
				source.onmessage = function(e) { 
					if (e.data) {
						var newData = JSON.parse(e.data);
						this.set([newData], {remove: false})
					}
			    }.bind(this);
			}
			Backbone.Collection.apply(this, arguments);
		}
	
	});

});