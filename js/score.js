loader.addModule('score', 'B', 'canvas', function (B, canvas) {
	"use strict";

	/**
	 * Module to manage the scores
	 */

	let combo = 0;
	let highestCombo = combo;
	let points = 0;
	let score = {
		draw: function () {
			canvas.getContext().font = '24px sans';
			canvas.getContext().fillText("Points: " + points, 50, 50);
		}
	};

	function resetCombo() {
		combo = 1;
	}

	function tryAddPoints(target) {
		if (!target.expands) {
			return;
		}

		combo++;
		points += combo * 10;
		if (combo > highestCombo) {
			highestCombo = combo;
		}
	}

	B.Events.on('targetDisappeared', null, resetCombo);
	B.Events.on('targetCollided', null, tryAddPoints);

	return score;
});
