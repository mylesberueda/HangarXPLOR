
/* eslint no-console: "off" */
var StardeckHX = StardeckHX || {};

StardeckHX.Log = function()
{
  if (StardeckHX._logEnabled) {
    console.log.apply(this, Array.from(arguments));
  }
}
