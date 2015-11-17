define([
	'jquery',
	'underscore',
	'backbone',
	'app/core/View',
	'app/models/App',
	'text!./Dashboard.html',
	'./actions/Action',
	'./dashboard/Users',
	'./dashboard/WeatherCondition'
], function(
	$,
	_,
	Backbone,
	View,
	Data,
	templateString,
	Action,
	Users,
	WeatherCondition
){
	
	

	return View.extend({


	// Init
		name: 'Dashboard',
		fetchData: true,
		_actionViews: {},
		_weatherConditionViews: {},
		templateString: templateString,
		attributes: {
			'class': 'scrollable'
		},

		dataSources: [
			Data.sources.ALARMS,
			Data.sources.WEATHER,
			Data.sources.ACTIONS,
			Data.sources.DEVICES
		],

		initialize: function(args) {
			this.appModel = args.appModel;
			this.alarmsModel = this.appModel.alarmsModel;
			this.devicesModel = this.appModel.devicesModel;
			this.actionsModel = this.appModel.actionsModel;
			this.weatherModel = this.appModel.weatherModel;
			this.router = args.router;
			View.prototype.initialize.call(this, args);

			// Users Display
			this._usersView = new Users({
				el: this._usersNode,
				usersModel: this.appModel.usersModel
			})

			// Weather
			this._weatherConditionViews.worst = new WeatherCondition({label: 'Worst'}).placeAt(this._weatherConditionsNode);
			this._weatherConditionViews.now = new WeatherCondition({label: 'Now'}).placeAt(this._weatherConditionsNode);
			this._weatherConditionViews.best = new WeatherCondition({label: 'Best'}).placeAt(this._weatherConditionsNode);

			// Alarm
			this._alarmTimeNode.addEventListener("click", _.bind(this._onAlarmTimeClick, this));
			this._alarmStatusNode.addEventListener("click", _.bind(this._onAlarmStatusClick, this));


			//this._updateDisplay();
		},

	
		
	
	// User Event Handlers


		_onAlarmTimeClick: function() {
			this.router.navigate('alarm', {trigger: true});
		},
	
		_onAlarmStatusClick: function() {
			var alarmModel = this.alarmsModel.at(0);
			if (alarmModel) {
				if (alarmModel.get('running')) {
					alarmModel.save({
						running: false
					}, {patch: true});
				} else {
					alarmModel.save({
						isOn: !alarmModel.get('isOn')
					}, {patch: true});
				};
			}
		},

		
	// Data Event Handlers

		_onDataLoaded: function() {
			this._updateDisplay();
			this.alarmsModel.on('change add remove reset sort destroy', this._onAlarmsModelChange.bind(this));
			this.devicesModel.on('change', _.bind(this._onDevicesModelChange, this));
			this.devicesModel.on('add', _.bind(this._onDevicesModelAdd, this));
			this.actionsModel.on('add', _.bind(this._onActionsModelAdd, this));
			this.weatherModel.on('change', this._onWeatherModelChange.bind(this));
		},

		_onAlarmsModelChange: function() {
			this._updateAlarmsDisplay();
		},

		_onDevicesModelAdd: function() {
			this._updateDevicesDisplay();
		},

		_onDevicesModelChange: function() {
			this._updateDevicesDisplay();
		},

		_onActionsModelAdd: function(actionModel) {
			this._addAction(actionModel);
		},

		_onWeatherModelChange: function() {
			this._updateWeatherDisplay()
		},




	// Private

		_updateDisplay: function() {
			this._updateDevicesDisplay();
			this._addActions();
			this._updateWeatherDisplay();
			this._updateAlarmsDisplay();
		},


		// Actions

		_addActions: function() {
			this.actionsModel.forEach(this._addAction.bind(this));
		},

		_addAction: function(actionModel) {
			if (!this._actionViews[actionModel.get('_id')]) {
				this._actionViews[actionModel.get('_id')] = new Action({
					model: actionModel
				}).placeAt(this._actionsNode);
			}
			$(this._actionsSectionNode).removeClass('hidden');
		},


		// Alarms

		_updateAlarmsDisplay: function() {
			if (Data.sources.ALARMS.loaded === true) {
				var alarmModel = this.alarmsModel.at(0);
				if (alarmModel) {
					var hour = alarmModel.get('hour');
					var minute = alarmModel.get('minute');
					var isOn = alarmModel.get('isOn');
					var isRunning = alarmModel.get('running');

					if (typeof hour === 'number' && typeof minute === 'number') {
						if (minute.toString().length < 2) {
							minute = "0" + minute;
						}
						this._alarmTimeNode.innerHTML = hour + ':' + minute;
					}	
					$(this._alarmIsOnNode).toggleClass('true', isOn);
					$(this._alarmIsOnNode).toggleClass('hidden', isRunning);
					$(this._alarmIsRunningNode).toggleClass('hidden', !isRunning);
					$(this._alarmSectionNode).removeClass('hidden');
				}
			}
		},



		// Devices

		_updateDevicesDisplay: function() {
			//console.log('Update Display', this.devicesModel);
			if (Data.sources.DEVICES.loaded === true) {

				var numLights = this.devicesModel.where({type: "INDIGO_DIMMER"}).length;

				var numLightsOn = this.devicesModel.filter(function(deviceModel){
					return deviceModel.get('type') === 'INDIGO_DIMMER'
					&& deviceModel.get('brightness') > 0;
				}).length;

				var numOutsideLights = this.devicesModel.filter(function(deviceModel){
					return deviceModel.get('type') === 'INDIGO_DIMMER' 
						&& deviceModel.get('name').indexOf('Outside') > -1;
				}).length;

				var numOutsideLightsOn = this.devicesModel.filter(function(deviceModel){
					return deviceModel.get('type') === 'INDIGO_DIMMER' 
						&& deviceModel.get('brightness') > 0 
						&& deviceModel.get('name').indexOf('Outside') > -1;
				}).length;

				this._numLightsOnNode.innerHTML = numLightsOn;

				// TODO
				var numThermostatsOn = 0;
				
				if (numThermostatsOn > 0) {
					this._thermostatsStatusNode.innerHTML = 'On'
				} else {
					this._thermostatsStatusNode.innerHTML = 'Off'
				}

				$(this._devicesSectionNode).removeClass('hidden');
			}

		},


		// Weather

		_updateWeatherDisplay: function() {
			//console.log(Data.sources.WEATHER, Data.sources.WEATHER.loaded);
			if (Data.sources.WEATHER.loaded === true && this._weatherConditionViews.worst) {
				var todaysForecast = this.weatherModel.get('todaysForecast')
				this._weatherConditionViews.worst.setData(this.weatherModel.get('hourlyWorst'), todaysForecast);
				this._weatherConditionViews.now.setData(this.weatherModel.get('currently'), todaysForecast);
				this._weatherConditionViews.best.setData(this.weatherModel.get('hourlyBest'), todaysForecast);
				$(this._weatherSectionNode).removeClass('hidden');
			}

		}


	});


	
});