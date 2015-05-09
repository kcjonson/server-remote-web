define([
	'jquery',
	'underscore',
	'backbone',
	'app/View',
	'./common/Gague',
	'text!./Speaker.html'
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
		name: 'Speaker',
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
			this._setVolume(60);
		},

		_onOffNodeClick: function() {
			//console.log('_onOffNodeClick')
			this._setVolume(0);
		},

		_onGagueChange: function(value) {
			this._setVolume(value);
		},

	// Private Functions

		_updateDisplay: function() {

			var volume = parseInt(this.model.get('volume'));
			this._gague.setValue(volume);


			// Disable Buttons
			if (volume == 100) {
				$(this._onNode).attr('disabled', 'disabled');
			} else {
				$(this._onNode).removeAttr('disabled');
			}
			if (volume == 0) {
				$(this._offNode).attr('disabled', 'disabled');
			} else {
				$(this._offNode).removeAttr('disabled');
			}
		},




		_setVolume: function(volume) {
			this.model.save({
				volume: volume
			}, {patch: true});
		},




		
	});


	
});