define([
	'jquery',
	'underscore',
	'backbone',
	'app/models/Alarms',
	'app/models/Devices',
	'app/models/Users',
	'app/models/Actions',
	'app/models/Settings',
	'app/models/Weather'
], function(
	$,
	_,
	Backbone,
	AlarmsModel,
	DevicesModel,
	UsersModel,
	ActionsModel,
	SettingsModel,
	WeatherModel
){


	var MODEL_CONSTRUCTORS = {
		'alarmsModel': AlarmsModel,
		'devicesModel': DevicesModel,
		'usersModel': UsersModel,
		'actionsModel': ActionsModel,
		'settingsModel': SettingsModel,
		'weatherModel': WeatherModel
	}

	var ENDPOINT_TO_MODEL_MAP = {};


	var AppModel = function(options){
		this.options = options || {};
		this.initialize.apply(this, arguments);
	};

	_.extend(AppModel.prototype, Backbone.Events, {


		initialize: function () {


			for (var key in MODEL_CONSTRUCTORS) {
				if (MODEL_CONSTRUCTORS.hasOwnProperty(key)) {
					this[key] = new MODEL_CONSTRUCTORS[key]();
					this[key].on("all", this._onModelAll.bind(this));
					ENDPOINT_TO_MODEL_MAP[this[key].url()] = this[key];
				};
			}
		},

		fetch: function(args) {


			// var modelsLoaded = 0;
			// var modelsToLoad = Object.keys(MODEL_CONSTRUCTORS).length;
			// if (!!window.EventSource && !this._eventSource) {
			// 	this._eventSource = new EventSource(SERVER + 'api');

			// 	this._eventSource.addEventListener('modeldata', function(e) {
			// 		//console.log('Model Data', e.data);
			// 		var data = JSON.parse(e.data);
			// 		var model = ENDPOINT_TO_MODEL_MAP[SERVER + data.endpoint];
			// 		model.set(data.payload);
			// 		modelsLoaded += 1;
			// 		if (modelsLoaded == modelsToLoad) {
			// 			this.trigger('sync:all');
			// 			this._eventSource.close();
			// 		}
			// 	}.bind(this), false);

			// 	this._eventSource.addEventListener('error', function(e) {
			// 		this._eventSource.close();
			// 	}.bind(this), false);
			// };


			$.when(
				this.alarmsModel.fetch(args),
				this.devicesModel.fetch(args),
				this.usersModel.fetch(args),
				this.actionsModel.fetch(args),
				this.settingsModel.fetch(args),
				this.weatherModel.fetch(args)
			).done(function(){
				this.trigger('sync:all');
			}.bind(this))
		},

		_onModelAll: function(eventName) {
			//console.log('_onModelAll', eventName, arguments);
			// Proxy Events From Models
			this.trigger(eventName, arguments);
		}


	});




	return AppModel;



});