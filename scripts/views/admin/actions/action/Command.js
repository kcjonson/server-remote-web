define([
	'jquery',
	'underscore',
	'backbone',
	'text!./Command.html'
], function(
	$,
	_,
	Backbone,
	templateString
){


	var FIELD_TYPES = {
		DEVICE_ID: {
			'class': 'deviceId',
			dataProperty: 'deviceId'
		},
		PROPERTY: {
			'class': 'property',
			dataProperty: 'property'
		},
		VALUE: {
			'class': 'value',
			dataProperty: 'value'
		},
		NAME: {
			'class': 'name',
			dataProperty: 'name'
		}
	};


	var TYPE_OPTIONS = {
		DEVICE: {
			label: 'Device',
			'class': 'device',
			fields: [
				FIELD_TYPES.DEVICE_ID,
				FIELD_TYPES.PROPERTY,
				FIELD_TYPES.VALUE
			]
		},
		TYPE: {
			label: 'Type',
			'class': 'type',
			fields: [
				FIELD_TYPES.NAME,
				FIELD_TYPES.PROPERTY,
				FIELD_TYPES.VALUE
			]
		},
		ACTION: {
			label: 'Action',
			'class': 'action',
			fields: [
				FIELD_TYPES.NAME
			]
		}
	};




	return Backbone.View.extend({

		name: 'AdminActionCommand',
		tagName: "ul",

		initialize: function(params) {
			this._initializeTemplate();
			this.data = params.data;
			this.index = params.index;
			this.el.setAttribute('data-index', this.index)
			this._updateDisplay();
			

		
			this._typeNode.addEventListener('change', this._onFieldChange.bind(this));

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
			return this;
		},

		setData: function(data) {
			this.data = data;
			this._updateDisplay();
		},

		_onFieldChange: function(e) {
			this.trigger('change', {
				index: this.index,
				property: e.target.dataset.property,
				value: e.target.value
			});
		},




	// Private Functions

		_updateDisplay: function () {

			this._typeNode.value = this.data.type;

			if (!this._fieldNodes) {
				this._fieldNodes = {};
			}

			TYPE_OPTIONS[this.data.type].fields.forEach(function(field){
				if (!this._fieldNodes[field.dataProperty])  {
					var nodes = {};
					// Create outer wrapper
					nodes.element = document.createElement('li');
					nodes.element.setAttribute('class', field['class']);
					// Create input
					nodes.input = document.createElement('input');
					nodes.input.setAttribute('type', 'text');
					nodes.input.setAttribute('data-property', field.dataProperty);

					nodes.input.addEventListener('change', this._onFieldChange.bind(this));

					// Put them all together
					nodes.element.appendChild(nodes.input);
					this.el.appendChild(nodes.element);
					this._fieldNodes[field.dataProperty] = nodes;
				}
			}.bind(this));

			for (var key in this._fieldNodes) {
				if (this._fieldNodes.hasOwnProperty(key)) {
					var nodes = this._fieldNodes[key];
					if (this.data[key] !== undefined) {
						this._fieldNodes[key].input.value = this.data[key];
					} 
					var found = false;
					TYPE_OPTIONS[this.data.type].fields.forEach(function(field){
						if (key == field.dataProperty) {found = true;}
					}.bind(this));
					if (!found) {
						this.el.removeChild(nodes.element);
						delete this._fieldNodes[key]
					}
				}
			};

		},



	});




});