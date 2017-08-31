loader.executeModule('main',
'B', 'canvas', 'screenSize', 'settings',
function (B, canvas, screenSize, settings) {
	"use strict";

	let context = canvas.getContext();
	let timePreviousFrame;
	let resources = {};

	let __DEBUG__ = false;

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
		let ball = {
			x: Math.random() * canvas.getWidth(),
			y: Math.random() * canvas.getHeight(),
			radius: 20,
			speed: settings.BALL_CRUISE_SPEED,
			direction: 0,
			boost: false,
			frozen: false,
			frozenCountDown: 0
		};
		balls.push(ball);
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
		updateBallFrozen();
		updateBallDirection();
		updateBallPosition();
		updateTarget();

		testCollision();
	}

	function updateBallFrozen() {
		if (balls[0].frozen) {
			balls[0].frozenCountDown--;
			if (balls[0].frozenCountDown <= 0) {
				balls[0].frozenCountDown = 0;
				balls[0].frozen = false;
			}
		}
	}

	function updateBallDirection() {
		// update ball direction
		let directionToBall = (2 * Math.PI + Math.atan2(
			targets[0].y - balls[0].y,
			targets[0].x - balls[0].x
		)) % (2 * Math.PI);
		if (directionToBall != balls[0].direction) {
			balls[0].direction += directionToBall > balls[0].direction ? settings.BALL_ANGULAR_SPEED : -settings.BALL_ANGULAR_SPEED;
		}

		if (balls[0].boost) {
			balls[0].speed += 0.4;
		}
		if (balls[0].speed > settings.BALL_MAX_BOOST_SPEED) {
			balls[0].boost = false;
		}
		if (!balls[0].boost && balls[0].speed > settings.BALL_CRUISE_SPEED) {
			balls[0].speed -= 0.1;
		}
		else if (balls[0].speed < settings.BALL_CRUISE_SPEED) {
			balls[0].speed = settings.BALL_CRUISE_SPEED;
		}
	}

	function updateBallPosition() {
		// update ball position
		let speedVector = {
			x: Math.cos(balls[0].direction) * balls[0].speed,
			y: Math.sin(balls[0].direction) * balls[0].speed
		};
		balls[0].x = (canvas.getWidth() + balls[0].x + speedVector.x) % canvas.getWidth();
		balls[0].y = (canvas.getHeight() + balls[0].y + speedVector.y) % canvas.getHeight();
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

	function testCollision() {
		if (balls[0].frozen) {
			return;
		}

		let distanceBallTarget = Math.sqrt(
			Math.pow(targets[0].y - balls[0].y, 2) +
			Math.pow(targets[0].x - balls[0].x, 2)
		);

		if (distanceBallTarget < targets[0].radius + balls[0].radius) {
			if (targets[0].expands) {
				balls[0].direction = (balls[0].direction + Math.PI) % (Math.PI * 2)
				balls[0].frozen = true;
				balls[0].frozenCountDown = 60;
			}
			else {
				targets.splice(0, 1);
				createTarget(balls[0]);
			}
		}
	}

	function draw() {
		context.clearRect(0, 0, canvas.getWidth(), canvas.getHeight());

		context.beginPath();
		//draw ball
		drawBall(balls[0], balls[0].x, balls[0].y);

		if (balls[0].x < balls[0].radius) {
			drawBall(balls[0], balls[0].x + canvas.getWidth(), balls[0].y);
		}
		if (balls[0].x + balls[0].radius > canvas.getWidth()) {
			drawBall(balls[0], balls[0].x - canvas.getWidth(), balls[0].y);
		}
		if (balls[0].y < balls[0].radius) {
			drawBall(balls[0], balls[0].x, balls[0].y + canvas.getHeight());
		}
		if (balls[0].y + balls[0].radius > canvas.getHeight()) {
			drawBall(balls[0], balls[0].x, balls[0].y - canvas.getHeight());
		}

		//draw target
		context.moveTo(targets[0].x, targets[0].y);
		context.arc(targets[0].x, targets[0].y, targets[0].radius, 0, 2 * Math.PI, false);
		context.fill();

		// draw speed vector
		if (__DEBUG__) {
			let speedVector = {
				x: Math.cos(balls[0].direction) * balls[0].speed * 10,
				y: Math.sin(balls[0].direction) * balls[0].speed * 10
			};
			context.beginPath();
			context.moveTo(balls[0].x, balls[0].y);
			context.strokeStyle = 'red';
			context.lineTo(balls[0].x + speedVector.x, balls[0].y + speedVector.y);
			context.stroke();
		}
	}

	function drawBall(ball, x, y) {
		//draw ball
		context.fillStyle = 'black';
		context.moveTo(x, y);
		context.arc(x, y, ball.radius, 0, 2 * Math.PI, false);
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
