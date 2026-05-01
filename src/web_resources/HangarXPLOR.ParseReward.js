
var StardeckHX = StardeckHX || {};

StardeckHX.ParseReward = function(pledgeName)
{
  this.filters.is_reward = pledgeName.indexOf('reward') > -1;
}
