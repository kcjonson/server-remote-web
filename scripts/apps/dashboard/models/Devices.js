define([
	'jquery',
	'underscore',
	'backbone',
	'app/models/devices/IndigoDimmer',
	'app/models/devices/IndigoMotionDetector',
	'app/models/devices/IndigoSwitch',
	'app/models/devices/NestThermostat',
	'app/models/devices/PortholeSpeaker',
	'app/models/devices/ITunes'
], function(
	$,
	_,
	Backbone,
	IndigoDimmerModel,
	IndigoMotionDetectorModel,
	IndigoSwitchModel,
	NestThermostatModel,
	PortholeSpeakerModel,
	ITunesModel
){
	
	return Backbone.Collection.extend({

		url: function() {
			return SERVER + 'api/devices'
		},

		model: function(attrs, options) {
			var model;
			switch (attrs.type) {
				case 'INDIGO_DIMMER':
					model = new IndigoDimmerModel(attrs, options);
					break;
				case 'INDIGO_MOTION_DETECTOR':
					model = new IndigoMotionDetectorModel(attrs, options);
					break;
				case 'INDIGO_SWITCH':
					model = new IndigoSwitchModel(attrs, options);
					break;
				case 'NEST_THERMOSTAT':
					model = new NestThermostatModel(attrs, options);
					break;
				case 'PORTHOLE_SPEAKER':
					model = new PortholeSpeakerModel(attrs, options);
					break;
				case 'ITUNES':
					model = new ITunesModel(attrs, options);
					break;
				default:
					throw new Error('Unknown type ' + attrs.type + ' found in devices payload', attrs.type)
					break;
			}
			return model;
		},

		comparator: function(model) {
    		return model.get('name');
		}
	
	});

});