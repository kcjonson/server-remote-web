
require.config({
	paths: {
		app: '/scripts',
		jquery: '/scripts/lib/jquery',
		underscore: '/scripts/lib/underscore',
		backbone: '/scripts/lib/backbone',
		'backbone-relational': '/scripts/lib/backbone-relational',
		text: '/scripts/lib/text'
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
	'app/util/Detect',
	'app/util/Cookie'
], function(
	$,
	Router,
	AppModel,
	Navigation,
	Header,
	CurrentUser,
	ErrorUtil,
	LocationUtil,
	Detect,
	Cookie
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


	// TODO: Look for a cookie set by server that 
	// has information about the server such as the domain.
	// write to local storage if it exists.

	//localStorage.removeItem('server')
	var server = localStorage.getItem('server') || null;

	if (server && server.length > 8) {
		_startHistory();
	} else {
		_startHistory();
		router.navigate('setup', {trigger: true});
	}
	$('body').addClass('loaded');



	// if (server && server.length > 2 && window.location.pathname !== '/dashboard/setup') {

	// 	// Check user credentials up front.
	// 	// Probally don't have to do this if we're handing errors
	// 	// on all the models properly.	
	// 	CurrentUser.authenticate(function(res){
	// 		if (res && res.status == 401) {
	// 			// Auth failed
	// 			_startHistory(true);
	// 			$('body').addClass('loaded');
	// 			router.navigate('login', {trigger: true});
	// 		} else if (res.users == false) {
	// 			// No users in the DB
	// 			_startHistory(true);
	// 			$('body').addClass('loaded');
	// 			router.navigate('setup', {trigger: true});
	// 		} else if (res.error) {
	// 			// An unhandled error occured
	// 			_startHistory(true);
	// 			ErrorUtil.show(res.error || res.responseText || res.statusText, router);
	// 		} else {
	// 			// Success
	// 			LocationUtil.watch();
	// 			appModel.once("sync:all", function(){
	// 				setTimeout(function(){
	// 					$('body').addClass('loaded');
	// 				}.bind(this), 100)
	// 			});
	// 			_startHistory();
	// 		}
	// 	});
	// } else {
	// 	if (window.location.pathname == '/dashboard/setup') {
	// 		_startHistory();
	// 	} else {
	// 		_startHistory(true);
	// 		router.navigate('setup', {trigger: true});
	// 	}
	// 	$('body').addClass('loaded');
	// }

	function _startHistory(silent) {
		// This needs go after things that subscribe to route
		// events as it triggers the initial "route" on start()
		pushState = Detect.has('cordova') ? false : true;
		Backbone.history.start({
			root: '/dashboard/',
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