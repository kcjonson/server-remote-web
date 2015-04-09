
SERVER = '/'

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
	'app/models/Indigo',
	'app/views/Navigation',
	'app/views/Header',
	'app/util/CurrentUser'
], function(
	Router,
	IndigoModel,
	Navigation,
	Header,
	CurrentUser
){


	// Fun Hack for iOS
	document.addEventListener("touchstart", function() {},false);


	var indigoModel;
	var router;
	var navigation;
	var header;





// Startup

	Backbone.history.start({
		root: '/server-remote-web/',
		pushState: true
	});


	// Set Up Indigo Model
	indigoModel = new IndigoModel({id: '1'});
	indigoModel.on("error", _.bind(_onIndigoModelError, this));


	// Set Up Router & Start History
	router = new Router({
		indigoModel: indigoModel,
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
		indigoModel: indigoModel
	});


	CurrentUser.authenticate(function(error){
		if (error && error.status == 401) {
			$('body').addClass('loaded');
			router.navigate('login', {trigger: true});
		} else if (error) {
			console.error('There was an error with the authentication server')
		} else {
			indigoModel.once("change", function(){
				$('body').addClass('loaded');
				router.navigate('dashboard', {trigger: true});
			});
			indigoModel.fetch({});
		}
	});



// Event Handlers

	// This should be factored out to be on ALL models.
	function _onIndigoModelError(model, response) {
		switch (response.status) {
			case 401:
				router.navigate('login', {trigger: true});
				break;
			default:
				console.error('app._onIndigoModelError(): Un unrecognized error has occured');
		}
	}





});