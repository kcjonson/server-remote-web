define([
	'jquery',
	'underscore',
	'backbone',
	'app/core/View',
	'text!./Actions.html',
	'./actions/Action'
], function(
	$,
	_,
	Backbone,
	View,
	templateString,
	Action
){
	

	

	return View.extend({


	// Init
		name: 'AdminActions',
		title: 'Admin : Actions',
		templateString: templateString,
		fetchData: true,
		attributes: {
			'class': 'Admin'
		},

		initialize: function(args) {
			this.appModel = args.appModel;
			this.actionsModel = args.appModel.actionsModel;

			View.prototype.initialize.call(this);

			this._addActions();

			this.actionsModel.on("add", _.bind(this._onActionsModelAdd, this));
			this.actionsModel.on("remove", _.bind(this._onActionsModelRemove, this));



		},


	// Event Handlers

		_onActionsModelAdd: function(actionModel) {
			this._addAction(actionModel);
		},

		_onActionsModelRemove: function() {

		},



	// Private Functions

		_addActions: function() {
			this.actionsModel.forEach(this._addAction.bind(this));
		},

		_addAction: function(actionModel) {
			new Action({
				model: actionModel,
				router: this.router
			}).placeAt(this._actionsNode);
		}




		
	});


	
});