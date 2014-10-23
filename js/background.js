// Copyright (c) 2014 Christian Hartung. All rights reserved.

function saveToOneDrive(info, tab) {
  console.log("item " + info.menuItemId + " was clicked");
  console.log("info: " + JSON.stringify(info));
  console.log("tab: " + JSON.stringify(tab));
}

// cria o botão
chrome.contextMenus.create({
  "title" : chrome.i18n.getMessage("button_title"),
  "contexts" : ["image"],
  "onclick" : saveToOneDrive
});