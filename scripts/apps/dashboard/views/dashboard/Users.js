define([
	'app/core/View',
	'text!./Users.html',
	'app/util/Date',
	'./users/User'
], function(
	View,
	templateString,
	DateUtil,
	User
){



	return View.extend({

		// Init
		name: 'Users',
		templateString: templateString,
		fetchData: false,
		_userViews: {},

		initialize: function(args) {
			this.usersModel = args.usersModel;
			View.prototype.initialize.call(this);
			this._addUsers();
			this.usersModel.on('add', _.bind(this._onUsersModelAdd, this));
		},

		_onUsersModelAdd: function(userModel) {
			this._addUser(userModel);
		},

		_addUsers: function() {
			this.usersModel.forEach(this._addUser.bind(this));
		},

		_addUser: function(userModel) {
			this._userViews[userModel.get('_id')] = new User({
				userModel: userModel
			}).placeAt(this._usersNode);
		},

	});
});