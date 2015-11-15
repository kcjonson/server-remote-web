define([
	'jquery',
	'underscore',
	'backbone',
	'app/core/View',
	'./common/Gague',
	'text!./Thermostat.html'
], function(
	$,
	_,
	Backbone,
	View,
	Gague,
	templateString
){
	
	

	var TEMP_MIN = 0;
	var TEMP_MAX = 120;


	

	return View.extend({


	// Init
		name: 'Thermostat',
		templateString: templateString,

		initialize: function(args) {
			this.model = args.model;
			View.prototype.initialize.call(this);


			this._gague = new Gague({el: this._gagueNode});
			this._gague.on('change', this._onGagueChange.bind(this));



			this._updateDisplay();
		},

		_updateDisplay: function() {

			console.log(this.model)

			// var isOn = this.model.get('hvacHeaterIsOn');
			// this._currentTempNode.innerHTML = this.model.get('displayRawState');
			// this._setTempNode.innerHTML = this.model.get('setpointHeat');
			// $(this._setTempNode).toggleClass('hidden', !isOn);

			var setpoint = this.model.get('temperatureTarget');
			var current = this.model.get('temperatureAmbient');

			var tempScale = TEMP_MAX - TEMP_MIN;
			var setpointPercent = Math.round((setpoint / tempScale) * 100)
			this._gague.setValue(setpointPercent);

		},

		_onGagueChange: function() {

		}



		
	});


	
});