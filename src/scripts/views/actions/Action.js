define([
	'jquery',
	'underscore',
	'backbone',
	'app/core/View',
	'text!./Action.html'
], function(
	$,
	_,
	Backbone,
	View,
	templateString
){




	return View.extend({

		name: 'Action',
		className: 'clickable',
		templateString: templateString,

		initialize: function(params) {
			View.prototype.initialize.call(this);
			this.model.on("change", _.bind(this._onModelChange, this));
			this._updateDisplay();
			this.el.addEventListener("click", _.bind(this._onClick, this));
		},

		_onClick: function() {
			this.model.execute();
		},

		_onModelChange: function () {
			this._updateDisplay();
		},

		_updateDisplay: function (argument) {
			console.log('action model', this.model)
			this._labelNode.innerHTML = this.model.get('name');
		}

	});




});