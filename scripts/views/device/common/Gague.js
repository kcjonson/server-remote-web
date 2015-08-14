define([
	'jquery',
	'underscore',
	'backbone',
	'text!./Gague.html'
], function(
	$,
	_,
	Backbone,
	templateString
){
	




	return Backbone.View.extend({


	// Init

		name: 'Gague',


	// Init

		initialize: function(args) {			
			this._initializeTemplate();

			this.$el.on("touchstart", _.bind(this._onTouchStart, this));
			this.$el.on("touchend", _.bind(this._onTouchEnd, this));
			this.$el.on("touchcancel", _.bind(this._onTouchCancel, this));
			this.$el.on("touchleave", _.bind(this._onTouchLeave, this));
			this.$el.on("touchmove", _.bind(this._onTouchMove, this));

		},

		_initializeTemplate: function() {
		
			// Consume template string

			var templateDom = _.template(templateString);
			this.$el.html(templateDom);
			this.$el.addClass(this.name);

			// Collect attach points
			if (this.$el) {
				$('[data-attach-point]', this.$el).each(_.bind(function(index, attachPointNode){
					var attachPointName = attachPointNode.attributes['data-attach-point'].value;
					this[attachPointName] = attachPointNode;
				}, this));
			};


			
		},


	// Public API

		setValue: function(percent) {
			this._updateGague(percent, 'primary');
			if (!this._touchState) {
				this._updateKnob(percent);
				this._updateGague(percent, 'secondary');
			}
		},


	// Events

		_onTouchStart: function(e) {
			this._setTouchState(true);
			this._touchInitialX = e.originalEvent.touches[0].pageX;
			this._touchInitialY = e.originalEvent.touches[0].pageY;
			this._takeMeasurements();
		},

		_onTouchEnd: function(e) {
			this._setTouchState(false);
			this.trigger("change", Math.round(this._knobPercent))
		},

		_onTouchCancel: function() {
			this._setTouchState(false);
			this._touchInitialX = null;
			this._touchInitialY = null;
		},

		_onTouchLeave: function() {
			this._setTouchState(false);
		},


		_onTouchMove: function(e) {
			var percent = this._getTouchPercentage(e);
			this._updateKnob(percent);
			this._updateGague(percent, 'secondary')
		},


	// Private

		_updateGague: function(percent, layer) {
			var rotation = this._calculateRoationFromPercent(percent);

			var fillArea, outerGroup
			switch (layer) {
				case 'primary':
					fillArea = this._fillAreaPrimary;
					outerGroup = this._outerGroupPrimary;
					this._valuePrimary = percent;
					break;
				case 'secondary':
					fillArea = this._fillAreaSecondary;
					outerGroup = this._outerGroupSecondary;
					this._valueSecondary = percent;
					break;
			}

			$(fillArea).css('transform', 'rotate('+ rotation + 'deg)');

			if (rotation < -180) {
				$(outerGroup).attr('clip-path', 'url(#gauge-clip-subtraction-small)');
			} else if (rotation < -90) {
				$(outerGroup).attr('clip-path', 'url(#gauge-clip-subtraction-medium)');
			} else {
				$(outerGroup).removeAttr('clip-path');
			}
			// if (this._valueSecondary > this._valuePrimary) {
			// 	$(this._outerGroupPrimary).insertAfter(this._outerGroupSecondary);
			// } else {
			// 	$(this._outerGroupSecondary).insertAfter(this._outerGroupPrimary);
			// }
		},


		_getTouchPercentage: function(e) {
			var touchPercentage;
			this._controlRect = this.el.getBoundingClientRect();

			var touchCurrentX = e.originalEvent.touches[0].pageX;
			var touchCurrentY = e.originalEvent.touches[0].pageY;

			var touchLocalX = touchCurrentX - this._controlRect.left;
			var touchLocalY = touchCurrentY  - this._controlRect.top;

			var deltaX = touchLocalX - this._knobCenterX;
			var deltaY = touchLocalY - this._knobCenterY;

			// Calculate the angle of degrees
			// Straight down is the "origin", or zero degrees
			// Degrees get greater in a counter clockwise rotation (or lesser in the oppisite)
			// atan2 returns it's results in radians, but does properly handle negitive vals
			var touchAngleRadians = Math.atan2(deltaX, deltaY);
			var touchAngleDegrees = touchAngleRadians * (180 / Math.PI);
			var touchAngleDegrees = touchAngleDegrees < 0 ? touchAngleDegrees += 360 : touchAngleDegrees;

			// Calculate percentage
			// We want 315deg to be 0, and 45deg to be 100
			if (touchAngleDegrees > 315) {
				touchPercentage = 0;
			} else if (touchAngleDegrees < 45) {
				touchPercentage = 100;
			} else {
				// This is the equation for the slope of a line:  y = mx + b
				touchPercentage = (touchAngleDegrees * (-10/27)) + (350/3);
			}

			return touchPercentage;
		},

		_takeMeasurements: function() {

			// Read Coordinates.  Thise are relative to the bounding client, so we
			// have to be careful on the math to the relative position.  Don't forget
			// that the control node creates it own bounding rect for the css abs.
			var knobRect = this._knobGroup.getBoundingClientRect();
			this._controlRect = this.el.getBoundingClientRect();

			this._knobCenterX = (knobRect.left + knobRect.width / 2) - this._controlRect.left;
			this._knobCenterY = (knobRect.top + knobRect.width / 2) - this._controlRect.top;

		},

		_updateKnob: function(percent) {
			this._knobPercent = percent;
			var rotation = this._calculateRoationFromPercent(percent);
			$(this._knobGroup).css('transform', 'rotate('+rotation+'deg)');
			this._knobRotation = rotation; // Store for accurate end event send
			this._valueNode.innerHTML = Math.round(percent);
		},

		_calculateRoationFromPercent: function(percent) {
			return (-(270 - ((percent / 100) * 270)));
		},

		_setTouchState: function(state) {
			this.$el.toggleClass('touched', state);
			this._touchState = state;
		}



	});

	
});
		