
var StardeckHX = StardeckHX || {};

StardeckHX.LoadSettings = function(callback)
{
  chrome.storage.sync.get(null, function(settings) {
    settings = settings || {};
    
    StardeckHX                     = StardeckHX || {};
    StardeckHX._type               = settings._type || 'All';
    StardeckHX._sort               = settings._sort || 'Purchased';
    StardeckHX._pageNo             = settings._pageNo || 1;
    StardeckHX._pageCount          = settings._pageCount || 10;
    StardeckHX._logEnabled         = settings._logEnabled || false;
    StardeckHX._cacheHash          = settings._cacheHash || 0;
    StardeckHX._cacheSalt          = settings._cacheSalt || btoa(Math.random());
    
    StardeckHX._feature            = StardeckHX._feature       || {};
    StardeckHX._feature.LTI        = settings._feature_LTI      || '';
    StardeckHX._feature.Warbond    = settings._feature_Warbond  || '';
    StardeckHX._feature.Giftable   = settings._feature_Giftable || '';
    StardeckHX._feature.Meltable   = settings._feature_Meltable || '';
    StardeckHX._feature.Upgraded   = settings._feature_Upgraded || '';
    StardeckHX._feature.Valuable   = settings._feature_Valuable || '';
    StardeckHX._feature.Reward     = settings._feature_Reward   || '';
    StardeckHX._feature.Summary    = settings._feature_Summary  || 'cash';

    StardeckHX._setting            = StardeckHX._setting       || {};
    StardeckHX._setting.NoPledgeID = settings._setting_NoPledgeID || false;
    StardeckHX._setting.NoPrefix   = settings._setting_NoPrefix   || false;
    StardeckHX._setting.NoNickname = settings._setting_NoNickname || false;
    
    StardeckHX.Log('Loaded Settings', settings);
    
    if (typeof callback === 'function') callback.call(this);
  });
}
