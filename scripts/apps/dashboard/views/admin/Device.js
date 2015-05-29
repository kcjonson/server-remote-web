define([
	'jquery',
	'underscore',
	'backbone',
	'text!./Device.html',

], function(
	$,
	_,
	Backbone,
	templateString,
	Device,
	DeviceUtil
){




	return Backbone.View.extend({

		name: 'Device',
		tagName: "li",

		initialize: function(params) {
			this.router = params.router;
			this._initializeTemplate();
			this.model.on("change", _.bind(this._onModelChange, this));
			this._updateDisplay();

			this._categoryNode.addEventListener('change', this._onFieldChange.bind(this));
			this._nameNode.addEventListener('change', this._onFieldChange.bind(this));
			this._locationNode.addEventListener('change', this._onFieldChange.bind(this));
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

		_onFieldChange: function(e) {
			var payload = {};
			payload[e.target.dataset.field] = e.target.value;
			this.model.save(payload, {patch: true});
		},




	// Private Functions

		_updateDisplay: function () {
			this.$el.attr('data-name', this.model.get('name'))

			this._nameNode.value = this.model.get('name') || '';
			this._categoryNode.value = this.model.get('category') || '';
			this._locationNode.value = this.model.get('location') || '';
			this._idNode.innerHTML = this.model.get('_id');
			this._typeNode.innerHTML = this.model.get('type');




			
		}

	});




});