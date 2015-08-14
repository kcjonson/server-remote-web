define([], function(){


	var ICON_MAP = {
		day: {
			'clear-day': 'wi-day-sunny',
			'clear-night': 'wi-day-sunny',
			'rain': 'wi-day-rain',
			'snow': 'wi-day-snow',
			'sleet': 'wi-day-rain-mix',
			'wind': 'wi-cloudy-gusts',
			'fog': 'wi-day-fog',
			'cloudy': 'wi-cloudy',
			'partly-cloudy-day': 'wi-day-cloudy',
			'partly-cloudy-night': 'wi-day-cloudy'
		},
		night: {
			'clear-day': 'wi-night-clear',
			'clear-night': 'wi-night-clear',
			'rain': 'wi-night-alt-rain',
			'snow': 'wi-night-alt-snow',
			'sleet': 'wi-night-alt-rain-mix',
			'wind': 'wi-night-alt-cloudy-gusts',
			'fog': 'wi-fog',
			'cloudy': 'wi-cloudy',
			'partly-cloudy-day': 'wi-night-alt-cloudy',
			'partly-cloudy-night': 'wi-night-alt-cloudy'
		}
	}



	return {

		getIconFromData: function(hourData, dayData) {
			var isDaylight = this.getIsDaylightFromData(dayData, hourData.time * 1000);
			return ICON_MAP[isDaylight == true ? 'day' : 'night'][hourData.icon];
		},

		getIsDaylightFromData: function(dayData, date) {
			date = date ? new Date(date) : new Date();
			var sunrise = new Date(dayData.sunriseTime * 1000);
			var sunset = new Date(dayData.sunsetTime * 1000);
			return ((date >= sunrise) && (date <= sunset));
		}
		
	}

});