(function (window, undefined) {
	"use strict";
	
	var textArea = "<textarea id='ManyClipTemp' style='z-index:-1;opacity:0;'></textarea>";

	$(function () {

		$(document).on("keydown", function(e) {
			if((e.keyCode === 67) && e.ctrlKey && e.altKey) { //ctrl + alt + c
				document.execCommand('copy');
				var x = window.scrollX, 
					y = window.scrollY,
					$text = $("body").append(textArea).find("#ManyClipTemp");

				$text.focus();
				document.execCommand("paste")
				var clip = $text.val();
				$text.remove();
				window.scrollTo(x, y);

				chrome.runtime.sendMessage({ type:"stackCopy", data: { clip: clip } }, function(response) {
				});

				return false;
			}
			else if((e.keyCode == 86) && e.ctrlKey && e.altKey) { //ctrl + alt + v
				chrome.runtime.sendMessage({ type:"stackPaste" }, function(response) {

				});

				return false;
			}
		});
	});

	chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
		if (request.type === "stackPaste") {
			var activeElement = document.activeElement,
				x = window.scrollX, 
				y = window.scrollY,
				$text = $("body").append(textArea).find("#ManyClipTemp");
			
			$text.focus().text(request.data).select()
			window.scrollTo(x, y);

			document.execCommand('copy');
			$text.remove();
			$(activeElement).focus();
			document.execCommand("paste")
		}
	});
})(window);