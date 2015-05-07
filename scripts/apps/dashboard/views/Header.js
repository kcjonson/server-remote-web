define([
	'jquery',
	'underscore',
	'backbone',
	'text!./Header.html',
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
		name: 'Header',
		shown: true,

		initialize: function(args) {
			this.router = args.router;	
			//this.indigoModel = args.indigoModel;
			this._initializeTemplate();

			this.router.on("route", _.bind(function(route, params) {
			    this._titleNode.innerHTML = route; 
			}, this));

			this.router.on('show:header', this.show.bind(this));
			this.router.on('hide:header', this.hide.bind(this));

			// this.indigoModel.on("request", _.bind(this._onIndigoModelRequest, this));
			// this.indigoModel.on("sync", _.bind(this._onIndigoModelSync, this));

			this._userNode.addEventListener('click', this._onUserNodeClick.bind(this));

			CurrentUser.getModel().on('change', this._onCurrentUserChange.bind(this));

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

		// _onIndigoModelRequest: function (model, xhr, options) {
		// 	//console.log('app._onIndigoModelRequest()', model, xhr, options);
		// 	$(this._statusNode).removeClass('hidden');
		// },

		// _onIndigoModelSync: function (model, response, options) {
		// 	//console.log('app._onIndigoModelRequest()', model, response, options);
		// 	$(this._statusNode).addClass('hidden');
		// },

		_onCurrentUserChange: function(model) {
			//console.log('user change', model.get('name'), arguments)
			var firstLetter = model.get('name').first.substr(0,1);
			var lastLetter = model.get('name').last.substr(0,1);
			this._userNode.innerHTML = firstLetter + lastLetter;


		},

		_onUserNodeClick: function() {
			this.router.navigate('user', {trigger: true});
		}


	});


	
});