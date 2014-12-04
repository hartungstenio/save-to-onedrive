// Copyright (c) 2014 Christian Hartung. All rights reserved.
var Ext = Ext || {};

(function(E, undefined) {
    var closeOauthWnd;
    var clientId = "000000004C12C017";
    var clientSecret = "StKq5jGcOHyTMPcD4EO8xwDquIOz4ilF";
    var onedrive;
    
    function authenticate(next) {
      chrome.windows.create({
        url: "https://login.live.com/oauth20_authorize.srf?" + 'client_id='+ clientId +
                                                               '&scope=' + 'wl.signin%20wl.basic%20wl.skydrive_update' +
                                                               '&response_type=code' +
                                                               '&redirect_uri=https://login.live.com/oauth20_desktop.srf',
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
            'client_id=' + clientId +
            '&client_secret=' + clientSecret +
            '&redirect_uri=https://login.live.com/oauth20_desktop.srf' +
            '&grant_type=authorization_code' +
            '&code=' + request.auth_code;
            
          var xhr = new XMLHttpRequest();
          xhr.open('GET', tokenUrl, true);
          xhr.send(null);
          xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
              var data = JSON.parse(xhr.responseText);
              onedrive = new OneDrive({ accessToken : data.access_token });
              next();
            }
          };
          
          closeOauthWnd();
        }
      );
    }

  // cria o botão
  chrome.contextMenus.create({
    "title" : chrome.i18n.getMessage("button_title"),
    "contexts" : ["image"],
    "onclick" : sendToOneDrive
  });
  
  function getDataUri(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var context = canvas.getContext("2d");
    context.drawImage(img, 0, 0);
    return canvas.toDataURL("image/png");
  }
  
  var BASE64_MARKER = ';base64,';
  
  function getPng(dataUri) {
    var base64Index = dataUri.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
    var base64 = dataUri.substring(base64Index);
    var raw = window.atob(base64);
    var rawLength = raw.length;
    var array = new Uint8Array(new ArrayBuffer(rawLength));
   
    for(i = 0; i < rawLength; i++) {
      array[i] = raw.charCodeAt(i);
    }
    return array;
  }
  
  function prepareAndUpload() {
    var data = getDataUri(this);
    var bin = getPng(data);
    
    var filename = this.src.substring(this.src.lastIndexOf('/')+1);
    filename = filename.substring(0, filename.lastIndexOf('.'));
    
    if(filename == '') {
      var d = new Date();
      filename = d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate();
    }

    filename = filename + '.png';
    
    onedrive.takePicture(filename, bin);
  }
  
  function sendToOneDrive(info, tab) {
    if(onedrive == null) {
      authenticate(function() {
        var img = new Image();
        img.src = info.srcUrl;
        img.onload = prepareAndUpload;
      });
    } else {
      var img = new Image();
      img.src = info.srcUrl;
      img.onload = prepareAndUpload;
    }
  }
})(Ext);