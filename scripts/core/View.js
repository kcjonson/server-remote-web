define([
	'jquery',
	'underscore',
	'backbone'
], function(
	$,
	_,
	Backbone
){
	
	
	

	return Backbone.View.extend({

		initialize: function(args) {
			this._initializeTemplate();

			// dataSources allows us to wait for the inital load of 
			// various models on the main app data source.  The _onDataLoaded
			// function will be run when all the data sources have been
			// Loaded, Disabled, or encountered and Error.
			if (args && args.appModel && this.dataSources) {
				this.dataLoaded = false;
				args.appModel.require(this.dataSources).then(function(){
					this.trigger('data-loaded');
					this.dataLoaded = true;
					if (this._updateDisplay) {this._updateDisplay()}
					if (this._onDataLoaded) {this._onDataLoaded()}
				}.bind(this));
			}
		},

		_initializeTemplate: function() {
			// Consume template string
			if (this.templateString) {
				var templateDom = _.template(this.templateString);
				this.$el.html(templateDom);
				this.$el.addClass(this.name);
			} else {
				throw new Error('View Requires a templateString');
			}
			
			// Collect attach points
			if (this.$el) {
				$('[data-attach-point]', this.$el).each(_.bind(function(index, attachPointNode){
					var attachPointName = attachPointNode.attributes['data-attach-point'].value;
					this[attachPointName] = attachPointNode;
				}, this));
			};
		},

		show: function(params) {
			this.$el.removeClass('hidden');
		},

		hide: function() {
			this.$el.addClass('hidden');
		},

		placeAt: function(node) {
			node.appendChild(this.el);
			return this;
		},

		_updateDisplay: function() {},

		_onDataLoaded: function() {}

		
	});


	
});