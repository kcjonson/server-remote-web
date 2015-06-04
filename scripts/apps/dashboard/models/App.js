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


	var AppModel = function(options){
		this.options = options || {};
		this.initialize.apply(this, arguments);
	};

	_.extend(AppModel.prototype, Backbone.Events, {


		initialize: function () {

			console.log('/models/App.initialize()')

			this.alarmsModel = new AlarmsModel({id: '1'});
			this.alarmsModel.on("all", this._onModelAll.bind(this));

			this.devicesModel = new DevicesModel();
			this.devicesModel.on("all", this._onModelAll.bind(this));

			this.usersModel = new UsersModel();
			this.usersModel.on("all", this._onModelAll.bind(this));

			this.actionsModel = new ActionsModel();
			this.actionsModel.on("all", this._onModelAll.bind(this));

			this.settingsModel = new SettingsModel();
			this.settingsModel.on("all", this._onModelAll.bind(this));

			this.weatherModel = new WeatherModel();
			this.weatherModel.on("all", this._onModelAll.bind(this));
		},

		fetch: function(args) {
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
		},



	});




	return AppModel;



});