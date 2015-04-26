
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


	// Fun Hack for iOS
	document.addEventListener("touchstart", function() {},false);


	var router;
	var navigation;
	var header;





// Startup



	var appModel = new AppModel();





	// Set Up Router & Start History
	router = new Router({
		appModel: appModel,
		el: $('body > .views')
	});

	Backbone.history.start({
		root: '/server-remote-web/',
		pushState: true
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
			$('body').addClass('loaded');
			router.navigate('login', {trigger: true});
		} else if (error) {
			$('body').addClass('loaded');
			ErrorUtil.show(error, router);
		} else {
			appModel.once("change", function(){
				$('body').addClass('loaded');
				router.navigate('dashboard', {trigger: true});
			});
			appModel.fetch({});
		}
	});






// Cordova Specific

	if (!!window.cordova) {
		document.addEventListener("deviceready", _onDeviceReady, false);
	} 

	function _onDeviceReady() {
		document.addEventListener("resume", _onResume, false);
	}

	function _onResume() {
		//indigoModel.fetch();
		appModel.fetch();
	}




});