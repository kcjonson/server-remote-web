define([
	'jquery',
	'underscore',
	'backbone',
	'text!./Admin.html'
], function(
	$,
	_,
	Backbone,
	templateString
){
	




	return Backbone.View.extend({


	// Init

		name: 'Admin',

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
			
		},


	// Public Functions

		show: function() {
			this.$el.removeClass('hidden');
		},

		hide: function() {
			this.$el.addClass('hidden');
		},

	});

	
});
		