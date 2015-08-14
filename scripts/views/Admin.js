define([
	'jquery',
	'underscore',
	'backbone',
	'app/core/View',
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
			this._latNode.addEventListener('change', this._onCoordinatesChange.bind(this));
			this._lngNode.addEventListener('change', this._onCoordinatesChange.bind(this));
			this.settingsModel.on('change', this._onSettingsModelChange.bind(this))

			// Dev Tools
			this._simulateGeohopperLocationNameNode.value = 'Home';
			this._simulateGeohopperEventNameNode.value = 'LocationEnter';
			this._simulateGeohopperNode.addEventListener('click', this._simulateGeohopper.bind(this));
		},

		_onSettingsModelChange: function(data) {
			this._updateDisplay();
		},

		_onCoordinatesChange: function() {
			this.settingsModel.save({
				coordinates: [
					this._lngNode.value || 0,
					this._latNode.value || 0
				]
			}, {patch: true});
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
			}.bind(this));
			var coordinates = this.settingsModel.get('coordinates') || [];
			this._lngNode.value = coordinates[0] || 0
			this._latNode.value = coordinates[1] || 0
		},



		_simulateGeohopper: function() {
			console.log('go!')


			$.ajax({
				method: 'POST',
				url: localStorage.getItem('server') + 'api/geohopper/',
				data: {
					location: this._simulateGeohopperLocationNameNode.value,
					event: this._simulateGeohopperEventNameNode.value,
					sender: 'kcjonson@gmail.com',
					time: new Date()
				},
				success: function(response){

					console.log(response)

					if (!response.error) {
						
					} else {
						
					}
				}.bind(this)
			}).error(function(err){
			 	
			}.bind(this));


		}







	});
	
});
		