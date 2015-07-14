var storageKey = "ManyClip",
  clipboardManager = function () {
    var setClipboard = function (clips) {
      var storageObject = {};
      storageObject[storageKey] = clips;

      chrome.storage.local.set(storageObject, function () {
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
  switch(request.type)
  {
    case "stackCopy":
      clipboardManager.copy(request.data.clip);
      break;
    case "stackPaste":
      clipboardManager.paste(function (clip) {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
          chrome.tabs.sendMessage(tabs[0].id, { success: true, type: "stackPaste", data: clip }, function(response) {});  
        });
      });
      break;
  }
});