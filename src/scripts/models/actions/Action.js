define([
	'app/core/Model'
], function(
	Model
){

	
	return Model.extend({
		name: 'Action',
		urlRoot: localStorage.getItem('server') + 'api/actions',
		idAttribute: '_id',
		execute: function() {
			$.post(localStorage.getItem('server') + 'api/actions/execute/' + this.get('_id'), {}).done(function(){
				console.log('success')
			}).fail(function(){
				console.log('fail')
			});
		}


	});

});