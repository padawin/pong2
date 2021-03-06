loader.addModule('score', 'B', 'canvas', function (B, canvas) {
	"use strict";

	/**
	 * Module to manage the scores
	 */

	const MAX_AGE_POINT = 1000;

	let combo, highestCombo, points, latestHits = [];

	let score = {
		init: function () {
			points = 0;
			combo = 0;
			highestCombo = combo;
			latestHits = [];
		},
		update: function () {
			latestHits = latestHits.filter(function (hit) {
				return Date.now() - hit.age < MAX_AGE_POINT;
			});
		},
		drawPoints: function (x, y) {
			canvas.getContext().font = '24px sans';
			canvas.getContext().fillText("Points: " + points, x, y);
		},
		drawMaxCombo: function (x, y) {
			canvas.getContext().font = '24px sans';
			canvas.getContext().fillText(
				"Highest bounce chaining: " + highestCombo,
				x,
				y
			);
		},
		drawLatestPoints: function () {
			canvas.getContext().font = '18px sans';
			for (let hit of latestHits) {
				canvas.getContext().fillText(hit.points, hit.x, hit.y);
				hit.y--;
			}
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
		let currPoints = combo * 10;
		latestHits.push({
			age: Date.now(),
			points: currPoints,
			x: target.x,
			y: target.y
		});
		points += currPoints;
		if (combo > highestCombo) {
			highestCombo = combo;
		}
	}

	B.Events.on('targetDisappeared', null, resetCombo);
	B.Events.on('targetCollided', null, tryAddPoints);

	return score;
});
