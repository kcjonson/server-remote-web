define([], function(){


	// Basic cookie handling.
	// Borrowed from http://www.quirksmode.org/js/cookies.html

	return {


		set: function(name, value, days) {
			if (days) {
				var date = new Date();
				date.setTime(date.getTime()+(days*24*60*60*1000));
				var expires = "; expires="+date.toGMTString();
			}
			else var expires = "";
			document.cookie = name+"="+value+expires+"; path=/";
		},

		get: function(name) {

			// This is a very partial implementation and will most
			// likely need to be expanded. -KCJ

			matches = document.cookie.match("(?:^|; )" + name + "=([^;]*)");
			cookieString = matches && matches[1];
			if (cookieString) {
				var value = decodeURIComponent(cookieString);
				value = value.split(':')[1].replace(/"/g,"");
				return value;
			}
		},

		delete: function(name) {
			createCookie(name,"",-1);
		}

	}

});