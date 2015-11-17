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
	
	// Cancel Webkit Scroll Bounce
	//    1. Views must add a "scrollable" class to themselves to prevent the event from being canceled
	//    2. Even if they have declared themselves scrollable, we check to make sure the content is 
	//       actually overflowing.  Otherwise safari bounces the whole container.
	$('body').on('touchmove', function (e) {
		var viewsContainer = $('.main > .views')[0];
		var targetIsScrollable = $('.scrollable').has($(e.target)).length;
		var viewIsOverflowing = viewsContainer.offsetHeight !== viewsContainer.scrollHeight
		if (!targetIsScrollable || !viewIsOverflowing) {
			e.preventDefault();
		}
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