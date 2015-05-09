define([
	'jquery',
	'underscore',
	'backbone',
	'text!./Devices.html',
	'./devices/Category'
], function(
	$,
	_,
	Backbone,
	templateString,
	Category
){


	var NAME_TO_LOCATIONS_MAP = {
		'Master Bathroom': 'Upstairs',
		'Master Bedroom': 'Upstairs',
		'Upstairs': 'Upstairs',
		'Kitchen': 'Main Floor',
		'Living Room': 'Main Floor',
		'Pantry': 'Main Floor',
		'Office': 'Downstairs',
		'TV Room': 'Downstairs',
		'Entry': 'Downstairs',
		'Downstairs': 'Downstairs',
		'Outside': 'Outside'
	};

	return Backbone.View.extend({


	// Init
		name: 'Devices',
		fetchData: true,
		attributes: {
			'class': 'scrollable'
		},
		_categoryViews: {},

		initialize: function(args) {

			console.log('Devices Initialize')

			this._initializeTemplate();
			this.router = args.router;
			this.appModel = args.appModel;
			this.devicesModel = args.appModel.devicesModel;

			this._addDevices();

			this.devicesModel.on("add", _.bind(this._onDevicesModelAdd, this));
			this.devicesModel.on("remove", _.bind(this._onDevicesModelRemove, this));

			$(this._typeInput).on("change", _.bind(this._onGroupingChange, this));
			$(this._locationInput).on("change", _.bind(this._onGroupingChange, this));
		},

		
		_initializeTemplate: function() {
		
			// Consume template string
			if (templateString) {
				var templateDom = _.template(templateString);
				this.$el.html(templateDom);
				this.$el.addClass(this.name);
			};
			
			// Collect attach points
			if (this.$el) {
				$('[data-attach-point]', this.$el).each(_.bind(function(index, attachPointNode){
					var attachPointName = attachPointNode.attributes['data-attach-point'].value;
					this[attachPointName] = attachPointNode;
				}, this));
			};
			
		},


	// Public

		show: function() {
			this.$el.removeClass('hidden');
		},

		hide: function() {
			this.$el.addClass('hidden');
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
					category = deviceModel.get('displayType');
					break;
				case 'location':
				default:
					category = deviceModel.get('location') || this._getLocationFromName(deviceModel.get('name'));
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
		},

		_getLocationFromName: function(name) {
			var location = 'Unknown';
			for (var key in NAME_TO_LOCATIONS_MAP) {
				if (name.indexOf(key) > -1) {
					location = NAME_TO_LOCATIONS_MAP[key];
				}
			}
			return location;
		}


		
	});


	
});