define([
	'jquery',
	'app/core/View',
	'text!./Setup.html',
	'app/util/CurrentUser'
], function(
	$,
	View,
	templateString,
	CurrentUser
){
	




	return View.extend({


	// Init

		name: 'Setup',
		fetchData: false,
		hideNavigation: true,
		templateString: templateString,

		initialize: function(args) {
			this.usersModel = args.appModel.usersModel;
			this.router = args.router;
			View.prototype.initialize.call(this);
			this._updateDisplay();
			this._saveNode.addEventListener('click', this._onSaveClick.bind(this))
		},

		_updateDisplay: function() {
			var serverAddress = localStorage.getItem('server');
			if (!serverAddress) {
				serverAddress = window.location.origin;
			}
			this._serverAddressNode.value = serverAddress;
			$(this._createUserNode).toggleClass('hidden', localStorage.getItem('server'));
		},

		_onSaveClick: function() {
			console.log('do save', this._serverAddressNode.value);

			var server  = localStorage.getItem('server')
			if (server && server.length && server.length > 8) {
				this.usersModel.create({
					name: {
						first: this._firstNameNode.value,
						last:  this._lastNameNode.value
					},
					username: this._usernameNode.value,
					password: this._passwordNode.value
				});
			} else if (this._serverAddressNode.value) {
				this._checkServer();
			}

		},

		_checkServer: function() {
			var url = this._serverAddressNode.value;
			if (this.validateUrl(url)) {
				this._serverAddressStatusNode.innerHTML = 'Checking';
				// Try and authenticate the current user aginst
				// the new server
				url = url.replace(/\/?$/, '/');
				localStorage.setItem('server', url);
				CurrentUser.authenticate(function(res){
					if (res.status && res.status !== 200) {
						switch(res.status) {
							case 401:
								// Its there, but we're not logged in!
								this.router.navigate('login', {trigger: true})
								break;
							case 404:
							default:
								// Not found
								this._serverAddressStatusNode.innerHTML = 'Unable to reach server at url'
								break;
						}
					} else if (res.users !== undefined && res.users === false) {
						this._serverAddressStatusNode.innerHTML = '';
						localStorage.setItem('server', url);
						this._updateDisplay();
					} else {
						this._serverAddressStatusNode.innerHTML = '';
						this.router.navigate('dashboard', {trigger: true})
					}
				}.bind(this));
			} else {
				this._serverAddressStatusNode.innerHTML = 'Not a valid url'
			}
		},

		validateUrl: function(url){
      		return /^http:\/\/\w+(\.\w+)*(:[0-9]+)?\/?$/.test(url);
		}

		





	});
	
});
		