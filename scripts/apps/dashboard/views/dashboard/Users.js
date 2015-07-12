define([
	'jquery',
	'app/core/View',
	'text!./Users.html',
	'app/util/Date',
	'app/util/Detect',
	'./users/User'
], function(
	$,
	View,
	templateString,
	DateUtil,
	DetectUtil,
	User
){


	var has = DetectUtil.has;


	var DAYS_TO_SHOW = 7;

	return View.extend({

		// Init
		name: 'Users',
		templateString: templateString,
		fetchData: false,
		_userViews: {},

		initialize: function(args) {
			this.usersModel = args.usersModel;
			View.prototype.initialize.call(this);
			this._drawAxis();
			this._addUsers();
			this.usersModel.on('add', _.bind(this._onUsersModelAdd, this));
		},

		_onUsersModelAdd: function(userModel) {
			this._addUser(userModel);
		},

		_addUsers: function() {
			this.usersModel.forEach(this._addUser.bind(this));
		},

		_addUser: function(userModel) {
			this._userViews[userModel.get('_id')] = new User({
				userModel: userModel
			}).placeAt(this._usersNode);

			if (has('screen-large')) {
				this._getCheckins(userModel);
			}
			
		},

		_onGetCheckinsError: function(err) {
			console.error(err);
		},

		_getCheckins: function(userModel) {
			console.log(userModel)
			$.ajax({
				url: SERVER + 'api/users/' + userModel.get('_id') + '/checkins',
				success: function(response){
					if (!response.error) {
						this._displayCheckinsForUser(userModel, response);
					} else {
						this._onGetCheckinsError(response.error);
					}
				}.bind(this)
			}).error(this._onGetCheckinsError.bind(this));
		},


		_drawAxis: function() {
			var nowDate = new Date();
			var labelDate, labelNode, labelLeft;
			var labelWidth = 100 / DAYS_TO_SHOW;
			for (var index = 1; index <= DAYS_TO_SHOW; index++) {


				labelDate = new Date(nowDate - ((DAYS_TO_SHOW - index)*24*60*60*1000));
				labelLeft = (100 / DAYS_TO_SHOW) * (index -1);

				labelNode = document.createElement('span');
				labelNode.innerHTML = labelDate.getMonth() + '/' + labelDate.getDate();
				labelNode.className = 'label';
				labelNode.setAttribute('style', 'left:' + labelLeft + '%; width: ' + labelWidth + '%;');


				this._chartNode.appendChild(labelNode);


				 console.log(labelLeft, labelWidth, _createDateString(labelDate))


			}

		},

		_displayCheckinsForUser: function(userModel, checkins) {
			console.log('Displaying Checkins For User ----------------------------------------')
			//var isHome = checkins[0].name === 'Home' && checkins[0].action === 'ENTER';

			var checkinDate,  	// Date of current checkin interation
				isHome, 		// is current checkin iteration home
				blockEnd, 		// The LATER (closer to now) end of the block
				blockStart;		// The earlier end of the block

			var nowDate = new Date();
			var millisToShow = DAYS_TO_SHOW*24*60*60*1000;

			// Set end if currently home
			if (_isHome(checkins[0])) {
				blockEnd = new Date();
			}

			checkins.forEach(function(checkin, index){
				checkinDate = new Date(checkin.date);
				

				if ((nowDate - checkinDate < millisToShow) || blockEnd) {
					console.log('Parsing Checkin: ', _createDateString(checkinDate), _isHome(checkin), index);

					if (!(blockEnd instanceof Date)) {
						if (_isHome(checkins[index + 1])) {
							blockEnd = checkinDate;
						};
					}

					if (_isHome(checkin)) {
						if (!_isHome(checkins[index + 1])) {
							blockStart = checkinDate;

							// If the block would span overnight we need to break it
							// and draw two blocks instead.
							if (blockStart.getDate() !== blockEnd.getDate()) {

								
								var endMidnight = new Date(blockEnd);
								endMidnight.setHours(0);
								endMidnight.setMinutes(0);
								endMidnight.setSeconds(0);
								endMidnight.setMilliseconds(0);

								var startMidnight = new Date(blockStart);
								startMidnight.setHours(0);
								startMidnight.setMinutes(0);
								startMidnight.setSeconds(0);
								startMidnight.setMilliseconds(0);

								var dayDiff = (endMidnight - startMidnight) / (24*60*60*1000);
								console.log('day diff', dayDiff);

								this._drawBlock(userModel, endMidnight, blockEnd);
								blockEnd = endMidnight;


							}
						};
					};

					// If we have both dates, and the next checkin is away, we can draw the block;
					if ((blockEnd instanceof Date) && (blockStart instanceof Date) && (!_isHome(checkins[index + 1].date))) {
						this._drawBlock(userModel, blockStart, blockEnd);
						blockStart = null;
						blockEnd = null;
					}
				} 
			}.bind(this));
			this._adjustBlockWidths();
		},

		_drawBlock: function(userModel, start, end) {
			var now = new Date();
			var timeDiff = Math.abs(end - start) / (60*60*1000);
			timeDiff = Math.round(timeDiff * 10000) / 10000;

			var extraClass = '';
			var millisInDay = 24*60*60*1000;
			var top, left, height, width, blockDate;

			console.log('Drawing Block: ' + _createDateString(start) + ' ' + _createDateString(end) + ' (' + timeDiff  + ')');

			if (start.getDate() !== end.getDate()) {
				// We don't draw blocks that span dates with the exception of midnight.
				if (end.getHours() == 0 && end.getMinutes() == 0 && end.getSeconds() == 0) {
					if (end.getDate() -  start.getDate() === 1) {
						end.setDate(end.getDate() - 1);
						end.setHours(23);
						end.setMinutes(59);
						end.setSeconds(59);
						extraClass = 'split';
					} else {
						console.error('Cannot draw split blocks that are greater than one day apart');
						return;
					}
				} else {
					console.error('Cannot draw blocks that span mutliple days');
					return;
				}
			} 

			if (start.getHours() == 0 && start.getMinutes() == 0 && start.getSeconds() == 0) {
				extraClass = 'split';
			}

			// Create a date for the start of the day;
			blockDay = start.getDate();
			blockDate = new Date(start);
			blockDate.setHours(0);
			blockDate.setMinutes(0);
			blockDate.setSeconds(0);
			blockDate.setMilliseconds(0);


			// Do math.
			top = Math.round((start - blockDate.getTime()) / millisInDay * 100);
			left = ((blockDay - (now.getDate() - DAYS_TO_SHOW) - 1) * (100 / DAYS_TO_SHOW));
			width = 100 / (DAYS_TO_SHOW + 1);
			height = Math.round((end - start) / millisInDay * 100);


			// Create DOM for Block
			var block = document.createElement('div');
			block.className = 'block ' + extraClass;
			var styleString = '';
			styleString += 'top:' + top + '%;';
			styleString += 'left:' + left + '%;';
			styleString += 'width:' + width + '%;';
			styleString += 'height:' + height + '%;';
			block.setAttribute('style', styleString);
			block.setAttribute('data-user-id', userModel.get('_id'));
			this._chartNode.appendChild(block);


		},

		_adjustBlockWidths: function() {
			//var numUsers = this.usersModel.length;
			var userBlocks;
			var width = 100 / (DAYS_TO_SHOW + 1) / this.usersModel.length;
			this.usersModel.forEach(function(userModel, index){
				userBlocks = $('[data-user-id=' + userModel.get('_id') + ']');
				userBlocks.css('margin-left', (width * index) + '%');
				userBlocks.css('width', width + '%');
				userBlocks.addClass(userModel.get('name').first.toLowerCase());
			});
		}

	});
});


function _isHome(checkin) {
	if (checkin) {
		return checkin.name === 'Home' && checkin.action === 'ENTER';
	}
}


function _createDateString(date) {
	if (date instanceof Date) {
		return date.getMonth() + "/" + date.getDate() + '-' + date.getHours() + ":" + date.getMinutes()
	}
	return null;
}