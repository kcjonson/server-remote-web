define([], function(){


	var second = 1000;
	var minute = second * 60;
	var hour = minute * 60;
	var day = hour * 24;


	return {

		formatRelativeDate: function(time){
			var d = new Date((time || "").replace(/-/g,"/").replace(/[TZ]/g," "))
			var diff = Math.abs(((new Date()).getTime() - d.getTime()) / 1000);
			var day_diff = Math.floor(diff / 86400);
					
			if ( isNaN(day_diff) || day_diff < 0 || day_diff >= 31 )
				return;
					
			return day_diff == 0 && (
					diff < 60 && "just now" ||
					diff < 120 && "1 minute ago" ||
					diff < 3600 && Math.floor( diff / 60 ) + " minutes ago" ||
					diff < 7200 && "1 hour ago" ||
					diff < 86400 && Math.floor( diff / 3600 ) + " hours ago") ||
				day_diff == 1 && "Yesterday" ||
				day_diff < 7 && day_diff + " days ago" ||
				day_diff < 31 && Math.ceil( day_diff / 7 ) + " weeks ago";
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