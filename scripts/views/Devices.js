define([
	'jquery',
	'underscore',
	'backbone',
	'app/core/View',
	'text!./Devices.html',
	'./devices/Category'
], function(
	$,
	_,
	Backbone,
	View,
	templateString,
	Category
){


	return View.extend({


	// Init
		name: 'Devices',
		templateString: templateString,
		fetchData: true,
		attributes: {
			'class': 'scrollable'
		},
		_categoryViews: {},

		initialize: function(args) {
			this.router = args.router;
			this.appModel = args.appModel;
			this.devicesModel = args.appModel.devicesModel;
			View.prototype.initialize.call(this, args);

			this._addDevices();

			this.devicesModel.on("add", _.bind(this._onDevicesModelAdd, this));
			this.devicesModel.on("remove", _.bind(this._onDevicesModelRemove, this));

			$(this._typeInput).on("change", _.bind(this._onGroupingChange, this));
			$(this._locationInput).on("change", _.bind(this._onGroupingChange, this));
		},


	// Events

		_onDevicesModelAdd: function(deviceModel) {
			//console.log('_onDevicesModelAdd', arguments);
			this._addDevice(deviceModel);
		},

		_onDevicesModelRemove: function(deviceModel) {
			//console.log('_onDevicesModelRemove');
			this._reset();
			this._addDevices();
		},

		_onGroupingChange: function() {
			this._reset();
			this._addDevices();
		},



	// Private Functions


		_addDevices: function() {
			this.devicesModel.forEach(this._addDevice.bind(this));
		},

		_addDevice: function(deviceModel) {
			var grouping = $("input:radio[name=devicesGrouping]:checked").val();
			var category;
			switch (grouping) {
				case 'type':
					category = deviceModel.get('category');
					break;
				case 'location':
				default:
					category = deviceModel.get('location') || 'Unknown'
					break;							
			}
			if (category !== 'Unknown') {
				if (!this._categoryViews[category]) {
					this._categoryViews[category] = new Category({
						title: category,
						router: this.router
					}).placeAt(this._categoriesNode);

					var categories = $('.categories > .Category', this.$el);
					categories.sort(function(a,b){
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
					categories.detach().appendTo(this._categoriesNode);


				};
				this._categoryViews[category].addDevice(deviceModel);
			};
		},

		_reset: function() {
			for (var key in this._categoryViews) {
				if (this._categoryViews.hasOwnProperty(key)) {
					this._categoryViews[key].remove();
				}
			}
			this._categoryViews = {};
		}

		
	});


	
});