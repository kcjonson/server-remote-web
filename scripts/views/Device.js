define([
	'jquery',
	'underscore',
	'backbone',
	'app/core/View',
	'./device/Thermostat',
	'./device/Light',
	'./device/Speaker',
	'text!./Device.html',
	'app/util/Device'
], function(
	$,
	_,
	Backbone,
	View,
	Thermostat,
	Light,
	Speaker,
	templateString,
	DeviceUtil
){
	
	
	var TYPE_TO_VIEW_MAP = {
		INDIGO_DIMMER: Light,
		NEST_THERMOSTAT: Thermostat,
		AIRFOIL_SPEAKER: Speaker
	}
	

	return View.extend({


	// Init
		name: 'Device',
		templateString: templateString,

		initialize: function(args) {
			this.appModel = args.appModel;
			this.devicesModel = args.appModel.devicesModel;
			View.prototype.initialize.call(this);
		},


		show: function(params) {
			View.prototype.show.call(this);
			if (params && params.length > 0) {
				var id = params[0];
				var model = this.devicesModel.findWhere({'_id': id});
				if (model) {
					this._displayDevice(model);
				}
			}
		},


		_displayDevice: function(model) {

			this._nameNode.innerHTML = model.get('name');
			var type = model.get('type');			
			var iconClass = DeviceUtil.getIconFromType(type);
			$(this._typeNode).addClass(iconClass);


			if (this._detailsView) {
				this._detailsView.remove();
			}
			var detailsType = TYPE_TO_VIEW_MAP[type];
			if (detailsType) {
				this._detailsView = new detailsType({
					model: model
				}).placeAt(this._detailsNode);
			}
		}





		
	});


	
});