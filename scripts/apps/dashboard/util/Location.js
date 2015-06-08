define([
	'jquery',
	'underscore',
	'./Detect',
	'./CurrentUser'
], function(
	$,
	_,
	Detect,
	CurrentUserUtil
){


	var WATCH_ID;


	return {

		get: function() {

		},

		watch: function() {
			if (Detect.has('cordova') && !WATCH_ID) {
				console.log('Starting to watch position');
				var options = { enableHighAccuracy: true };
       			WATCH_ID = navigator.geolocation.watchPosition(_.throttle(this._onWatchPositionSuccess.bind(this), 60000), this._onWatchPositionError.bind(this), options);
			}
		},

		_onWatchPositionSuccess: function(position) {
			var userModel = CurrentUserUtil.getModel();
			if (userModel) {
				$.ajax({
					url: SERVER + 'api/users/' + userModel.get('_id') + '/checkins',
					type: 'POST',
					data: position
				});
			};
		},

		_onWatchPositionError: function(err) {
			console.log(err)
		}

	}

});