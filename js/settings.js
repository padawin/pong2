loader.addModule('settings', function () {
	"use strict";

	return {
		options: {
			clickAnywhere: true
		},
		MIN_DIST_CLICK_TARGET: 50,
		MAX_TARGET_RADIUS: 30,
		BALL_CRUISE_SPEED: 3,
		BALL_MAX_BOOST_SPEED: 8,
		BALL_ANGULAR_SPEED: 0.05
	};
});
