({
	baseUrl: ".",
	name: "scripts/app",
	out: "main-built.js",
	paths: {
		app: 'scripts',
		jquery: 'scripts/lib/jquery',
		underscore: 'scripts/lib/underscore',
		backbone: 'scripts/lib/backbone',
		'backbone-relational': 'scripts/lib/backbone-relational',
		text: 'scripts/lib/text'
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
})