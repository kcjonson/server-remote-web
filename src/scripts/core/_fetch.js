define([
	'app/util/Error',
], function(
	errorUtil
){

	// This mixin creates a pool of requrests for Collections and models.
	// Its purpose is to cancel all current requests when one encounters an error.
	// The pool is stored in window._fetchPool, which is admittedly bad (because globals)

	return {

		initialize: function() {
			this.on('error', function(collection, res, options){
				switch (res.status) {
					case 200:
						// Everything is fine, nothing to see here!
						break;
					case 0:
						// Thrown from the abort call.  Possibly elsewhere? -KCJ
						break;
					case 401: 
						// Unathorized.
						errorUtil.show(401);
						break;
					default:
						errorUtil.show(res.responseText || res.statusText || res.status);
				}
			})
		},


		fetch: function() {
			var xhr = Backbone.Model.prototype.fetch.apply(this, arguments);
			if (!window._fetchPool) {window._fetchPool = []};
			window._fetchPool.push(xhr);
			xhr.fail(function(){
				window._fetchPool.forEach(function(poolXhr){
					poolXhr.abort();
				}.bind(this))
			}.bind(this));
			xhr.always(function(xhr) {
				var index = window._fetchPool.indexOf(xhr);
				if (index >= 0) {
					window._fetchPool.splice(index, 1);
				}
			});
			return xhr;
		},

		parse: function(res, req) {
			if (res.error) {
				errorUtil.show(res.error);
				delete res.error;
			}
			return res;
		}
	}

});