define([
	'jquery',
	'underscore',
	'backbone',
	'app/View',
	'text!./Admin.html',
	'./admin/Devices'
], function(
	$,
	_,
	Backbone,
	View,
	templateString,
	Devices
){
	




	return View.extend({


	// Init

		name: 'Admin',
		fetchData: true,
		templateString: templateString,

		initialize: function(args) {
			this.settingsModel = args.appModel.settingsModel;
			View.prototype.initialize.call(this);
			this._updateDisplay();

			$('input[name]', this.el).on('change', this._onInputChange.bind(this));
			this.settingsModel.on('change', this._onSettingsModelChange.bind(this))
		},

		_onSettingsModelChange: function(data) {
			this._updateDisplay();
		},

		_onInputChange: function(e) {
			var payload = {};
			payload[e.target.name] = e.target.value;
			this.settingsModel.save(payload, {
				patch: true
			});
		},

		_updateDisplay: function() {
			$('input[name]', this.el).each(function(i, input){
				input.value = this.settingsModel.get(input.name) || '';
			}.bind(this))
		}







	});
	
});
		