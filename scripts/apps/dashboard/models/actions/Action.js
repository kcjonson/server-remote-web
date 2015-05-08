define([
	'jquery',
	'underscore',
	'backbone'
], function(
	$,
	_,
	Backbone
){
	
	return Backbone.Model.extend({
		urlRoot: SERVER + 'api/actions',
		idAttribute: '_id',
		execute: function() {
			$.post(SERVER + 'api/actions/execute/' + this.get('_id'), {}).done(function(){
				console.log('success')
			}).fail(function(){
				console.log('fail')
			});
		}
	});

});