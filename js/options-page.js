!function() {
  function signIn() {
  }
  
  function signOut() {
    console.log("info: saindo");
  }

  function restore() {
  }
  
  function bindActions() {
    document.getElementById("signout").addEventListener("click", signOut);
  }

  function i18n() {
    document.title = chrome.i18n.getMessage("extName");
  }

  window.onload = function() {
    i18n();
    bindActions();
    restore();
  };
}();