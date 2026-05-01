
var chrome = chrome || {};
chrome.storage = chrome.storage || {};
chrome.storage.local = chrome.storage.local || {};
chrome.storage.sync = chrome.storage.sync || {};

(function(){
  var callbackIndex = 0;
  var callbacks = [];
  var emptyCallback = function() {};
  
  var cacheCallback = function(callback) {
    var key = btoa(window.crypto.getRandomValues(new Uint32Array(1)) * 100 + (callbackIndex++ % 100));
    callbacks[key] = callback || emptyCallback;
    return key;
  }
  
  chrome.storage.sync.get = function(payload, callback) {
    var key = cacheCallback(callback);
    window.postMessage({ type: "stardeckhx.storage.sync.get.request", payload: payload, callbackIndex: key }, "*");
  }

  chrome.storage.sync.set = function(payload, callback) {
    var key = cacheCallback(callback);
    window.postMessage({ type: "stardeckhx.storage.sync.set.request", payload: payload, callbackIndex: key }, "*");
  }

  chrome.storage.sync.remove = function(payload, callback) {
    var key = cacheCallback(callback);
    window.postMessage({ type: "stardeckhx.storage.sync.remove.request", payload: payload, callbackIndex: key }, "*");
  }

  chrome.storage.sync.clear = function(payload, callback) {
    var key = cacheCallback(callback);
    window.postMessage({ type: "stardeckhx.storage.sync.clear.request", payload: payload, callbackIndex: key }, "*");
  }

  chrome.storage.local.get = function(payload, callback) {
    var key = cacheCallback(callback);
    window.postMessage({ type: "stardeckhx.storage.local.get.request", payload: payload, callbackIndex: key }, "*");
  }

  chrome.storage.local.set = function(payload, callback) {
    var key = cacheCallback(callback);
    window.postMessage({ type: "stardeckhx.storage.local.set.request", payload: payload, callbackIndex: key }, "*");
  }

  chrome.storage.local.remove = function(payload, callback) {
    var key = cacheCallback(callback);
    window.postMessage({ type: "stardeckhx.storage.local.remove.request", payload: payload, callbackIndex: key }, "*");
  }

  chrome.storage.local.clear = function(payload, callback) {
    var key = cacheCallback(callback);
    window.postMessage({ type: "stardeckhx.storage.local.clear.request", payload: payload, callbackIndex: key }, "*");
  }

  window.addEventListener('message', function(event) {
    if (event.source != window) return;
    if ((event.data.type || false) == false) return;

    switch (event.data.type)
    {
      case 'stardeckhx.storage.get.response':
      case 'stardeckhx.storage.set.response':
      case 'stardeckhx.storage.remove.response':
      case 'stardeckhx.storage.clear.response':
        if (callbacks[event.data.callbackIndex] != undefined)
        {
          callbacks[event.data.callbackIndex](event.data.result);
          delete callbacks[event.data.callbackIndex];
        }
      break;
    }
  });
})();
