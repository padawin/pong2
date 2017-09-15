loader.addModule('loseState', 'score', 'canvas', 'B',
function (score, canvas, B) {
	"use strict";

	let state = {
		draw: function () {
			canvas.getContext().clearRect(0, 0, canvas.getWidth(), canvas.getHeight());
			let title = "Game Over";
			let explanations = "Click anywhere to restart";
			canvas.getContext().font = '36px sans';
			canvas.getContext().fillText(title, 50, 50);
			canvas.getContext().font = '24px sans';
			canvas.getContext().fillText(explanations, 50, 100);
			score.drawPoints(60, 140);
			score.drawMaxCombo(60, 180);
		},
		click: function (x, y) {
			B.Events.fire('changeState', ['game']);
		}
	};

	return state;
});
