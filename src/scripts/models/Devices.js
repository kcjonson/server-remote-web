define([
	'app/core/Collection',
	'app/models/devices/Device'
], function(
	Collection,
	DeviceModel
){
	
	return Collection.extend({
		name: 'devices',

		url: function() {
			return localStorage.getItem('server') + 'api/devices'
		},

		model: DeviceModel,

		comparator: function(model) {
    			return model.get('name');
		}
	
	});

});