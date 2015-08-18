define([
	'app/core/Model'
], function(
	Model
){


	return Model.extend({
		name: 'Device',
		idAttribute: "_id",


		url: function() {
			return localStorage.getItem('server') + 'api/devices/' + this.id;
		}



	});

});

