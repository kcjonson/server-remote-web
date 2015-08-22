define([
	'jquery',
	'underscore',
	'backbone',
	'text!./Actions.html',
	'./actions/Action'
], function(
	$,
	_,
	Backbone,
	templateString,
	Action
){
	
	
	

	return Backbone.View.extend({


	// Init
		name: 'Actions',
		fetchData: true,
		attributes: {
			'class': 'scrollable'
		},

		initialize: function (args) {			
			this._initializeTemplate();

			this.appModel = args.appModel;
			this.actionsModel = args.appModel.actionsModel;
			this._addActions();
			this.actionsModel.on("add", _.bind(this._onActionsModelAdd, this));
			this.actionsModel.on("remove", _.bind(this._onActionsModelRemove, this));
		},

		
		_initializeTemplate: function () {
		
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

		show: function () {
			this.$el.removeClass('hidden');
		},

		hide: function () {
			this.$el.addClass('hidden');
		},


		_onActionsModelAdd: function(actionModel) {
			this._addAction(actionModel);
		},

		_onActionsModelRemove: function() {

		},

		_addActions: function() {
			this.actionsModel.forEach(this._addAction.bind(this));
		},

		_addAction: function(actionModel) {
			var actionView = new Action({
				model: actionModel
			}).placeAt(this._actionsNode);
		}







		
	});


	
});