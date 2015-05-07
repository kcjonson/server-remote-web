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
	


	var QUICK_ACTIONS = [
		{
			name: 'Turn Off Everything',
			condition: function(conditions) {
				return conditions.numLightsOn > 0;
			}
		},
		{
			name: 'Turn On All Lights',
			condition: function(conditions) {
				return conditions.numLightsOn !== conditions.numLights;
			}
		},
		{
			name: 'Set Movie Mood',
			condition: function(conditions) {
				// TODO: Motion Detected in tv room recently
				return true;
			}
		},
		{
			name: 'Set Bedtime Mood',
			condition: function(conditions) {
				// Todo: Motion detected in bedroom recently (need to install hardware)
				return new Date().getHours() > 17;
			}
		},
		{
			name: 'Play KEXP',
			condition: function(conditions) {
				return conditions.iTunesIsPlaying == false;
			}
		},
		{
			name: 'Pause Music',
			condition: function(conditions) {
				return conditions.iTunesIsPlaying == true;
			}
		},
		{
			name: 'Turn On Outside Lights',
			condition: function(conditions) {
				return conditions.isDaylight == false && conditions.numOutsideLightsOn < conditions.numOutsideLights;
			}
		},
		{
			name: 'Turn Off Outside Lights',
			condition: function(conditions) {
				return conditions.numOutsideLightsOn > 0;
			}
		}
	];
	
	

	return Backbone.View.extend({


	// Init
		name: 'Dashboard',
		fetchData: true,
		_userViews: {},

		initialize: function(args) {
			this.appModel = args.appModel;
			this.indigoModel = this.appModel.indigoModel;
			this.alarmsModel = this.appModel.alarmsModel;
			this.usersModel = this.appModel.usersModel;
			this.devicesModel = this.appModel.devicesModel;
			this.router = args.router;
			
			this._initializeTemplate();
			this._alarmTimeNode.addEventListener("click", _.bind(this._onAlarmTimeClick, this));
			this._alarmStatusNode.addEventListener("click", _.bind(this._onAlarmStatusClick, this));

			this.indigoModel.on('change', _.bind(this._onIndigoModelChange, this));
			this.alarmsModel.on('change add remove reset sort destroy', this._onAlarmsModelChange.bind(this));
			this.usersModel.on('change add remove reset sort destroy', _.bind(this._onUsersModelChange, this));
			this.devicesModel.on('all', _.bind(this._onDevicesModelAll, this));
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
			this._updateDisplay();
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

		_onIndigoModelChange: function(model) {
			//console.log('IndigoModel:change', model);
			this._updateDisplay();
		},

		_onAlarmsModelChange: function() {
			this._updateAlarmsDisplay();
		},

		_onUsersModelChange: function() {
			//console.log('UsersModel:change', model);
			this._updateUsersDisplay();
		},

		_onDevicesModelAll: function() {
			console.log('all')
		},




	// Private

		_updateUsersDisplay: function() {
			if (this._userViews) {
				for (property in this._userViews) {
					if (this._userViews.hasOwnProperty(property)) {
				        var userView = this._userViews[property];
				        var userId = userView.userModel.get('_id');
				        if (!this.usersModel.findWhere({'_id': userId})) {
				        	userView.remove();
				        	delete this._userViews[property]
				        }
				    }
				}
			}
			this.usersModel.forEach(function(userModel){
				var userId = userModel.get('_id');
				if (!this._userViews[userId]) {
					this._userViews[userId] = new User({userModel: userModel}).placeAt(this._usersNode);
				}
			}.bind(this));
		},

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

		_updateDisplay: function() {
			console.log('Update Display', this.devicesModel);


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


			// TODO
			var numThermostatsOn = 0;


			this._numLightsOnNode.innerHTML = numLightsOn;
			if (numThermostatsOn > 0) {
				this._thermostatsStatusNode.innerHTML = 'On'
			} else {
				this._thermostatsStatusNode.innerHTML = 'Off'
			}

			//var iTunesDevice = devicesCollection.findWhere({name: 'iTunes'});
			this._createActions({
				numLights: numLights,
				numLightsOn: numLightsOn,
				numOutsideLights: numOutsideLights,
				numOutsideLightsOn: numOutsideLightsOn,
				isDaylight: this._getVariable('isDaylight')
				//iTunesIsPlaying: iTunesDevice && iTunesDevice.get('displayRawState') == 'playing'
			});
		},

		_getVariable: function(variableName) {
			if (this.indigoModel) {
				var variables = this.indigoModel.get('variables');
				if (variables) {
					var variable = variables.findWhere({name: variableName});
					if (variable) {
						return variable.get('value');
					}
				}
			}
		},

		_createActions: function(conditions) {
			//console.log('_createActions');
			var actionsCollection = this.indigoModel.get('actions');
			QUICK_ACTIONS.forEach(function(action, index){
				isVisible = action.condition(conditions)
				if (isVisible && !action.view && index < 10) {
					var actionModel = actionsCollection.findWhere({name: action.name})
					//console.log(actionsCollection, action.name, actionModel);
					if (actionModel) {
						action.view = new Action({
							model: actionModel
						}).placeAt(this._actionsNode);
					}
				} else if (action.view && !isVisible) {
					action.view.remove();
					action.view = undefined;
				}
			}, this);
		}

	});


	
});