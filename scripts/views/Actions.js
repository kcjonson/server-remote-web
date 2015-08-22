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
		name: 'Actions',
		fetchData: true,
		templateString: templateString,
		attributes: {
			'class': 'scrollable'
		},

		initialize: function (args) {			
			this.appModel = args.appModel;
			this.actionsModel = args.appModel.actionsModel;
			View.prototype.initialize.call(this, args);


			this._addActions();
			this.actionsModel.on("add", _.bind(this._onActionsModelAdd, this));
			this.actionsModel.on("remove", _.bind(this._onActionsModelRemove, this));
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