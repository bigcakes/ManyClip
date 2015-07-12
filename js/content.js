(function (window, undefined) {
	"use strict";

	var commentParser = (function () {
		return {
			renderHtmlComments: function () {
			},
			renderCSSComments: function () {
				for (var i = 0; i < document.styleSheets.length; i++) {
					// $.get(document.styleSheets[i].href, function (response) {
					// 	//remember this is async, render comments
					// 	console.log("got css file")
					// });
				}

			},
			renderComments: function () {

			}
		};
	})();

	$(function () {

		$(document).on("keydown", function(e) {
			if((e.keyCode == 67) && e.ctrlKey && e.shiftKey) { //ctrl + shift + c
				document.execCommand('copy');
				var x = window.scrollX, 
					y = window.scrollY,
					$text = $("body")
						.append("<textarea id='ManyClipTemp' style=''></textarea>").find("#ManyClipTemp");

				$text.focus();
				document.execCommand("paste")
				var clip = $text.val();
				$text.remove();
				window.scrollTo(x, y);

				chrome.runtime.sendMessage({ type:"stackCopy", data: { clip: clip } }, function(response) {
					console.log(response);
				});

				return false;
			}
			else if((e.keyCode == 86) && e.ctrlKey && e.shiftKey) { //ctrl + shift + v
				chrome.runtime.sendMessage({ type:"stackPaste" }, function(response) {

				});

				return false;
			}
		});
	});

	chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
		if (request.type == "stackPaste") {
			console.log(request);
			var activeElement = document.activeElement,
				x = window.scrollX, 
				y = window.scrollY,
				$text = $("body").append("<textarea id='ManyClipTemp' style=''></textarea>").find("#ManyClipTemp");
			
			$text.focus().text(request.data).select()
			window.scrollTo(x, y);

			document.execCommand('copy');
			$text.remove();
			$(activeElement).focus();
			document.execCommand("paste")
		}
	});
})(window);