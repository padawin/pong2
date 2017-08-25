(function () {
	let canvas = document.getElementById("game");
	let context = canvas.getContext("2d");
	let timePreviousFrame;
	let resources = {};

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
	}

	function draw() {
	}

	function setEvents() {
		canvas.addEventListener("click", function(e) {
			click(e.clientX, e.clientY);
		});
	}

	function click(x, y) {
	}
})();
