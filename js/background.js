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
      copy: function (value, callback) {
        chrome.storage.local.get(storageKey, function (result) {
          var clips = result.ManyClip;

          if (clips && clips.copies) {
          } else {
            clips = {
              copies: []
            };
          }

          clips.copies.push(value);

          setClipboard(clips);

          callback();
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

          var poppedClip = clips.copies.pop();

          setClipboard(clips);

          callback(poppedClip);
        });
      },
      list: function (callback) {
        chrome.storage.local.get(storageKey, function (result) {
          var clips = result.ManyClip;

          if (clips && clips.copies){
          } else {
            clips = {
              copies: []
            };
          }

          callback(clips.copies);
        });
      }
    }
  }(),
  sendList = function () {
    clipboardManager.list(function (clips) {
      chrome.runtime.sendMessage({ success: true, type: "listClips", data: clips });
    });
  };

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  switch(request.type)
  {
    case "stackPaste":
      clipboardManager.paste(function (clip) {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
          chrome.tabs.sendMessage(tabs[0].id, { success: true, type: "stackPaste", data: clip }, function(response) {});  
        });

        //Also list out any removed clip
        sendList();
      });

      break;
    case "stackCopy":
      clipboardManager.copy(request.data.clip, function () {
        //Also list out any new clip
        sendList();
      });

      break;
    case "list":
      sendList();
      break;
  }
});