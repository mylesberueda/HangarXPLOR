
var StardeckHX = StardeckHX || {};

StardeckHX.LoadCache = function(callback)
{
  StardeckHX.Log('Load Cache');
  
  chrome.storage.local.get(null, (cache) => {
    
    if (StardeckHX._cacheHash == StardeckHX._activeHash &&
        cache['cache:hash'] == StardeckHX._cacheHash &&
        cache['cache:count'] > 0)
    {
      StardeckHX._fromCache = true;
      
      for (var i = 0; i < cache['cache:count']; i++) { StardeckHX.ParsePledge.apply($(cache['cache:' + i])[0]) }

      StardeckHX.MarkLoadingComplete();
      return;
    }
    
    StardeckHX._fromCache = false;
    if (typeof callback === 'function') callback.call(this);
    
  });
}
