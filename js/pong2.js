var __DEBUG__ = false;
loader.executeModule('main',
'B', 'canvas', 'screenSize', 'Ball', 'settings',
function (B, canvas, screenSize, Ball, settings) {
	"use strict";

	let context = canvas.getContext();
	let timePreviousFrame;
	let resources = {};

	let balls = [];
	let targets = [];

	const MAX_FPS = 60,
		INTERVAL = 1000 / MAX_FPS;

	loadResources(function() {
		initGame();
		runGame();
	});

	function loadResources(callback) {
		let resourcesData = [
		];
		var nbResources = resourcesData.length,
			loaded = 0;

		function onLoadResource () {
			loaded++;

			if (loaded == nbResources) {
				console.log("All resources loaded");
				callback();
			}
		}

		if (!nbResources) {
			callback();
			return;
		}

		for (let r in resourcesData) {
			console.log("load " + resourcesData[r].url);
			let img = new Image();
			img.onload = onLoadResource;
			img.src = resourcesData[r].url;
			resources[resourcesData[r].name] = {'img': img};
		}
	}

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
		let target;
		do {
			target = {
				x: Math.random() * canvas.getWidth(),
				y: Math.random() * canvas.getHeight(),
				radius: 5,
				expands: false
			};
		} while (Math.abs(target.x - ball.x) < canvas.getWidth() / 3);

		target.x = Math.max(30, Math.min(target.x, canvas.getWidth() - 30));
		target.y = Math.max(30, Math.min(target.y, canvas.getHeight() - 30));
		targets.push(target);
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
		}
	}

	function update() {
		balls[0].update(targets);
		updateTarget();

		let collidedTarget = balls[0].isColliding(targets);
		if (collidedTarget) {
			targets.splice(0, 1);
			createTarget(balls[0]);
		}
	}

	function updateTarget() {
		// update target
		if (targets[0].expands) {
			targets[0].radius +=2;
			if (targets[0].radius >= settings.MAX_TARGET_RADIUS) {
				targets.splice(0, 1);
				createTarget(balls[0]);
				balls[0].boost = true;
			}
		}
	}

	function draw() {
		context.clearRect(0, 0, canvas.getWidth(), canvas.getHeight());

		context.beginPath();
		//draw ball
		balls[0].draw();

		//draw target
		context.moveTo(targets[0].x, targets[0].y);
		context.arc(targets[0].x, targets[0].y, targets[0].radius, 0, 2 * Math.PI, false);
		context.fill();
		context.stroke();
	}

	function setEvents() {
		B.Events.on('click', null, click);
	}

	function click(x, y) {
		if (Math.abs(x - targets[0].x) < settings.MIN_DIST_CLICK_TARGET
			&& Math.abs(y - targets[0].y) < settings.MIN_DIST_CLICK_TARGET
		) {
			targets[0].expands = true;
		}
	}
});
