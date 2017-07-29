(function () {
	"use strict";

	chrome.runtime.sendMessage({ type:"list", data: null }, function(response) {
	});
	
	chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
		if (request.type === "listClips") {			
			console.log("clips", request.data);

			var $tbody = $(".stack-contents tbody");
			$tbody.empty();

			request.data.reverse().map(function (clip, index) {
				var $newRow = $("<tr></tr>");

				$newRow.append($("<td></td>").text(index));
				$newRow.append($("<td></td>").text(clip));

				$tbody.append($newRow);
			})
		}
	});
})();