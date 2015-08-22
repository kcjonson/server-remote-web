
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
	'jquery',
	'app/Router',
	'app/models/App',
	'app/views/Navigation',
	'app/views/Header',
	'app/util/CurrentUser',
	'app/util/Error',
	'app/util/Location',
	'app/util/Detect'
], function(
	$,
	Router,
	AppModel,
	Navigation,
	Header,
	CurrentUser,
	ErrorUtil,
	LocationUtil,
	Detect
){


	var router;
	var navigation;
	var header;



	var viewsNode = $('.views')
	var navigationNode = $('.navigation')
	var headerNode = $('.header')



// Startup

	//$.ajaxSetup({timeout:12000});
	var appModel = new AppModel();

	// Set Up Router & Start History
	router = new Router({
		appModel: appModel,
		el: viewsNode
	});
	ErrorUtil.setRouter(router);

	// Create Common UI
	navigation = new Navigation({
		el: navigationNode,
		router: router
	});
	header = new Header({
		el: headerNode,
		router: router,
		appModel: appModel
	});


	// Check user credentials up front.
	// Probally don't have to do this if we're handing errors
	// on all the models properly.	
	CurrentUser.authenticate(function(res){
		if (res && res.status == 401) {
			_startHistory(true);
			$('body').addClass('loaded');
			router.navigate('login', {trigger: true});
		} else if (res) {
			_startHistory(true);
			ErrorUtil.show(res.responseText || res.statusText, router);
		} else {
			LocationUtil.watch();
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
		pushState = Detect.has('cordova') ? false : true;
		Backbone.history.start({
			root: '/server-remote-web/',
			pushState: pushState,
			silent: silent || false
		});
	}






// Cordova Specific

	if (Detect.has('cordova')) {
		document.addEventListener("deviceready", _onDeviceReady, false);
		$(document.body).addClass('cordova');
		$(document.body).addClass('touch');  // Hard coded for now since we're only supporting iOS
	} 

	function _onDeviceReady() {
		document.addEventListener("resume", _onResume, false);
		navigator.splashscreen.hide();
	}

	function _onResume() {
		appModel.fetch();
	}



// iOS Specific

	
	// Fun Hack for iOS
	// I totally forgot what this does. -KCJ
	//document.addEventListener("touchstart", function() {},false);

$('body').on('touchmove', function (e) {
if (!$('.scrollable').has($(e.target)).length) e.preventDefault();
});


	// Tap highlight should not show once scroll starts. 
	// This appears only on real devices, not chrome simulation mode.
	// The "views" div is the only scroll container so we can add handlers
	// there that give us a css selector to suppress the :active styles with
	// css like *:not(.scrolling) -KCJ
	viewsNode.on('touchmove', function(){
		viewsNode.addClass('scrolling');
	})
	viewsNode.on('touchend', function(){
		viewsNode.removeClass('scrolling');
	})


});