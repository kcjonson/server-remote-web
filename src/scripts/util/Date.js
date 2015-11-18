define([], function(){


	var second = 1000;
	var minute = second * 60;
	var hour = minute * 60;
	var day = hour * 24;


	return {

		formatRelativeDate: function(relativeDate) {

			var relativeString;

			relativeDate = new Date(relativeDate);
			var relativeTime = relativeDate.getTime();
			var nowDate = new Date();
			var nowTime = nowDate.getTime();
			var deltaTime = nowTime - relativeTime;

			if (deltaTime > minute) {
				if (deltaTime > hour) {
					if (deltaTime > day) {
						relativeString = Math.round(deltaTime / day) + 'd';
					} else {
						relativeString = Math.round(deltaTime / hour) + 'h';
					}
				} else {
					relativeString = Math.round(deltaTime / minute) + 'm';
				}
			} else {
				relativeString = Math.round(deltaTime / second) + 's';
			}
			return relativeString;
		},

		formatClockTime: function(date) {
			date = new Date(date);
			var hour = date.getHours();
			var minute = date.getMinutes()
			if (typeof hour === 'number' && typeof minute === 'number') {
				if (minute.toString().length < 2) {
					minute = "0" + minute;
				}
				return hour + ':' + minute;
			}
		},

		isToday: function(date) {
			var now = new Date();
			var then = new Date(date);
			return (now.getDate() == then.getDate() 
			        && now.getMonth() == then.getMonth()
			        && now.getFullYear() == then.getFullYear())
		}
	}

});