define([
	'app/core/Model',
], function(
	Model
){



	
	return Model.extend({
		name: 'user',
		idAttribute: '_id',
		url: function() {
			return localStorage.getItem('server') + 'api/users/' + this.id;
		}
	});

});