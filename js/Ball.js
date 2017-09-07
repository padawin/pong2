loader.addModule('Ball',
'settings', 'canvas', 'debug', 'wall', 'B',
function (settings, canvas, debug, wall, B) {
	"use strict";

	function _draw(x, y, radius) {
		canvas.getContext().strokeStyle = 'black';
		canvas.getContext().fillStyle = 'black';
		canvas.getContext().moveTo(x, y);
		canvas.getContext().arc(x, y, radius, 0, 2 * Math.PI, false);
	}

	function _findClosestTarget(ball, targets) {
		return targets[0];
	}

	function _updateDirection(ball, targets) {
		let target = _findClosestTarget(ball, targets);
		let directionToBall = (2 * Math.PI + Math.atan2(
			target.y - ball.y,
			target.x - ball.x
		)) % (2 * Math.PI);
		if (__DEBUG__) {
			debug.pushDebug(debug.TYPE_DRAW, function (context) {
				let speedVector = {
					x: Math.cos(directionToBall) * ball.speed * 20,
					y: Math.sin(directionToBall) * ball.speed * 20
				};
				context.beginPath();
				context.moveTo(ball.x, ball.y);
				context.strokeStyle = 'blue';
				context.lineTo(ball.x + speedVector.x, ball.y + speedVector.y);
				context.stroke();
			});
		}

		let deltaDirections = directionToBall - ball.direction;
		if (Math.abs(deltaDirections) < settings.BALL_ANGULAR_SPEED) {
			ball.direction = directionToBall;
		}
		else if (directionToBall != ball.direction) {
			// find the smallest angle change to go to the ball
			if (deltaDirections > Math.PI || deltaDirections > -Math.PI && deltaDirections < 0) {
				ball.direction -= settings.BALL_ANGULAR_SPEED;
			}
			else {
				ball.direction += settings.BALL_ANGULAR_SPEED;
			}
			ball.direction = (Math.PI * 2 + ball.direction) % (Math.PI * 2)
		}

		if (ball.boost) {
			ball.speed += 0.4;
		}
		if (ball.speed > settings.BALL_MAX_BOOST_SPEED) {
			ball.boost = false;
		}
		if (!ball.boost && ball.speed > settings.BALL_CRUISE_SPEED) {
			ball.speed -= 0.1;
		}
		else if (ball.speed < settings.BALL_CRUISE_SPEED) {
			ball.speed = settings.BALL_CRUISE_SPEED;
		}
	}

	function _updatePosition(ball) {
		// update ball position
		let speedVector = {
			x: Math.cos(ball.direction) * ball.speed,
			y: Math.sin(ball.direction) * ball.speed
		};
		ball.x = (canvas.getWidth() + ball.x + speedVector.x) % canvas.getWidth();
		ball.y = (canvas.getHeight() + ball.y + speedVector.y) % canvas.getHeight();
	}

	let Ball = {
		create: function () {
			let radius = 20;
			let min;
			if (settings.options.wallBoundaries) {
				min = wall.THICKNESS + radius;
			}
			else {
				min = radius;
			}
			let maxX = canvas.getWidth() - min;
			let maxY = canvas.getHeight() - min;
			let x = Math.random() * (maxX - min + 1);
			let y = Math.random() * (maxY - min + 1);
			x += min;
			y += min;
			let ball = {
				x: x,
				y: y,
				radius: radius,
				speed: settings.BALL_CRUISE_SPEED,
				direction: Math.random() * (Math.PI * 2),
				boost: false
			};

			ball.update = function (targets) {
				_updateDirection(ball, targets);
				_updatePosition(ball);

				// draw speed vector
				if (__DEBUG__) {
					debug.pushDebug(debug.TYPE_DRAW, function (context) {
						let speedVector = {
							x: Math.cos(ball.direction) * ball.speed * 20,
							y: Math.sin(ball.direction) * ball.speed * 20
						};
						context.beginPath();
						context.moveTo(ball.x, ball.y);
						context.strokeStyle = 'red';
						context.lineTo(ball.x + speedVector.x, ball.y + speedVector.y);
						context.stroke();
					});
				}
			};

			ball.draw = function () {
				_draw(ball.x, ball.y, ball.radius);

				if (ball.x < ball.radius) {
					_draw(ball.x + canvas.getWidth(), ball.y, ball.radius);
				}
				if (ball.x + ball.radius > canvas.getWidth()) {
					_draw(ball.x - canvas.getWidth(), ball.y, ball.radius);
				}
				if (ball.y < ball.radius) {
					_draw(ball.x, ball.y + canvas.getHeight(), ball.radius);
				}
				if (ball.y + ball.radius > canvas.getHeight()) {
					_draw(ball.x, ball.y - canvas.getHeight(), ball.radius);
				}
			};

			ball.testCollision = function (targets) {
				for (let target of targets) {
					let distanceBallTarget = Math.sqrt(
						Math.pow(target.y - ball.y, 2) +
						Math.pow(target.x - ball.x, 2)
					);

					if (distanceBallTarget < target.radius + ball.radius) {
						if (target.expands) {
							ball.direction = (ball.direction + Math.PI) % (Math.PI * 2);
						}
						B.Events.fire('targetCollided', [target]);
					}
				}
			};

			ball.bounce = function (way) {
				let speedVector = {
					x: ball.speed * Math.cos(ball.direction),
					y: ball.speed * Math.sin(ball.direction)
				};
				if (way == -1) {
					speedVector.y *= -1;
				}
				else if (way == 1) {
					speedVector.x *= -1;
				}

				ball.direction = Math.atan2(speedVector.y, speedVector.x);
			};

			return ball;
		}
	};

	return Ball;
});
