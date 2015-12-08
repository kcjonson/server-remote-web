define([
	'jquery',
	'underscore',
	'backbone'
], function(
	$,
	_,
	Backbone
){



	return Backbone.View.extend({

		initialize: function(params) {
			this.actionModel = params.actionModel;

			console.log('action model', this.actionModel)

			var templateDom = _.template("<div class='Action'><span class='icon fa'></span><span class='label'></span></div>");
			this.$el.html(templateDom);

			$('.label', this.$el)[0].innerHTML = params.label;
			$('.icon', this.$el).addClass(params.icon);

			this._name = params.name;
			this.el.addEventListener("click", _.bind(this._onClick, this));
		},

		placeAt: function(node) {
			node.appendChild(this.el);
			return this;
		},

		_onClick: function() {
			this.actionModel.execute();
		}

	});








});