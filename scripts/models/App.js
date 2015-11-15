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


	// App Data
	//
	//	TODO: Make this a global singleton
	//
	// Data Sources have three main states:
	// - Loaded: The inital load completed successfully at least once
	// - Disabled: The server reported that the endpoint is disabled
	// - New (implicit): If the source is neither loaded or disabled
	//		we just assume that we have not heard back yet.


	// TODO: Load these dynamically ... 
	var DATA_SOURCES =  {
		'ACTIONS': {
			name: 'actions',
			id: 'ACTIONS',
			constructor: ActionsModel,
			enabledProperty: 'actionsEnabled'
		},
		'ALARMS': {
			name: 'alarms',
			id: 'ALARMS',
			constructor: AlarmsModel,
			enabledProperty: 'alarmsEnabled'
		},
		'DEVICES': {
			name: 'devices',
			id: 'DEVICES',
			constructor: DevicesModel,
			enabledProperty: 'devicesEnabled'
		},
		'SETTINGS': {
			name: 'settings',
			id: 'SETTINGS',
			constructor: SettingsModel,
			enabledProperty: 'settingsEnabled'
		},
		'USERS': {
			name: 'users',
			id: 'USERS',
			constructor: UsersModel,
			enabledProperty: 'usersEnabled'
		},
		'WEATHER': {
			name: 'weather',
			id: 'WEATHER',
			constructor: WeatherModel,
			enabledProperty: 'weatherEnabled'
		}
	}

	// Allows us to map data returning from the
	// backend to the appropriate model.
	var ENDPOINT_TO_SOUCE_MAP = {};


	var AppModel = function(options){
		this.options = options || {};
		this.initialize.apply(this, arguments);
	};



	_.extend(AppModel.prototype, Backbone.Events, {

		// So, since we're streaming the results, and we want them
		// as fast as possible, we're not going to wait for the settings
		// to load, which will tell us exactly what services are available.
		// We're just going to fire off requests for everything, then
		// do our best to make sense of it all later.

		initialize: function () {
			Object.keys(DATA_SOURCES).forEach(function(key){
				var dataSource = DATA_SOURCES[key];
				dataSource.model = new dataSource.constructor();
				this[dataSource.name + 'Model'] = dataSource.model;  // TODO: Replace with getter
				dataSource.model.on("all", this._onModelAll.bind(this));
				var url = dataSource.model.url();
				url = url.replace(localStorage.getItem('server'), '');
				ENDPOINT_TO_SOUCE_MAP[url] = dataSource;
			}.bind(this));
			DATA_SOURCES.SETTINGS.model.on('change', this._onSettingsChange.bind(this))
		},

		// This is slightly misnamed, if the call for fetch happens and the stream is already open
		// it essentially does nothing because its allreaded initiated and listening for data.
		// the private _fetch function does a manual force.
		fetch: function(args) {
			if (!!window.EventSource && !this._eventModelDataSource) {
				console.log('Starting API EventSource Stream')

				// Set up the EventSource (this opens the connection)
				this._eventModelDataSource = new EventSource(localStorage.getItem('server') + 'api');

				// Model Data Event
				// On first load we're going to stream the whole payload from 
				// all the various models that we need, then close the connection.
				this._eventModelDataSourceListener = this._eventModelDataSource.addEventListener('modeldata', function(e) {
					var data = JSON.parse(e.data);
					var dataSource = ENDPOINT_TO_SOUCE_MAP[data.endpoint];
					if (dataSource) {
						var model = dataSource.model;

						// Since actually returning a 500 for unexpected errors on the backend
						// doesn't allow us to send any payload describing what the error actually 
						// was, we send 200 and attach an error field to the payload with more info.
						if (data.status === 200) {
							if (data.error && data.endpoint) {
								console.error('The data api encountered an error with endpoint ' + data.endpoint + ': ' + data.error)
								this.trigger('error', model)
								this.trigger('error:' + model.name , model);
							} else {
								//console.log('loaded:', model.name)
								model.set(data.payload);
								dataSource.loaded = true;
								this.trigger('load', model)
								this.trigger('load:' + model.name , model);
								

								// Model Push Event
								// We're leaving the same connection open that we initally use
								// and just listening to push events that contain partial data.
								// Backbone is doing the hard work and doing the merge and firing
								// the correct change events (if applicable) for us.
								this._eventModelPushSourceListener = this._eventModelDataSource.addEventListener('modelpush', function(pushEvent) {
									if (pushEvent && pushEvent.data) {
										var pushData = JSON.parse(pushEvent.data);
										var pushEndpoint = ENDPOINT_TO_SOUCE_MAP[localStorage.getItem('server') + pushData.endpoint];
										if (pushEndpoint) {
											pushEndpoint.model.set(pushData.payload, {remove: false});
										};
									} else {
										console.error('There was an error with the modelpush payload')
										// TODO: Further error handling?
									}
								}.bind(this), false);
							}
						} else {
							console.error('The data api recieved an error code: ' + data.status);
							this.trigger('error', model)
							this.trigger('error:' + model.name , model);
						}
					} else {
						console.error('The data api encountered an unknown error ');
					}
				}.bind(this), false);

				// Error Handler
				// Most routes make a call for "fetch" so there is a high chance that
				// this will get re-attached if the connection was dropped.
				this._eventModelDataSource.addEventListener('error', function(e) {
					console.debug('An error occured with the api data source, initiating manual fetch')
					this._eventModelDataSource.close();
					this._eventModelDataSource = undefined;
					this._fetch(args);
				}.bind(this), false);
			} else if (this._eventModelDataSource) {
				console.debug('App model event source still active, ignoring fetch call');
			} else {
				// Browser does not suport EventSouce object, manually fetch.
				this._fetch(args);
			}
		},

		require: function(dataSources) {
			return $.when.apply($, dataSources.map(function(dataSource){
				var sourceDeferred = $.Deferred();
				if (dataSource.disabled || dataSource.loaded) {
					sourceDeferred.resolve(dataSource.model);
				} else {
					var n = dataSource.name;
					this.once('load:'+n+' disable:'+n+' error:'+n, function(){
						sourceDeferred.resolve(dataSource.model)
					});
				};
				return sourceDeferred.promise();
			}.bind(this)));
		},

		_onSettingsChange: function() {
			// Views are listening to see if a data source that they require
			// is disabled so they don't keep waiting for data that will never come.
			Object.keys(DATA_SOURCES).forEach(function(key){
				var dataSource = DATA_SOURCES[key];
				var enabled = DATA_SOURCES.SETTINGS.model.get(dataSource.enabledProperty);
				if (dataSource.enabled !== enabled) {
					if (enabled === false) {
						this.trigger('disable:' + dataSource.name, dataSource.model);
					}
					dataSource.enabled = enabled;
				}
			}.bind(this));
		},

		_onModelAll: function(eventName) {
			//console.log('_onModelAll', eventName, arguments);
			// Proxy Events From Models
			this.trigger(eventName, arguments);
		},

		_fetch: function(args) {
			console.log('Manually initiating fetch');
			$.when(
				this.alarmsModel.fetch(args),
				this.devicesModel.fetch(args),
				this.usersModel.fetch(args),
				this.actionsModel.fetch(args),
				this.settingsModel.fetch(args),
				this.weatherModel.fetch(args)
			).done(function(){
				this.trigger('load:all');
			}.bind(this))
		}

	});


	AppModel.sources = DATA_SOURCES;

	return AppModel;

});