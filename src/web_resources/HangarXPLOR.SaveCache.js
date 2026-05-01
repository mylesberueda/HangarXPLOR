
var StardeckHX = StardeckHX || {};

StardeckHX.SaveCache = function(callback)
{
  if (StardeckHX._fromCache == true) return;
  
  var cacheItems = {};
  
  $.each(StardeckHX._raw, (index, item) => {
    cacheItems['cache:' + index] = item;
  });
  
  cacheItems['cache:count'] = StardeckHX._raw.length;
  cacheItems['cache:hash'] = StardeckHX._activeHash;
  
  delete StardeckHX._raw;
  
  chrome.storage.local.clear();
  chrome.storage.local.set(cacheItems);
  
  StardeckHX._cacheHash = StardeckHX._activeHash;
  
  StardeckHX.SaveSettings(callback);
}
