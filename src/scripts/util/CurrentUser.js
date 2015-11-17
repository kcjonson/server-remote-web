define([
	'jquery'
], function(
	$
){


	// TODO: Depricate this file.


	return {


		authenticate: function(callback) {
			console.log('auth', localStorage.getItem('server') + 'api/users/current')
			$.ajax({
				url: localStorage.getItem('server') + 'api/users/current',
				timeout: 6000,
				success: function(response){
					if (!response.error) {
						callback(response);
					} else {
						callback(response)
					}
				}.bind(this)
			}).error(callback);
		},

	}


	
});