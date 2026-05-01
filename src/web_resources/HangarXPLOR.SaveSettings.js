
var StardeckHX = StardeckHX || {};

StardeckHX.SaveSettings = function(callback)
{
  StardeckHX = StardeckHX || {};
  StardeckHX._feature = StardeckHX._feature || {};
  
  var settings                 = settings || {};
  settings._type               = StardeckHX._type || 'All';
  settings._sort               = StardeckHX._sort || 'Purchased';
  settings._pageNo             = StardeckHX._pageNo || 1;
  settings._pageCount          = StardeckHX._pageCount || 10;
  settings._logEnabled         = StardeckHX._logEnabled || false;
  settings._cacheHash          = StardeckHX._cacheHash || 0;
  settings._cacheSalt          = StardeckHX._cacheSalt || btoa(Math.random());
  
  settings._feature_LTI        = StardeckHX._feature.LTI      || '';
  settings._feature_Warbond    = StardeckHX._feature.Warbond  || '';
  settings._feature_Giftable   = StardeckHX._feature.Giftable || '';
  settings._feature_Meltable   = StardeckHX._feature.Meltable || '';
  settings._feature_Upgraded   = StardeckHX._feature.Upgraded || '';
  settings._feature_Valuable   = StardeckHX._feature.Valuable || '';
  settings._feature_Reward     = StardeckHX._feature.Reward   || '';
  settings._feature_Summary    = StardeckHX._feature.Summary  || 'cash';

  settings._setting_NoPledgeID = StardeckHX._setting.NoPledgeID || false;
  settings._setting_NoPrefix   = StardeckHX._setting.NoPrefix   || false;
  settings._setting_NoNickname = StardeckHX._setting.NoNickname || false;
  
  StardeckHX.Log('Saved Settings', settings);
  
  chrome.storage.sync.set(settings);
  
  if (typeof callback === 'function') callback.call(this);
}
