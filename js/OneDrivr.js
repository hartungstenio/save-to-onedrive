var OneDrivr = OneDrivr || {};

(function(O, undefined) {
  var accessToken;
  
  O.init = function(token) {
    accessToken = token;
    console.log("using access token: " + accessToken);
  }
  
  O.me = function(callback) {
    get("me", callback);
  }
  
  O.putInCameraRoll = function(name, what, replace, callback) {
    put("me/skydrive/camera_roll/" + name, what, replace, callback);
  }

  function get(resource, callback) {
    var url = "https://apis.live.net/v5.0/" + resource + "?access_token=" + accessToken;
    $.get(url, callback);
  }
  
  function put(resourceName, resourceContent, callback) {
    var url = "https://apis.live.net/v5.0/"  + resourceName + "?" +
      $.param({
        access_token : accessToken,
        overwrite : replace ? "true" : "ChooseNewName"
      });
      
    $.ajax({
      type : "PUT",
      url: url,
      data : resourceContent,
      success : callback
    });
  }
})(OneDrivr);