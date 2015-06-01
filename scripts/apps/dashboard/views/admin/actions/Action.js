define([
	'jquery',
	'underscore',
	'backbone',
	'text!./Action.html',
	'./action/Command'
], function(
	$,
	_,
	Backbone,
	templateString,
	Command
){




	return Backbone.View.extend({

		name: 'AdminAction',
		tagName: "li",

		initialize: function(params) {
			this.router = params.router;
			this._initializeTemplate();
			this.model.on("change", _.bind(this._onModelChange, this));
			this._updateDisplay();

			//this._categoryNode.addEventListener('change', this._onFieldChange.bind(this));
			//this._nameNode.addEventListener('change', this._onFieldChange.bind(this));
			//this._locationNode.addEventListener('change', this._onFieldChange.bind(this));
		},

		_initializeTemplate: function () {
		
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

		placeAt: function(node) {
			node.appendChild(this.el);
		},

		_onModelChange: function () {
			console.log('CHANGE!', arguments)
			this._updateDisplay();
		},

		_onFieldChange: function(e) {
			var payload = {};
			payload[e.target.dataset.field] = e.target.value;
			this.model.save(payload, {patch: true});
		},

		_onCommandViewChange: function(e) {
			var commandsData = this.model.get('commands');
			var commandData = commandsData[e.index];
			commandData[e.property] = e.value;
			this.model.save({
				commands: commandsData
			}, {patch: true});
		},




	// Private Functions

		_updateDisplay: function () {
			this.$el.attr('data-name', this.model.get('name'))

			this._nameNode.value = this.model.get('name') || '';
			this._idNode.innerHTML = this.model.get('_id');
			

			if (!this._commandViews) {
				this._commandViews = {};
			}
			
			this.model.get('commands').forEach(function(command, index){
				if (this._commandViews[index]) {
					this._commandViews[index].setData(command);
				} else {
					var commandView = new Command({
						data: command,
						index: index
					}).placeAt(this._commandsNode);
					commandView.on('change', this._onCommandViewChange.bind(this));
					this._commandViews[index] = commandView;
				}
			}.bind(this));
		}

	});




});