// Copyright (c) 2014 Christian Hartung. All rights reserved.
var Ext = Ext || {};

(function(E, undefined) {
    var closeOauthWnd;
    var clientId = "000000004C12C017";
    var clientSecret = "StKq5jGcOHyTMPcD4EO8xwDquIOz4ilF";

    chrome.windows.create({
      url: "https://login.live.com/oauth20_authorize.srf?client_id=" + clientId + "&scope=wl.basic,wl.skydrive_update&response_type=code&redirect_uri=https://login.live.com/oauth20_desktop.srf",
      focused: true,
      type: "popup"
    }, function(wnd) {
      closeOauthWnd = function() {
        chrome.windows.remove(wnd.id);
      }
    });

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        // pega o código de autorização
        var tokenUrl = "https://login.live.com/oauth20_token.srf?" +
          $.param({
            client_id : clientId,
            client_secret : clientSecret,
            redirect_uri : "https://login.live.com/oauth20_desktop.srf",
            grant_type : "authorization_code",
            code : request.auth_code
          });
        
        console.log(tokenUrl);
        
        $.get(tokenUrl, function(data) {
          console.log(data);
          OneDrivr.init(data.access_token);
        });
        
        closeOauthWnd();
      }
    );
  });

  // cria o botão
  chrome.contextMenus.create({
    "title" : chrome.i18n.getMessage("button_title"),
    "contexts" : ["image"],
    "onclick" : sendToOneDrive
  });
  
  function uploadImage(fileName, image) {
  }
  
  function sendToOneDrive(info, tab) {
    console.log(info);
    
    OneDrivr.me(function(data) {
      console.log(data);
    });
  }
})(Ext);