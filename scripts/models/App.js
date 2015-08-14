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
			if (!!window.EventSource && !this._eventModelDataSource) {
				console.log('Starting API EventSource Stream')

				// Set up the EventSource (this opens the connection)
				this._eventModelDataSource = new EventSource(localStorage.getItem('server') + 'api');

				// Model Data Event
				// On first load we're going to stream the whole payload from 
				// all the various models that we need, then close the connection.
				var modelsLoaded = 0;
				var modelsToLoad = Object.keys(MODEL_CONSTRUCTORS).length;
				this._eventModelDataSourceListener = this._eventModelDataSource.addEventListener('modeldata', function(e) {
					var data = JSON.parse(e.data);
					var model = ENDPOINT_TO_MODEL_MAP[localStorage.getItem('server') + data.endpoint];

					console.log(e);

					// Since actually returning a 500 for unexpected errors on the backend
					// doesn't allow us to send any payload describing what the error actually 
					// was, we send 200 and attach an error field to the payload with more info.
					if (data.status === 200) {
						if (data.error && data.endpoint) {
							console.error('The data api encountered an error with endpoint ' + data.endpoint + ': ' + data.error)
						} else {
							model.set(data.payload);
							modelsLoaded += 1;
							if (modelsLoaded == modelsToLoad) {
								this.trigger('sync:all');  // Very important, main trigger for App startup!
								this._eventModelDataSource.removeEventListener('modeldata', this._eventModelDataSourceListener);

								// Model Push Event
								// We're leaving the same connection open that we initally use
								// and just listening to push events that contain partial data.
								// Backbone is doing the hard work and doing the merge and firing
								// the correct change events (if applicable) for us.
								this._eventModelPushSourceListener = this._eventModelDataSource.addEventListener('modelpush', function(e) {
									var data = JSON.parse(e.data);
									var model = ENDPOINT_TO_MODEL_MAP[localStorage.getItem('server') + data.endpoint];
									model.set(data.payload, {remove: false});
								}.bind(this), false);
							};
						}
					} else {
						console.error('The data api recieved an error code: ' + data.status);
					}
				}.bind(this), false);

				// Error Handler
				// Most routes make a call for "fetch" so there is a high chance that
				// this will get re-attached if the connection was dropped.
				this._eventModelDataSource.addEventListener('error', function(e) {
					console.error('An error occured with the api data source')
					// TODO: Use a regular get request to get real error info 
					// we don't know what the error code is!
					this._eventModelDataSource.close();
					this._eventModelDataSource = undefined;
				}.bind(this), false);

			} else if (this._eventModelDataSource) {
				console.log('Event Source Still Active');
			} else {
				console.log('Manually initiating fetch');
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
			}
		},

		_onModelAll: function(eventName) {
			console.log('_onModelAll', eventName, arguments);
			// Proxy Events From Models
			this.trigger(eventName, arguments);
		}

	});


	return AppModel;

});