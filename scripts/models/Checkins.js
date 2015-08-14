define([
	'app/core/Model'
], function(
	Model
){


	
	return Model.extend({

		url: function() {
			return localStorage.getItem('server') + '/api/checkins'
		}
	
	});

});