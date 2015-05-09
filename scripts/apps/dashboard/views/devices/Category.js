define([
	'jquery',
	'underscore',
	'backbone',
	'app/View',
	'./Device',
	'app/views/actions/Action',
	'text!./Category.html'
], function(
	$,
	_,
	Backbone,
	View,
	Device,
	Action,
	templateString
){
	
	
	

	return View.extend({


	// Init
		name: 'Category',
		templateString: templateString,


		initialize: function(args) {
			this.router = args.router;
			View.prototype.initialize.call(this);
			this._headingNode.innerHTML = args.title || 'unknown';
			this.$el.attr('data-name', args.title || 'unknown')
			$(this._headingNode).on('click', _.bind(this._onHeadingClick, this));
		},

		addAction: function(actionModel) {
			new Action({
				model: actionModel,
				router: this.router
			}).placeAt(this._devicesNode);
		},

		addDevice: function(deviceModel) {
			new Device({
				model: deviceModel,
				router: this.router
			}).placeAt(this._devicesNode);

			var devices = $('.list.devices > .Device', this.$el);
			devices.sort(function(a,b){
				var an = a.getAttribute('data-name'),
					bn = b.getAttribute('data-name');
				if(an > bn) {
					return 1;
				}
				if(an < bn) {
					return -1;
				}
				return 0;
			});
			devices.detach().appendTo(this._devicesNode);
		},

		_onHeadingClick: function() {

		}
		
	});


	
});