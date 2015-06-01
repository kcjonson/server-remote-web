define([], function(){



	return {

		has: function(feature) {
			
			var found = false;
			switch(feature) {
				case 'screen-large':
					if (window.innerWidth > 800) {
						found = true;
					}
					break;
				case 'touch':
					//Todo
					break;
			}
			return found;
		}
		

	}

});