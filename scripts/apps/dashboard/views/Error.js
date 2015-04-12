define([
	'jquery',
	'underscore',
	'backbone',
	'text!./Error.html',
	'app/util/Error'
], function(
	$,
	_,
	Backbone,
	templateString,
	ErrorUtil
){
	
	return Backbone.View.extend({


	// Init

		name: 'Error',
		darkBackground: true,
		hideHeader: true,
		hideNavigation: true,
		fetchData: false,

		initialize: function(args) {
			this.router = args.router;			
			this._initializeTemplate();
		},

		
		_initializeTemplate: function() {
		
			// Consume template string
			if (templateString) {
				var templateDom = _.template(templateString);
				this.$el.html(templateDom);
				this.$el.addClass(this.name);
			};
			
			// Collect attach points
			if (this.$el) {
				$('[data-attach-point]', this.$el).each(_.bind(function(index, attachPointNode){
					var attachPointName = attachPointNode.attributes['data-attach-point'].value;
					this[attachPointName] = attachPointNode;
				}, this));
			};

			//this._submitNode.addEventListener('click', this._doSubmit.bind(this));
			
		},



	// Public Functions

		show: function() {
			this.$el.removeClass('hidden');
			var error = ErrorUtil.getAll()[0];
			var errorText;
			if (typeof error == 'string') {
				errorText = error;
			} else if (error.statusText == 'timeout') {
				errorText = 'The server appears to be down!'
			} else if (error.error) {
				errorText = error.error;
			}
			this._errorNode.innerHTML = errorText;
		},

		hide: function() {
			this.$el.addClass('hidden');
		},





	});


	
});
		