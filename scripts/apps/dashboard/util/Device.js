define([], function(){


	return {
		getIconFromType: function(type) {
			var icon;
			switch (type) {
				case "INDIGO_DIMMER":
					icon = 'icon fa fa-lightbulb-o';
					break;
				case 'NEST_THERMOSTAT':
					icon = 'icon fa fa-fire';
					break;
				case 'INDIGO_SWITCH': 
					icon = 'smaller icon fa fa-adjust';
					break;
				case 'PORTHOLE_SPEAKER':
					icon = 'icon fa fa-volume-up'
					break;
				case 'INDIGO_MOTION_DETECTOR':
					icon = 'icon fa fa-bullseye'
					break;
				case 'ITUNES':
					icon = 'icon fa fa-play-circle-o'
					break;
			}
			return icon;
		}
	}

});