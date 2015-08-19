define([
	'app/core/View',
], function(
	View
){



	return View.extend({

		// Init
		name: 'UserPortrait',
		tagName: "div",
		templateString: "<span class='user' data-attach-point='_userNode'></span>",

		initialize: function(args) {
			View.prototype.initialize.call(this);
			this.setModel(args.userModel);
		},

		setModel: function(model) {
			this.userModel = model;
			if (this.userModel) {
				this.userModel.on("change", this._onUserModelChange.bind(this));
				this._updateDisplay();
			}
		},

		_onUserModelChange: function() {
			this._updateDisplay();
		},

		_updateDisplay: function() {
			if (this.userModel.get('name')) {
				var firstLetter = this.userModel.get('name').first.substr(0,1);
				var lastLetter = this.userModel.get('name').last.substr(0,1);
				this._userNode.innerHTML = firstLetter + lastLetter;
			}
		}

	});
});