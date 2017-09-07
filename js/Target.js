loader.addModule('Target', 'B', 'canvas', 'settings', function (B, canvas, settings) {
	"use strict";

	let Target = {
		create: function () {
			let target = {
				x: Math.random() * canvas.getWidth(),
				y: Math.random() * canvas.getHeight(),
				radius: 5,
				expands: false
			};
			target.x = Math.max(30, Math.min(target.x, canvas.getWidth() - 30));
			target.y = Math.max(30, Math.min(target.y, canvas.getHeight() - 30));

			target.update = function (targets) {
				if (target.expands) {
					target.radius +=2;
					if (target.radius >= settings.MAX_TARGET_RADIUS) {
						B.Events.fire('targetDisappeared', [target]);
					}
				}
			};

			target.draw = function () {
				let context = canvas.getContext();
				context.moveTo(target.x, target.y);
				context.arc(target.x, target.y, target.radius, 0, 2 * Math.PI, false);
			};

			return target;
		}
	};

	return Target;
});
