define([
	'app/core/Collection',
	'app/models/devices/Device'
], function(
	Collection,
	DeviceModel
){
	
	return Collection.extend({

		url: function() {
			return localStorage.getItem('server') + 'api/devices'
		},

		model: DeviceModel,

		comparator: function(model) {
    		return model.get('name');
		},

		// constructor: function() {
		// 	if (!!window.EventSource && !this._eventSource) {
		// 		this._eventSource = new EventSource(localStorage.getItem('server') + 'api/devices/push');
		// 		this._eventSource.onmessage = function(e) { 
		// 			if (e.data) {
		// 				var newData = JSON.parse(e.data);
		// 				this.set([newData], {remove: false})
		// 			}
		// 	    }.bind(this);
		// 	}
		// 	Backbone.Collection.apply(this, arguments);
		// }
	
	});

});