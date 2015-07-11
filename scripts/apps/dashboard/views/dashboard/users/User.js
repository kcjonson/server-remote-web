define([
	'jquery',
	'underscore',
	'backbone',
	'app/core/View',
	'text!./User.html',
	'app/util/Date'
], function(
	$,
	_,
	Backbone,
	View,
	templateString,
	DateUtil
){



	return View.extend({

		// Init
		name: 'User',
		templateString: templateString,
		fetchData: false,
		tagName: "li",

		initialize: function(args) {
			this.userModel = args.userModel;
			View.prototype.initialize.call(this);
			this._updateDisplay();
			this.userModel.on("change", this._onUserModelChange.bind(this));
		},

		_onUserModelChange: function() {
			this._updateDisplay();
		},

		_updateDisplay: function() {
			console.log('change', this.userModel);
			this._nameNode.innerHTML = this.userModel.get('name').first;
			var mostRecentCheckin = this.userModel.get('mostRecentCheckin');
			if (mostRecentCheckin) {
				var isHome = mostRecentCheckin.name === 'Home' && mostRecentCheckin.action === 'ENTER';
				this.$el.toggleClass('isHome', isHome);
				this._timestampNode.innerHTML = '(' + DateUtil.formatRelativeDate(mostRecentCheckin.date) + ')';
			}
		}

	});
});