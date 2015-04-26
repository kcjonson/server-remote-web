define([
	'jquery',
	'underscore',
	'backbone',
	'app/models/Indigo',
	'app/models/Alarms',
], function(
	$,
	_,
	Backbone,
	IndigoModel,
	AlarmsModel
){


	var AppModel = function(options){
		this.options = options || {};
		this.initialize.apply(this, arguments);
	};

	_.extend(AppModel.prototype, Backbone.Events, {


		initialize: function () {
			this.indigoModel = new IndigoModel({id: '1'});
			this.indigoModel.on("all", this._onModelAll.bind(this));

			this.alarmsModel = new AlarmsModel({id: '1'});
			this.alarmsModel.on("all", this._onModelAll.bind(this));
		},

		fetch: function(args) {
			this.alarmsModel.fetch(args);
			this.indigoModel.fetch(args);
		},

		_onModelAll: function(eventName) {
			//console.log('_onModelAll', eventName, arguments);
			// Proxy Events From Models
			this.trigger(eventName, arguments);
		},



	});




	return AppModel;



});