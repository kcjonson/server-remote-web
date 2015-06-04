define([
	'jquery',
	'underscore',
	'backbone',
	'app/View',
	'text!./WeatherCondition.html',
	'app/util/Date',
	'app/util/Weather'
], function(
	$,
	_,
	Backbone,
	View,
	templateString,
	DateUtil,
	WeatherUtil
){



	return View.extend({

		// Init
		name: 'WeatherCondition',
		templateString: templateString,
		tagName: "li",

		initialize: function(args) {
			View.prototype.initialize.call(this);
			this._labelNode.innerHTML = args.label;
		},

		setData: function(hourData, dayData) {
			
			if (hourData && dayData) {
				this._temperatureNode.innerHTML = Math.round(hourData.apparentTemperature);
				this._timeNode.innerHTML = DateUtil.formatClockTime(hourData.time * 1000)
				this._conditionNode.className = WeatherUtil.getIconFromData(hourData, dayData)+ ' wi condition'
			}
		}



	});
});