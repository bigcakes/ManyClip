var storageKey = "ManyClip",
  clipboardManager = function () {
    var setClipboard = function (clips) {
      var storageObject = {};
      storageObject[storageKey] = clips;

      chrome.storage.local.set(storageObject, function () {
          console.log('Saved', value);
          console.log(chrome.runtime.lastError);
      });
    }

    return {
      copy: function (value) {
        chrome.storage.local.get(storageKey, function (result) {
          var clips = result.ManyClip;

          if (clips && clips.copies) {
          } else {
            clips = {
              copies: []
            };
          }

          clips.copies.push(value);

          setClipboard(clips)
        });
      },
      paste: function (callback) {
        chrome.storage.local.get(storageKey, function (result) {
          var clips = result.ManyClip;

          if (clips && clips.copies){
          } else {
            clips = {
              copies: []
            };
          }

          callback(clips.copies.pop());

          setClipboard(clips)
        });
      }
    }
  }();




chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log(sender.tab ?
              "from a content script:" + sender.tab.url :
              "from the extension");
  switch(request.type)
  {
    case "stackCopy":
      clipboardManager.copy(request.data.clip);
      break;
    case "stackPaste":
      clipboardManager.paste(function (clip) {
        sendResponse({ success: true, data: clip })
      });
      break;
    case "getSnibbits":
      snibbits.getSnibbits(function (snibbits) {
        sendResponse({ success: true, data: snibbits, message: "Snibbits loaded" });
      });
      break;
  }
});