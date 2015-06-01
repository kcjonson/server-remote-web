
SERVER = 'http://1825eglen.com/'

require.config({
	baseUrl: 'scripts',
	paths: {
		app: 'apps/dashboard'
	},
	shim: {
		underscore: {
			exports: '_'
		},
		backbone: {
			deps: ["underscore", "jquery"],
			exports: "Backbone"
		},
		'backbone-relational': {
			deps: ["backbone"]
		}
	}
});

require([
	'app/Router',
	'app/models/App',
	'app/views/Navigation',
	'app/views/Header',
	'app/util/CurrentUser',
	'app/util/Error'
], function(
	Router,
	AppModel,
	Navigation,
	Header,
	CurrentUser,
	ErrorUtil
){

	var isCordova = !!window.cordova;



	// Fun Hack for iOS
	document.addEventListener("touchstart", function() {},false);


	var router;
	var navigation;
	var header;





// Startup


	$.ajaxSetup({timeout:10000});
	var appModel = new AppModel();

	// Set Up Router & Start History
	router = new Router({
		appModel: appModel,
		el: $('body > .views')
	});

	// Create Common UI
	navigation = new Navigation({
		el: $('body > .footer > .navigation'),
		router: router
	});
	header = new Header({
		el: $('body > .header'),
		router: router,
		appModel: appModel
	});



	CurrentUser.authenticate(function(error){
		if (error && error.status == 401) {
			_startHistory(true);
			$('body').addClass('loaded');
			router.navigate('login', {trigger: true});
		} else if (error) {
			_startHistory(true);
			$('body').addClass('loaded');
			ErrorUtil.show(error, router);
		} else {
			appModel.once("sync:all", function(){
				setTimeout(function(){
					$('body').addClass('loaded');
				}.bind(this), 100)
			});
			_startHistory();
		}
	});

	function _startHistory(silent) {
		// This needs go after things that subscribe to route
		// events as it triggers the initial "route" on start()
		pushState = isCordova ? false : true;
		Backbone.history.start({
			root: '/server-remote-web/',
			pushState: pushState,
			silent: silent || false
		});
	}



// Cordova Specific

	if (isCordova) {
		document.addEventListener("deviceready", _onDeviceReady, false);
	} 

	function _onDeviceReady() {
		document.addEventListener("resume", _onResume, false);
	}

	function _onResume() {
		appModel.fetch();
	}




});