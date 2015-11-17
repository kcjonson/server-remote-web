define([
	'app/core/Model',
	'app/util/Date'
], function(
	Model,
	DateUtil
){


	function _getHourlyExtremes(hourlyData) {
		var extremesData = {};
		if (hourlyData && hourlyData.data && hourlyData.data.forEach) {
			extremesData = {
				worst: hourlyData.data[0],
				best: hourlyData.data[0]
			}
			hourlyData.data.forEach(function(hourData){
				if (DateUtil.isToday(hourData.time * 1000)) {

					// Look for worst
					if (hourData.precipIntensityMax > extremesData.worst.precipIntensityMax) {
						extremesData.worst = hourData;
					} else if (hourData.precipIntensityMax == extremesData.worst.precipIntensityMax) {
						if(hourData.apparentTemperature < extremesData.worst.apparentTemperature) {
							extremesData.worst = hourData;
						}
					}

					// Look for best
					if (hourData.precipIntensityMax < extremesData.best.precipIntensityMax) {
						extremesData.best = hourData;
					} else if (hourData.precipIntensityMax == extremesData.best.precipIntensityMax){
						if (hourData.apparentTemperature > extremesData.best.apparentTemperature) {
							extremesData.best = hourData;
						}
					}

				}
			});
		}
		return extremesData;
	}


	return Model.extend({
		name: 'weather',
		idAttribute: '_id',
		urlRoot: localStorage.getItem('server') + 'api/weather',

		hourlyWorst: function() {
			return _getHourlyExtremes(this.get('hourly')).worst
		},

		hourlyBest: function() {
			return _getHourlyExtremes(this.get('hourly')).best
		},

		todaysForecast: function() {
			var dailyData = this.get('daily');
			var now = new Date();
			var forecast;
			if (dailyData && dailyData.data && dailyData.data.forEach) {
				dailyData.data.forEach(function(data){
					if (DateUtil.isToday(data.time * 1000)) {
						forecast = data;
					}
				})
			}
			return forecast;
		}


	});

});