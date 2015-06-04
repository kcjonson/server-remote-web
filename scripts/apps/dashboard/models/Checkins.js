define([
	'app/core/Model'
], function(
	Model
){


	
	return Model.extend({

		url: function() {
			return SERVER + '/api/checkins'
		}
	
	});

});