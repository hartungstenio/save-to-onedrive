function OneDrive(config) {
  this.accessToken = config.accessToken;
}

OneDrive.prototype.getUser = function(success, error) {
  this.get("me", success, error);
}

OneDrive.prototype.takePicture = function(name, content, success, error) {
  this.sendFile("me/skydrive/camera_roll/files/" + name, content, false, success, error);
}

OneDrive.prototype.sendFile = function(destination, content, replace, success, error) {
  this.put(destination, content, replace, success, error);
}

OneDrive.prototype.get = function(resource, success, error) {
  var url = "https://apis.live.net/v5.0/" + resource + "?access_token=" + this.accessToken;
  
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.send(null);
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      success(xhr.responseText);
    }
  };
}

OneDrive.prototype.put = function(resource, content, replace, success, error) {
  var url = 'https://apis.live.net/v5.0/'  + resource + "?access_token=" + this.accessToken +
    '&overwrite=' + (replace ? 'true' : 'ChooseNewName');
    
  var xhr = new XMLHttpRequest();
  xhr.open('PUT', url, true);
  xhr.setRequestHeader("Content-type", '');
  xhr.send(content);
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      success(xhr.responseText);
    }
  };
}