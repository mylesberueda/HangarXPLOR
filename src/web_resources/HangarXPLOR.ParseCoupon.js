
var StardeckHX = StardeckHX || {};

StardeckHX.ParseCoupon = function(pledgeName)
{
  this.filters.is_coupon = pledgeName.indexOf('coupon') > -1;
}
