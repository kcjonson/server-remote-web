define([
	'jquery',
	'underscore',
	'backbone',
	'app/models/indigo/Variable',
	'app/models/indigo/Variables',
	'app/models/indigo/Action',
	'app/models/indigo/Actions',
	'app/models/indigo/Device',
	'app/models/indigo/Devices',
	'backbone-relational'
], function(
	$,
	_,
	Backbone,
	Variable,
	Variables,
	Action,
	Actions,
	Device,
	Devices
){


	var POLL_TIME = 5000;

	
	return Backbone.RelationalModel.extend({

		pollingEnabled: true,

		initialize: function() {
			this.once('sync', function() {
				setTimeout(function(){
					this.fetch();
				}.bind(this), POLL_TIME)
			});
		},

		fetch: function() {
			if (this._pollTimeout) {
				clearTimeout(this._pollTimeout)
			}
			if (this.pollingEnabled) {
				this.once('sync', function() {
					this._pollTimeout = setTimeout(function(){
						this.fetch();
					}.bind(this), POLL_TIME)
				});
			}
			Backbone.RelationalModel.prototype.fetch.call(this);
		},

		url: function() {
			return SERVER + 'api/indigo'
		},

		relations: [
			{
				key: 'variables',
				type: Backbone.HasMany,
				collectionType: Variables,
				relatedModel: Variable
			},
			{
				key: 'actions',
				type: Backbone.HasMany,
				collectionType: Actions,
				relatedModel: Action
			},
			{
				key: 'devices',
				type: Backbone.HasMany,
				collectionType: Devices,
				relatedModel: Device
			}
		]

	
	});

});