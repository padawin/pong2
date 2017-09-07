var __DEBUG__ = false;
loader.executeModule('main',
'B', 'canvas', 'screenSize', 'Ball', 'Target', 'settings', 'resourceManager', 'wall',
'debug',
function (B, canvas, screenSize, Ball, Target, settings, resourceManager, wall, debug) {
	"use strict";

	let context = canvas.getContext();
	let timePreviousFrame;
	let resources = {};

	let balls = [];
	let targets = [];

	const MAX_FPS = 60,
		INTERVAL = 1000 / MAX_FPS;

	resourceManager.load(function() {
		initGame();
		runGame();
	});

	function initGame() {
		canvas.resize(screenSize.get());
		timePreviousFrame = Date.now();
		setEvents();
		createBall();
		createTarget(balls[0]);
	}

	function createBall() {
		balls.push(Ball.create());
	}

	function createTarget(ball) {
		targets.push(Target.create());
	}

	function runGame() {
		// start main loop
		requestAnimationFrame(runGame);
		var now = Date.now(),
			delta = now - timePreviousFrame;

		// cap the refresh to a defined FPS
		if (delta > INTERVAL) {
			timePreviousFrame = now - (delta % INTERVAL);

			update();
			draw();
			debug.processDebug();
		}
	}

	function update() {
		let ballOldPosition = {
			x: balls[0].x,
			y: balls[0].y
		};
		balls[0].update(targets);
		let targetDies = targets[0].update();
		if (targetDies) {
			targets.splice(0, 1);
			createTarget(balls[0]);
			balls[0].boost = true;
		}

		let collidedTarget = balls[0].isColliding(targets);
		if (collidedTarget) {
			targets.splice(0, 1);
			createTarget(balls[0]);
			balls[0].boost = true;
		}
		else if (settings.options.wallBoundaries) {
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
	}

	function draw() {
		context.clearRect(0, 0, canvas.getWidth(), canvas.getHeight());

		context.beginPath();
		//draw ball
		balls[0].draw();
		targets[0].draw();

		if (settings.options.wallBoundaries) {
			wall.draw();
		}

		context.fill();
		context.stroke();
	}

	function setEvents() {
		B.Events.on('click', null, click);
	}

	function click(x, y) {
		if (settings.options.clickAnywhere
			|| Math.abs(x - targets[0].x) < settings.MIN_DIST_CLICK_TARGET
			   && Math.abs(y - targets[0].y) < settings.MIN_DIST_CLICK_TARGET
		) {
			targets[0].expands = true;
		}
	}
});
