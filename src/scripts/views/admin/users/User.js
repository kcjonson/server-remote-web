define([
	'jquery',
	'underscore',
	'backbone',
	'text!./User.html',
], function(
	$,
	_,
	Backbone,
	templateString
){




	return Backbone.View.extend({

		name: 'User',
		tagName: "li",

		initialize: function(params) {
			this.router = params.router;
			this._initializeTemplate();
			this.model.on("change", _.bind(this._onModelChange, this));
			this._updateDisplay();

		},

		_initializeTemplate: function () {
		
			// Consume template string
			if (templateString) {
				var templateDom = _.template(templateString);
				this.$el.html(templateDom);
				this.$el.addClass(this.name);
			};
			
			// Collect attach points
			if (this.$el) {
				$('[data-attach-point]', this.$el).each(_.bind(function(index, attachPointNode){
					var attachPointName = attachPointNode.attributes['data-attach-point'].value;
					this[attachPointName] = attachPointNode;
				}, this));
			};
			
		},

		placeAt: function(node) {
			node.appendChild(this.el);
		},

		_onModelChange: function () {
			this._updateDisplay();
		},






	// Private Functions

		_updateDisplay: function () {
			console.log('update', this.model)
			this._usernameNode.innerHTML = this.model.get('username') || '';
		}

	});




});