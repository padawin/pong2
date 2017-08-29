(function () {
	let canvas = document.getElementById("game");
	let context = canvas.getContext("2d");
	let timePreviousFrame;
	let resources = {};

	let balls = [];
	let targets = [];

	const MIN_DIST_CLICK_TARGET = 20;
	const MAX_TARGET_RADIUS = 30;
	const BALL_CRUISE_SPEED = 3;
	const BALL_MAX_BOOST_SPEED = 8;
	const BALL_ANGULAR_SPEED = 0.05;

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
		timePreviousFrame = Date.now();
		setEvents();
		createBall();
		createTarget(balls[0]);
	}

	function createBall() {
		let ball = {
			x: Math.random() * canvas.width,
			y: Math.random() * canvas.height,
			speed: BALL_CRUISE_SPEED,
			direction: 0,
			boost: false
		};
		balls.push(ball);
	}

	function createTarget(ball) {
		let target;
		do {
			target = {
				x: Math.random() * canvas.width,
				y: Math.random() * canvas.height,
				radius: 5,
				expands: false
			};
		} while (Math.abs(target.x - ball.x) < canvas.width / 3);
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
		updateBallDirection();
		updateBallPosition();
		updateTarget();
	}

	function updateBallDirection() {
		// update ball direction
		let directionToBall = Math.atan2(
			targets[0].y - balls[0].y,
			targets[0].x - balls[0].x
		);
		if (directionToBall != balls[0].direction) {
			balls[0].direction += directionToBall > balls[0].direction ? BALL_ANGULAR_SPEED : -BALL_ANGULAR_SPEED;
		}

		if (balls[0].boost) {
			balls[0].speed += 0.4;
		}
		if (balls[0].speed > BALL_MAX_BOOST_SPEED) {
			balls[0].boost = false;
		}
		if (!balls[0].boost && balls[0].speed > BALL_CRUISE_SPEED) {
			balls[0].speed -= 0.1;
		}
		else if (balls[0].speed < BALL_CRUISE_SPEED) {
			balls[0].speed = BALL_CRUISE_SPEED;
		}
	}

	function updateBallPosition() {
		// update ball position
		let speedVector = {
			x: Math.cos(balls[0].direction) * balls[0].speed,
			y: Math.sin(balls[0].direction) * balls[0].speed
		};
		balls[0].x = (balls[0].x + speedVector.x) % canvas.width;
		balls[0].y = (balls[0].y + speedVector.y) % canvas.height;
	}

	function updateTarget() {
		// update target
		if (targets[0].expands) {
			targets[0].radius +=2;
			if (targets[0].radius >= MAX_TARGET_RADIUS) {
				targets.splice(0, 1);
				createTarget(balls[0]);
				balls[0].boost = true;
			}
		}
	}

	function draw() {
		context.clearRect(0, 0, canvas.width, canvas.height);

		context.beginPath();
		//draw ball
		context.fillStyle = 'black';
		context.arc(balls[0].x, balls[0].y, 20, 0, 2 * Math.PI, false);
		//draw target
		context.arc(targets[0].x, targets[0].y, targets[0].radius, 0, 2 * Math.PI, false);
		context.fill();
	}

	function setEvents() {
		canvas.addEventListener("click", function(e) {
			click(e.clientX, e.clientY);
		});
	}

	function click(x, y) {
		if (Math.abs(x - targets[0].x) < MIN_DIST_CLICK_TARGET
			&& Math.abs(y - targets[0].y) < MIN_DIST_CLICK_TARGET
		) {
			targets[0].expands = true;
		}
	}
})();
