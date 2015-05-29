define([
	'jquery',
	'underscore',
	'backbone',
	'text!./Admin.html',
	'./admin/Device'
], function(
	$,
	_,
	Backbone,
	templateString,
	Device
){
	




	return Backbone.View.extend({


	// Init

		name: 'Admin',
		fetchData: true,

		initialize: function(args) {
			this.router = args.router;
			this.appModel = args.appModel;
			this.devicesModel = args.appModel.devicesModel;
			this._initializeTemplate();

			this._addDevices();

			this.devicesModel.on("add", _.bind(this._onDevicesModelAdd, this));
			this.devicesModel.on("remove", _.bind(this._onDevicesModelRemove, this));
		},

		
		_initializeTemplate: function() {
		
			// Consume template string
			if (templateString) {
				var templateDom = _.template(templateString);
				this.$el.html(templateDom);
				this.$el.addClass(this.name);
			};
			
			// Collect attach points
			if (this.$el) {
				$('[data-attach-point]', this.$el).each(_.bind(function(index, attachPointNode){
					var attachPointName = attachPointNode.attributes['data-attach-point'].value;
					this[attachPointName] = attachPointNode;
				}, this));
			};
			
		},


	// Public Functions

		show: function() {
			this.$el.removeClass('hidden');
		},

		hide: function() {
			this.$el.addClass('hidden');
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
		