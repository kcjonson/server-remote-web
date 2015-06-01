define([
	'jquery',
	'underscore',
	'backbone',
	'app/View',
	'text!./Devices.html',
	'./devices/Device'
], function(
	$,
	_,
	Backbone,
	View,
	templateString,
	Device
){
	

	

	return View.extend({


	// Init
		name: 'AdminDevices',
		title: 'Admin : Devices',
		templateString: templateString,
		fetchData: true,

		initialize: function(args) {
			this.appModel = args.appModel;
			this.devicesModel = args.appModel.devicesModel;

			View.prototype.initialize.call(this);

			this._addDevices();

			this.devicesModel.on("add", _.bind(this._onDevicesModelAdd, this));
			this.devicesModel.on("remove", _.bind(this._onDevicesModelRemove, this));




		},


	// Event Handlers

		_onDevicesModelAdd: function(deviceModel) {
			this._addDevice(deviceModel);
		},

		_onDevicesModelRemove: function() {

		},



	// Private Functions

		_addDevices: function() {
			this.devicesModel.forEach(this._addDevice.bind(this));
		},

		_addDevice: function(deviceModel) {
			new Device({
				model: deviceModel,
				router: this.router
			}).placeAt(this._devicesNode);
		}




		
	});


	
});