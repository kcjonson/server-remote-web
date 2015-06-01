define([
	'jquery',
	'underscore',
	'backbone',
	'app/views/Dashboard',
	'app/views/Devices',
	'app/views/Actions',
	'app/views/Alarm',
	'app/views/Device',
	'app/views/Admin',
	'app/views/admin/Devices',
	'app/views/admin/Actions',
	'app/views/Login',
	'app/views/Error',
	'app/views/User'
], function(
	$,
	_,
	Backbone,
	Dashboard,
	Devices,
	Actions,
	Alarm,
	Device,
	Admin,
	AdminDevices,
	AdminActions,
	Login,
	Error,
	User
){

	// Store the loaded views in an object,
	// so that we don't have to load them mutliple times.
	var views = {};

	return Backbone.Router.extend({

		routes: {
			'dashboard': 'Dashboard',
			'': 'Dashboard',
			'devices': 'Devices',
			'actions': 'Actions',
			'alarm': 'Alarm',
			'admin': 'Admin',
			'admin/devices': 'AdminDevices',
			'admin/actions': 'AdminActions',
			'login': 'Login',
			'error': 'Error',
			'user': 'User',
			'device/:device': 'Device'
		},
		
		initialize: function(args) {
			this.el = args.el;
			this.on('route', function(currentView, params) {
				console.log('Routing to ', currentView);

				// Create View if not Visited Yet.
				// Alternately, we could do this all at init.
				if (!views[currentView]) {
					var viewPrototype = eval(currentView);
					if (viewPrototype) {
						views[currentView] = new viewPrototype({
							appModel: args.appModel,
							router: this
						});
						this.el.append(views[currentView].$el);
					}
				}

				// Hide/Show Correct View
				for (var key in views) {
					if (views.hasOwnProperty(key)) {
						var v = views[key];
						if (v.name !== currentView) {
							v.hide();
						} else {
							this.el.scrollTop(0);
							if (v.hideHeader === true) {
								this.trigger('hide:header');
							} else {
								this.trigger('show:header');
							}
							if (v.hideNavigation === true) {
								this.trigger('hide:navigation');
							} else {
								this.trigger('show:navigation');
							}
							if (v.fetchData === true) {
								args.appModel.pollingEnabled = true;
								args.appModel.fetch();
							} else {
								args.appModel.pollingEnabled = false;
							}
							this.el.toggleClass('dark', v.darkBackground === true)
							v.show(params);
						}
					}
				}

			})
		}
		
		
	});



	
});