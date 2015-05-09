define([
	'jquery',
	'underscore',
	'backbone'
], function(
	$,
	_,
	Backbone
){


	return Backbone.Model.extend({

		idAttribute: "_id",


		url: function() {
			return SERVER + 'api/devices/' + this.id;
		},

		constructor: function(props) {

			// Add Display Type
			var displayType;
			switch (props.type) {
				case 'INDIGO_DIMMER':
					displayType = 'Dimmer'
					break;
				case 'INDIGO_MOTION_DETECTOR':
					displayType = 'Motion Detector'
					break;
				case 'INDIGO_SWITCH':
					displayType = 'Switch'
					break;
				case 'NEST_THERMOSTAT':
					displayType = 'Thermostat'
					break;
				case 'AIRFOIL_SPEAKER':
					displayType = 'Speaker'
					break;
				case 'ITUNES':
					displayType = 'Media Player'
					break;
				default:
					throw new Error('Unknown type ' + props.type + ' found in devices payload')
					break;
			}
			props.displayType = displayType;


			Backbone.Model.apply(this, arguments);
		},



	});

});

