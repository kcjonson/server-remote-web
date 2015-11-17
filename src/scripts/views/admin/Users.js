define([
	'app/core/View',
	'text!./Users.html',
	'./users/User'
], function(
	View,
	templateString,
	User
){
	

	

	return View.extend({


	// Init
		name: 'AdminUsers',
		title: 'Admin : Users',
		templateString: templateString,
		fetchData: true,

		initialize: function(args) {
			this.appModel = args.appModel;
			this.usersModel = args.appModel.usersModel;

			View.prototype.initialize.call(this);

			this._addUsers();

			this.usersModel.on("add", _.bind(this._onUsersModelAdd, this));
			this.usersModel.on("remove", _.bind(this._onUsersModelRemove, this));

		},


	// Event Handlers

		_onUsersModelAdd: function(userModel) {
			this._addUser(userModel);
		},

		_onUsersModelRemove: function() {

		},



	// Private Functions

		_addUsers: function() {
			this.usersModel.forEach(this._addUser.bind(this));
		},

		_addUser: function(userModel) {
			new User({
				model: userModel,
				router: this.router
			}).placeAt(this._usersNode);
		}




		
	});


	
});