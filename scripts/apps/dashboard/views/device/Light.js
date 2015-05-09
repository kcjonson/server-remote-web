define([
	'jquery',
	'underscore',
	'backbone',
	'app/View',
	'./common/Gague',
	'text!./Light.html'
], function(
	$,
	_,
	Backbone,
	View,
	Gague,
	templateString
){
	


	var DEBUG = false;


	

	return View.extend({


	// Init
		name: 'Light',
		templateString: templateString,

		initialize: function(args) {
			this.model = args.model;
			View.prototype.initialize.call(this);

			this._gague = new Gague({el: this._gagueNode});
			this._gague.on('change', this._onGagueChange.bind(this));


			this._updateDisplay();
			this.model.on("change", _.bind(this._onModelChange, this));

			this._onNode.addEventListener("click", _.bind(this._onOnNodeClick, this));
			this._offNode.addEventListener("click", _.bind(this._onOffNodeClick, this));

		},


	// Private Events

		_onModelChange: function () {
			this._updateDisplay();
		},

		_onOnNodeClick: function() {
			//console.log('_onOnNodeClick')
			this._setBrightness(100);
		},

		_onOffNodeClick: function() {
			//console.log('_onOffNodeClick')
			this._setBrightness(0);
		},

		_onGagueChange: function(value) {
			console.log('v', arguments, value);
			this._setBrightness(value);
		},

	// Private Functions

		_updateDisplay: function() {

			var brightness = parseInt(this.model.get('brightness'));
			this._gague.setValue(brightness);


			// Disable Buttons
			if (brightness == 100) {
				$(this._onNode).attr('disabled', 'disabled');
			} else {
				$(this._onNode).removeAttr('disabled');
			}
			if (brightness == 0) {
				$(this._offNode).attr('disabled', 'disabled');
			} else {
				$(this._offNode).removeAttr('disabled');
			}
		},




		_setBrightness: function(brightness) {
			this.model.save({
				brightness: brightness
			}, {patch: true});
		},




		
	});


	
});