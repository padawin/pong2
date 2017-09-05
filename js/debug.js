loader.addModule('debug', 'canvas', function (canvas) {
	"use strict";

	let stack = [];

	let debug = {
		TYPE_DRAW: 1,
		TYPE_TEXT: 2,
		pushDebug: function (type, value) {
			stack.push({type: type, value: value});
		},
		processDebug: function () {
			while (stack.length) {
				let d = stack.shift();
				if (d.type == debug.TYPE_DRAW) {
					d.value(canvas.getContext());
				}
				else {
					console.log(d.value);
				}
			}
		}
	};

	return debug;
});
