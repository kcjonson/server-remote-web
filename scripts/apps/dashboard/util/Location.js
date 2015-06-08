define([
	'jquery',
	'./Detect',
	'./CurrentUser'
], function(
	$,
	Detect,
	CurrentUserUtil
){


	var WATCH_ID;


	return {

		get: function() {

		},

		watch: function() {
			if (Detect.has('cordova') && !WATCH_ID) {
				var options = { enableHighAccuracy: true };
       			WATCH_ID = navigator.geolocation.watchPosition(this._onWatchPositionSuccess.bind(this), this._onWatchPositionError.bind(this), options);
			}
		},

		_onWatchPositionSuccess: function(position) {
			console.log('wp', position);

			var userModel = CurrentUserUtil.getModel();
			if (userModel) {
				$.ajax({
					url: SERVER + 'api/users/' + userModel.get('_id') + '/checkins',
					type: 'POST',
					data: position
				});
			}

		},

		_onWatchPositionError: function(err) {
			console.log(err)
		}

	}

});