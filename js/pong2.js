var __DEBUG__ = false;
loader.executeModule('main',
'B', 'canvas', 'screenSize', 'resourceManager', 'debug', 'gameState',
function (B, canvas, screenSize, resourceManager, debug, gameState) {
	"use strict";

	let timePreviousFrame;
	let resources = {};

	let state;
	const statesMapping = {
		'game': gameState
	};

	const MAX_FPS = 60,
		INTERVAL = 1000 / MAX_FPS;

	resourceManager.load(function() {
		timePreviousFrame = Date.now();
		canvas.resize(screenSize.get());
		changeState('game');
		B.Events.on('click', null, state.click);
		runGame();
	});

	function changeState(to) {
		if (statesMapping[to]) {
			if (state && state.terminate) {
				state.terminate();
			}
			state = statesMapping[to];
			state.init && state.init();
		}
	}

	function runGame() {
		// start main loop
		requestAnimationFrame(runGame);
		var now = Date.now(),
			delta = now - timePreviousFrame;

		// cap the refresh to a defined FPS
		if (delta > INTERVAL) {
			timePreviousFrame = now - (delta % INTERVAL);

			state.update && state.update();
			state.draw && state.draw();
			debug.processDebug();
		}
	}
});
