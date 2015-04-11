define([
	'jquery',
	'underscore',
	'backbone',
	'app/View',
	'text!./User.html'
], function(
	$,
	_,
	Backbone,
	View,
	templateString
){
	

	

	return View.extend({


	// Init
		name: 'User',
		templateString: templateString,

		initialize: function(args) {
			this.indigoModel = args.indigoModel;
			View.prototype.initialize.call(this);


			this.indigoModel.on("change", _.bind(this._onModelChange, this));

		},




		_onIndigoModelChange: function () {
			this._updateDisplay();
		},



	// Private Functions

		_updateDisplay: function() {

		},




		
	});


	
});