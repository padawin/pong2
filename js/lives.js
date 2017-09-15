loader.addModule('lives', 'B', 'canvas', function (B, canvas) {
	"use strict";

	/**
	 * Module to manage the lives
	 */

	const MAX_NB_LIVES = 5;
	let lives;

	function drawLife(lifeIndex) {
		canvas.getContext().font = '24px sans';
		canvas.getContext().fillText("Lives: " + lives, 50, 50);
	}

	function tryRemoveLife(target) {
		if (target.expands) {
			return;
		}

		lives = Math.max(lives - 1, 0);
		if (!lives) {
			B.Events.fire('lost');
		}
	}

	B.Events.on('targetCollided', null, tryRemoveLife);

	let module = {
		init: function () {
			lives = MAX_NB_LIVES;
		},
		update: function () {
		},
		draw: function () {
			canvas.getContext().fillStyle = 'black';
			for (let i = lives; i--;) {
				drawLife(i);
			}
		}
	};

	return module;
});
