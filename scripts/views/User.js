define([
	'jquery',
	'underscore',
	'backbone',
	'app/core/View',
	'text!./User.html',
	'../util/CurrentUser'
], function(
	$,
	_,
	Backbone,
	View,
	templateString,
	CurrentUser
){
	

	

	return View.extend({


	// Init
		name: 'User',
		templateString: templateString,
		fetchData: false,

		initialize: function(args) {
			this.currentUserModel = CurrentUser.getModel();
			View.prototype.initialize.call(this);


			this.currentUserModel.on("change", this._onCurrentUserModelChange.bind(this));
			this._updateDisplay();
		},




		_onCurrentUserModelChange: function () {
			this._updateDisplay();
		},

		show: function() {
			View.prototype.show.call(this);
			this._updateCheckins();
		},





	// Private Functions

		_updateDisplay: function() {
			this._firstNameNode.value = this.currentUserModel.get('name').first;
			this._lastNameNode.value = this.currentUserModel.get('name').last;
			this._indigoUsernameNode.value = this.currentUserModel.get('accounts').indigo;
			this._geohopperAccountNode.value = this.currentUserModel.get('accounts').geohopper;
		},

		_updateCheckins: function() {
			$.ajax({
				url: localStorage.getItem('server') + 'api/users/' + this.currentUserModel.get('_id') + '/checkins',
				success: function(response){
					if (!response.error) {
						this._displayCheckins(response)
					} else {
						
					}
				}.bind(this)
			}).error(function(err){
			 	
			}.bind(this));
		},

		_displayCheckins: function(checkins) {
			if (!checkins.forEach) {
				return;
			}
			var c = '';
			checkins.forEach(function(checkin, index) {
				var iconClass = checkin.action == 'ENTER' ? 'fa-arrow-right enter' : ' fa-arrow-left exit'; 
				c += '<li>'
				c += '<span class="date">' + this._formatDate(checkin.date)  + '</span>';
				c += '<span class="action fa ' + iconClass + '"></span>';
				c += '<span class="name">' + checkin.name  + '</span>';
				c += '</li>'
			}.bind(this));
			this._checkinsNode.innerHTML = c;
		},

		_formatDate: function(d) {
			d = new Date(d);
			var str = '';
			str += d.getMonth();
			str += '/' + d.getDate();
			str += ' ' + d.getHours();
			str += ':' + (d.getMinutes() < 10?'0':'') + d.getMinutes();
			return str;
		}





		
	});


	
});