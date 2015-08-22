define([
	'jquery',
	'underscore',
	'backbone',
	'text!./Login.html',
	'../util/CurrentUser'
], function(
	$,
	_,
	Backbone,
	templateString,
	CurrentUser
){
	



	return Backbone.View.extend({


	// Init

		name: 'Login',
		darkBackground: true,
		hideHeader: true,
		hideNavigation: true,
		fetchData: false,

		initialize: function(args) {
			this.router = args.router;
			this.appModel = args.appModel;	
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

			this._submitNode.addEventListener('click', this._doSubmit.bind(this));
			
		},



	// Public Functions

		show: function() {
			this.$el.removeClass('hidden');
		},

		hide: function() {
			this.$el.addClass('hidden');
		},


	// Private Functions

		_doSubmit: function() {
			this._setDisabled(true)
			var data = {
				username: this._usernameNode.value,
				password: this._passwordNode.value
			};
			$.post(localStorage.getItem('server') + 'api/login', data, function(data){
				if (!data.error) {
					this._onSuccess(data);
				} else {
					this._onError(data.error);
				}
			}.bind(this)).error(this._onError.bind(this));
		},

		_onSuccess: function(userData) {
			this._setDisabled(false)
			//console.log('Login._onSuccess()');
			this.router.navigate('', {trigger: true})
			CurrentUser.set(userData);
		},

		_onError: function(error) {
			this._setDisabled(false)
			//console.log('Login._onError()', error)
			this._errorNode.innerHTML = error;
		},

		_setDisabled: function(disabled) {
			$(this._usernameNode).prop('disabled', disabled);
			$(this._passwordNode).prop('disabled', disabled);
			$(this._submitNode).prop('disabled', disabled);
		}


	});


	
});
		