define([
	'jquery',
	'underscore',
	'backbone',
	'text!./Alarm.html'
], function(
	$,
	_,
	Backbone,
	templateString
){


	return Backbone.View.extend({


	// Init
		name: 'Alarm',
		fetchData: false,

		initialize: function(args) {
			this.appModel = args.appModel;
			this.alarmsModel = this.appModel.alarmsModel;
			this._initializeTemplate();
			this.alarmsModel.on('change', this._onAlarmsModelChange.bind(this));
		},
		
		_initializeTemplate: function() {
		
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
				$('[data-adjust-time]', this.$el).each(_.bind(function(index, adjustTimeNode){
					adjustTimeNode.addEventListener("click", _.bind(this._onAdjustTimeClick, this, adjustTimeNode));
				}, this));
			};
			
		},



	// Public Functions

		show: function() {
			//console.log('show')
			this._updateDisplay();
			this.$el.removeClass('hidden');
		},

		hide: function() {
			this.$el.addClass('hidden');
		},

	// Private Events

		_onAdjustTimeClick: function(node) {

			var alarmModel = this.alarmsModel.at(0);
			if (alarmModel) {

				var type = node.dataset.adjustType;
				var value = parseInt(node.dataset.adjustValue, 10);
				var date = this._getDateFromModel();

				switch (type) {
					case 'hours':
						date.setHours(date.getHours() + value);
						break;
					case 'minutes':
						date.setMinutes(date.getMinutes() + value);
						break;
				}

				alarmModel.save({
					hour: date.getHours(),
					minute: date.getMinutes(),
					isOn: true
				}, {patch: true})
			}

		},

		_onAlarmsModelChange: function() {
			this._updateDisplay();
		},


	// Private Functions

		_updateDisplay: function() {
			var date = this._getDateFromModel();
			var hour = date.getHours();
			var minute = date.getMinutes();
			if (minute.toString().length < 2) {
				minute = "0" + minute;
			}
			this._timeNode.innerHTML = hour + ":" + minute;
		},

		_getDateFromModel: function() {
			var date;
			var alarmModel = this.alarmsModel.at(0);
			if (alarmModel) {
				date = new Date();
				date.setMinutes(alarmModel.get('minute'));
				date.setHours(alarmModel.get('hour'));
			}
			return date;
		}



	});


	
});