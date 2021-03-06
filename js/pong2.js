var __DEBUG__ = false;
loader.executeModule('main',
'B', 'canvas', 'screenSize', 'resourceManager', 'debug', 'gameState', 'loseState',
function (B, canvas, screenSize, resourceManager, debug, gameState, loseState) {
	"use strict";

	let timePreviousFrame;
	let resources = {};

	let state;
	const statesMapping = {
		'game': gameState,
		'lose': loseState
	};

	const MAX_FPS = 60,
		INTERVAL = 1000 / MAX_FPS;

	resourceManager.load(function() {
		timePreviousFrame = Date.now();
		canvas.resize(screenSize.get());
		changeState('game');
		B.Events.on('click', null, click);
		B.Events.on('changeState', null, changeState);
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

	function click(x, y) {
		state.click(x, y);
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
