loader.addModule('gameState',
'Ball', 'Target', 'canvas', 'B', 'settings', 'score', 'wall', 'lives',
function (Ball, Target, canvas, B, settings, score, wall, lives) {
	"use strict";

	let context = canvas.getContext();
	let balls = [];
	let targets = [];

	function createBall() {
		balls.push(Ball.create());
	}

	function createTarget(ball) {
		targets.push(Target.create());
	}

	function targetDisappearedEvent(target) {
		targets.splice(targets.indexOf(target), 1);
		createTarget(balls[0]);
		balls[0].boost = true;
		if (Math.random() > settings.PROBA_ENABLE_WALLS) {
			B.Events.fire('wallsAppeared');
		}
	}

	function lose() {
		B.Events.fire('changeState', ['lose']);
	}

	function startWallCountDown() {
		if (settings.wallBoundaries) {
			return;
		}

		settings.wallBoundaries = true;
		setTimeout(
			function () {
				settings.wallBoundaries = false;
			},
			settings.DURATION_WALLS
		)
	}

	let state = {
		init: function () {
			createBall();
			createTarget(balls[0]);
			B.Events.on('targetDisappeared', null, targetDisappearedEvent);
			B.Events.on('targetCollided', null, targetDisappearedEvent);
			B.Events.on('wallsAppeared', null, startWallCountDown);
			B.Events.on('lost', null, lose);
		},
		update: function () {
			let ballOldPosition = {
				x: balls[0].x,
				y: balls[0].y
			};
			balls[0].update(targets);
			targets[0].update();

			balls[0].testCollision(targets);
			if (settings.wallBoundaries) {
				// 0 if no collision,
				// 1 if collision vertical wall
				// -1 if collision horizontal wall
				let way = wall.ballIsColliding(balls[0]);
				if (way) {
					balls[0].x = ballOldPosition.x;
					balls[0].y = ballOldPosition.y;
					balls[0].bounce(way);
				}
			}

			score.update();
		},
		draw: function () {
			context.clearRect(0, 0, canvas.getWidth(), canvas.getHeight());

			context.beginPath();
			//draw ball
			balls[0].draw();
			targets[0].draw();

			if (settings.wallBoundaries) {
				wall.draw();
			}

			lives.draw();
			score.drawPoints(50, 100);
			score.drawLatestPoints();

			context.fill();
			context.stroke();
		},
		click: function (x, y) {
			if (settings.options.clickAnywhere
				|| Math.abs(x - targets[0].x) < settings.MIN_DIST_CLICK_TARGET
				&& Math.abs(y - targets[0].y) < settings.MIN_DIST_CLICK_TARGET
			) {
				targets[0].expands = true;
			}
		}
	};

	return state;
});
