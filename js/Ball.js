loader.addModule('Ball',
'settings', 'canvas', 'debug', 'wall',
function (settings, canvas, debug, wall) {
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

	function _updateFrozen(ball) {
		if (ball.frozen) {
			ball.frozenCountDown--;
			if (ball.frozenCountDown <= 0) {
				ball.frozenCountDown = 0;
				ball.frozen = false;
			}
		}
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

		if (Math.abs(directionToBall - ball.direction) < settings.BALL_ANGULAR_SPEED) {
			ball.direction = directionToBall;
		}
		else if (directionToBall != ball.direction) {
			ball.direction += directionToBall > ball.direction ? settings.BALL_ANGULAR_SPEED : -settings.BALL_ANGULAR_SPEED;
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
				direction: 0,
				boost: false,
				frozen: false,
				frozenCountDown: 0
			};

			ball.update = function (targets) {
				_updateFrozen(ball);
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

			ball.isColliding = function (targets) {
				for (let target of targets) {
					if (ball.frozen) {
						return;
					}

					let distanceBallTarget = Math.sqrt(
						Math.pow(target.y - ball.y, 2) +
						Math.pow(target.x - ball.x, 2)
					);

					if (distanceBallTarget < target.radius + ball.radius) {
						if (target.expands) {
							ball.direction = (ball.direction + Math.PI) % (Math.PI * 2);
							ball.frozen = true;
							ball.frozenCountDown = 60;
						}
						return target;
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
