/**
 * parses and returns URI query parameters 
 * http://stackoverflow.com/questions/979975/how-to-get-the-value-from-url-parameter 
 *
 * @param {string} param parm
 * @param {bool?} asArray if true, returns an array instead of a scalar 
 * @returns {Object|Array} 
 */
function getURIParameter(param, asArray) {
  return document.location.search.substring(1).split('&').reduce(function(p,c) {
      var parts = c.split('=', 2).map(function(param) { return decodeURIComponent(param); });
      if(parts.length == 0 || parts[0] != param) return (p instanceof Array) && !asArray ? null : p;
      return asArray ? p.concat(parts.concat(true)[1]) : parts.concat(true)[1];
  }, []);
}

var code = getURIParameter("code");

console.log('aijdnbaikdna');

if(code !== "undefined") {
  chrome.runtime.sendMessage({ auth_code : code }, function(response) {
    // a janela será fechada, então não faz nada
  });
}