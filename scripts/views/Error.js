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
			$('body').addClass('loaded');
			this._errors = [];
			var errors = ErrorUtil.getAll() || [];
			errors.forEach(function(err){
				this._add(err);
			}.bind(this));
			ErrorUtil.on('add', function(err){
				this._add(err);
			}.bind(this));
		},

		hide: function() {
			this.$el.addClass('hidden');
			this._errorNode.innerHTML = '';
			this._errors = [];
		},



	// Private Functions

		_add: function(err) {

			// Compute error text
			var errorText = 'An unknown error occured'
			if (err) {
				if (typeof err == 'string') {
					errorText = err;
				} else if (err.statusText == 'timeout') {
					errorText = 'The server appears to be down!'
				} else if (err.error) {
					errorText = err.error;
				}
			}
			this._errors.push(errorText);

			// TODO: Dedupe and count.

			this._errorNode.innerHTML = this._errors.join(', ');

		

		}



	});


	
});
		