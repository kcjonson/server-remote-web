define([
	'jquery',
	'underscore',
	'backbone',
	'text!./Navigation.html',
	'app/util/Detect'
], function(
	$,
	_,
	Backbone,
	templateString,
	Detect
){


	return Backbone.View.extend({


	// Init
		name: 'Navigation',
		shown: true,
		minimized: true,
		tagName: "div",

		initialize: function(args) {
			this._options = {}; // Store node refs for nav options.
			this.router = args.router;	
			this._initializeTemplate();


			// Attach Main Interaction Handlers
			$('[data-route]', this.$el).each(_.bind(function(index, routeNode){
				var route = routeNode.attributes['data-route'].value;
				this._options[route] = routeNode;
				var targetNode;
				// We're hiding the sub nav with CSS media queries so we can take 
				// the full target for tap here in the JS>
				if ($('> ol', routeNode).length && Detect.has('screen-large')) {
					targetNode = $('> .label', routeNode)
				} else {
					targetNode = routeNode;
				}
				$(targetNode).on("click", _.bind(this._onRouteClick, this, route));
				$(targetNode).on("touchstart", _.bind(this._onRouteTouchStart, this, route));
			}, this));


			// Setup show/hide
			this._shideNode.addEventListener('click', this._toggleMinimized.bind(this));
			this._toggleMinimized();

			// Listen for route changes
			this.router.on("route", _.bind(function(route, params) {
			    for (var option in this._options) {
			    	if (this._options.hasOwnProperty(option)) {
			    		var optionNode = this._options[option];
			    		var optionName = this.router.routes[option];  // Use map on router
			    		var selected = optionName == route;
			    		$(optionNode).toggleClass('selected', selected);
			    	}
			    }
			}, this));

			this.router.on('show:navigation', this.show.bind(this));
			this.router.on('hide:navigation', this.hide.bind(this));

		},

		show: function() {
			if (!this.shown) {
				this.$el.removeClass('hidden')
				this.shown = true;
			}
			
		},

		hide: function() {
			if (this.shown) {
				this.$el.addClass('hidden');
				this.shown = false;
			}
		},


		_toggleMinimized: function() {
			this.minimized = !this.minimized;
			this.$el.toggleClass('minimized', this.minimized);
			$(this._shideNode).toggleClass('fa-chevron-left', !this.minimized);
			$(this._shideNode).toggleClass('fa-chevron-right', this.minimized);
		},


		_initializeTemplate: function() {
		
			// Consume template string
			if (templateString) {
				var templateDom = _.template(templateString);
				this.$el.html(templateDom);
				this.$el.addClass(this.name);
			};
			
			// Collect attach points and Routes
			if (this.$el) {
				$('[data-attach-point]', this.$el).each(_.bind(function(index, attachPointNode){
					var attachPointName = attachPointNode.attributes['data-attach-point'].value;
					this[attachPointName] = attachPointNode;
				}, this));
			};
		},

		_onRouteClick: function(route) {
			this.router.navigate(route, {trigger: true});
		},

		_onRouteTouchStart: function(route, e) {
			e.preventDefault();
			this.router.navigate(route, {trigger: true});
		}



	});


	
});