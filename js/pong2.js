var __DEBUG__ = false;
loader.executeModule('main',
'B', 'canvas', 'screenSize', 'resourceManager', 'debug', 'gameState',
function (B, canvas, screenSize, resourceManager, debug, gameState) {
	"use strict";

	let timePreviousFrame;
	let resources = {};

	let state = gameState;

	const MAX_FPS = 60,
		INTERVAL = 1000 / MAX_FPS;

	resourceManager.load(function() {
		timePreviousFrame = Date.now();
		canvas.resize(screenSize.get());
		B.Events.on('click', null, state.click);
		state.init();
		runGame();
	});

	function runGame() {
		// start main loop
		requestAnimationFrame(runGame);
		var now = Date.now(),
			delta = now - timePreviousFrame;

		// cap the refresh to a defined FPS
		if (delta > INTERVAL) {
			timePreviousFrame = now - (delta % INTERVAL);

			state.update();
			state.draw();
			debug.processDebug();
		}
	}
});
