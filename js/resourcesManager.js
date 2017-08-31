loader.addModule('resourceManager', function () {
	"use strict";

	return {
		load: function (callback) {
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
	};
});
