define([
	'jquery',
	'underscore',
	'backbone',
	'text!./Dashboard.html',
	'./actions/Action',
	'./dashboard/User'
], function(
	$,
	_,
	Backbone,
	templateString,
	Action,
	User
){
	

	
	

	return Backbone.View.extend({


	// Init
		name: 'Dashboard',
		fetchData: true,
		_userViews: {},
		_actionViews: {},

		initialize: function(args) {
			this.appModel = args.appModel;
			this.alarmsModel = this.appModel.alarmsModel;
			this.usersModel = this.appModel.usersModel;
			this.devicesModel = this.appModel.devicesModel;
			this.actionsModel = this.appModel.actionsModel;
			this.router = args.router;
			
			this._initializeTemplate();
			this._alarmTimeNode.addEventListener("click", _.bind(this._onAlarmTimeClick, this));
			this._alarmStatusNode.addEventListener("click", _.bind(this._onAlarmStatusClick, this));

			this.alarmsModel.on('change add remove reset sort destroy', this._onAlarmsModelChange.bind(this));

			this._addUsers();
			this.usersModel.on('add', _.bind(this._onUsersModelAdd, this));

			this._updateDevicesDisplay();
			this.devicesModel.on('change', _.bind(this._onDevicesModelChange, this));
			this.devicesModel.on('add', _.bind(this._onDevicesModelAdd, this));

			this._addActions();
			this.actionsModel.on('add', _.bind(this._onActionsModelAdd, this));
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
			};
			
		},
		
		
		
		
	// Public Functions

		show: function() {
			//console.log('show')
			//this._updateDisplay();
			this.$el.removeClass('hidden');
		},

		hide: function() {
			this.$el.addClass('hidden');
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

		_onAlarmsModelChange: function() {
			this._updateAlarmsDisplay();
		},

		_onUsersModelAdd: function(userModel) {
			this._addUser(userModel);
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




	// Private


		// Actions

		_addActions: function() {
			this.actionsModel.forEach(this._addAction.bind(this));
		},

		_addAction: function(actionModel) {
			this._actionViews[actionModel.get('_id')] = new Action({
				model: actionModel
			}).placeAt(this._actionsNode);
		},



		// Users

		_addUsers: function() {
			this.usersModel.forEach(this._addUser.bind(this));
		},

		_addUser: function(userModel) {
			this._userViews[userModel.get('_id')] = new User({
				userModel: userModel
			}).placeAt(this._usersNode);
		},



		// Alarms

		_updateAlarmsDisplay: function() {
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
			}
		},



		// Devices

		_updateDevicesDisplay: function() {
			//console.log('Update Display', this.devicesModel);

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

		}


	});


	
});