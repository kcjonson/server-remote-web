define([
	'jquery',
	'underscore',
	'backbone',
	'text!./Header.html',
	'../util/CurrentUser',
	'app/components/UserPortrait'
], function(
	$,
	_,
	Backbone,
	templateString,
	CurrentUser,
	UserPortrait
){


	return Backbone.View.extend({


	// Init
		name: 'Header',
		shown: true,

		initialize: function(args) {
			this.router = args.router;
			this.appModel = args.appModel;
			this.usersModel = this.appModel.usersModel;
			this._initializeTemplate();

			this._userPortrait = new UserPortrait({
				el: this._userNode
			});

			this.router.on("route", _.bind(function(route, params) {
			    this._titleNode.innerHTML = route;
			}, this));

			this.router.on('show:header', this.show.bind(this));
			this.router.on('hide:header', this.hide.bind(this));

			this._userNode.addEventListener('click', this._onUserNodeClick.bind(this));

			this.usersModel.on('change add remove', this._onUsersModelChange.bind(this))

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


	// Private Events

		_onUserNodeClick: function() {
			this.router.navigate('user', {trigger: true});
		},

		_onUsersModelChange: function() {
			this._userPortrait.setModel(this.usersModel.getCurrent());
		}


	});


	
});