loader.addModule('wall', 'canvas', function (canvas) {
	"use strict";

	let wall = {
		THICKNESS: 7,
		ballIsColliding: function (ball) {
			if (ball.x <= ball.radius + wall.THICKNESS
				|| ball.x >= canvas.getWidth() - ball.radius - wall.THICKNESS
			) {
				return 1;
			}
			else if (ball.y <= ball.radius + wall.THICKNESS
				|| ball.y >= canvas.getHeight() - ball.radius - wall.THICKNESS) {
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
			ctx.lineTo(wall.THICKNESS, wall.THICKNESS);
			ctx.lineTo(wall.THICKNESS, canvas.getHeight() - wall.THICKNESS);
			ctx.lineTo(canvas.getWidth() - wall.THICKNESS, canvas.getHeight() - wall.THICKNESS);
			ctx.lineTo(canvas.getWidth() - wall.THICKNESS, wall.THICKNESS);
			ctx.lineTo(wall.THICKNESS, wall.THICKNESS);
		}
	};

	return wall;
});
