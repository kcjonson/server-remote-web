define([
	'app/core/Model',
], function(
	Model
){



	
	return Model.extend({
		idAttribute: '_id',
		url: function() {
			return SERVER + 'api/users/' + this.id;
		}
	});

});