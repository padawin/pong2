loader.addModule('wall', 'canvas', function (canvas) {
	"use strict";

	const THICKNESS = 7;

	let wall = {
		ballIsColliding: function (ball) {
			if (ball.x <= ball.radius + THICKNESS
				|| ball.x >= canvas.getWidth() - ball.radius - THICKNESS
			) {
				return 1;
			}
			else if (ball.y <= ball.radius + THICKNESS
				|| ball.y >= canvas.getHeight() - ball.radius - THICKNESS) {
				return -1;
			}

			return 0;
		},
		draw: function () {
			let ctx = canvas.getContext();
			ctx.strokeStyle = 'black';
			ctx.fillStyle = 'black';
			ctx.moveTo(0, 0);
			ctx.lineTo(canvas.getWidth(), 0);
			ctx.lineTo(canvas.getWidth(), canvas.getHeight());
			ctx.lineTo(0, canvas.getHeight());
			ctx.lineTo(0, 0);
			ctx.lineTo(THICKNESS, THICKNESS);
			ctx.lineTo(THICKNESS, canvas.getWidth() - THICKNESS);
			ctx.lineTo(canvas.getWidth() - THICKNESS, canvas.getWidth() - THICKNESS);
			ctx.lineTo(canvas.getWidth() - THICKNESS, THICKNESS);
			ctx.lineTo(THICKNESS, THICKNESS);
		}
	};

	return wall;
});
