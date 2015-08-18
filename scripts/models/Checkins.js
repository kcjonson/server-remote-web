define([
	'app/core/Model'
], function(
	Model
){


	
	return Model.extend({
		name: 'checkins',
		url: function() {
			return localStorage.getItem('server') + '/api/checkins'
		}
	
	});

});