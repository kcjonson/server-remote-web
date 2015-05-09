define([
	'jquery',
	'underscore',
	'backbone',
	'text!./Device.html',
	'../Device',
	'app/util/Device'
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
		className: 'clickable',

		initialize: function(params) {
			this.router = params.router;
			this._initializeTemplate();
			this.model.on("change", _.bind(this._onModelChange, this));
			this._updateDisplay();
			this._nameNode.addEventListener("click", _.bind(this._onNameNodeClick, this));
			this._stateNode.addEventListener("click", _.bind(this._onStateNodeClick, this));

			// Touch Events
			// this.$el.on("touchstart", _.bind(this._onTouchStart, this));
			// this.$el.on("touchend", _.bind(this._onTouchEnd, this));
			// this.$el.on("touchcancel", _.bind(this._onTouchCancel, this));
			// this.$el.on("touchleave", _.bind(this._onTouchLeave, this));
			// this.$el.on("touchmove", _.bind(this._onTouchMove, this));
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

		_onStateNodeClick: function() {
			if (this._handleStateClick) {
				this._handleStateClick();
			}
		},

		_onNameNodeClick: function() {
			var deviceId = this.model.get('_id');
			this.router.navigate('device/' + deviceId, {trigger: true});
		},

		_onModelChange: function () {
			this._updateDisplay();
		},

	// Private Events

		_onTouchStart: function() {
			console.log('_onTouchStart');
		},

		_onTouchEnd: function() {
			console.log('_onTouchEnd')
		},

		_onTouchCancel: function() {
			console.log('_onTouchCancel')
		},

		_onTouchLeave: function() {
			console.log('_onTouchLeave')
		},

		_onTouchMove: function() {
			console.log('_onTouchMove')
		},



	// Private Functions

		_updateDisplay: function () {
			this.$el.attr('data-name', this.model.get('name'))

			this._nameNode.innerHTML = this.model.get('name');

			var type = this.model.get('type');			
			var iconClass = DeviceUtil.getIconFromType(type);
			$(this._stateNode).addClass(iconClass);

			switch (type) {
				case "INDIGO_DIMMER":
					//this._stateNode.innerHTML = this.model.get('displayLongState');
					var currentBrightness = this.model.get('brightness');
					$(this._stateNode).toggleClass('on', currentBrightness > 0);

					this._handleStateClick = function() {
						var currentBrightness = this.model.get('brightness');
						var newBrightness = currentBrightness > 0 ? 0 : 100;
						this.model.save({
						 	brightness: newBrightness
						}, {patch: true});
					}.bind(this);
					break;
				case 'NEST_THERMOSTAT':
					//console.log('Thermostat', this.model)
					//var isOn = this.model.get('hvacHeaterIsOn');
					//$(this._stateNode).toggleClass('on', isOn);
					break;
				case 'INDIGO_SWITCH': 
					break;
				case 'AIRFOIL_SPEAKER':
					var volume = this.model.get('volume');
					var connected = this.model.get('connected') == 'true';
					$(this._stateNode).toggleClass('on', volume > 0 && connected);

					this._handleStateClick = function() {
						var volume = this.model.get('volume');
						var isOn = volume > 0;
						var connected = this.model.get('connected') == 'true';
						if (connected) {
							this.model.save({
							 	volume: isOn ? 0 : 60
							}, {patch: true});
						} else {
							this.model.save({
							 	volume: volume
							}, {patch: true});
						}
					}.bind(this);

					break;
				case 'ITUNES': 

					var state = this.model.get('state');
					$(this._stateNode).toggleClass('on', state == 'playing');

					this._handleStateClick = function() {
						var state = this.model.get('state');
						var newState;
						switch (state) {
							case 'stopped':
							case 'paused':
								newState = 'playing';
								break;
							case 'playing':
								newState = 'paused';
								break;
						}
						if (newState) {
							this.model.save({
							 	state: newState
							}, {patch: true});				
						}
					}.bind(this);

					break;
			}
		}

	});




});