
var StardeckHX = StardeckHX || {};

StardeckHX.ParseUpgrade = function()
{
  this.filters.is_upgrade = $('.js-upgrade-data', this).length > 0;
  
  if (this.filters.is_upgrade)
  {
    this.upgrade_data = JSON.parse($('.js-upgrade-data', this).val());

    $('.title:contains(Upgrade)', this).after('<div class="kind">Upgrade</div>');

    StardeckHX._upgradeCount += 1;

    this.displayName = this.upgrade_data.match_items[0].name + ' to ' + this.upgrade_data.target_items[0].name

    var target_name = this.upgrade_data.target_items[0].name;
    var i, j;
    for (i = 0, j = StardeckHX._shipMatrix.length; i < j; i++) {
      if (target_name.toLowerCase().indexOf(StardeckHX._shipMatrix[i].name.toLowerCase()) > -1) {

        StardeckHX.Log('Matched', StardeckHX._shipMatrix[i].name, 'in', target_name);

        target_name = (StardeckHX._shipMatrix[i].displayName || StardeckHX._shipMatrix[i].name);
        if (StardeckHX._shipMatrix[i].thumbnail != undefined) {
          $('.basic-infos .image', this).css({ 'background-image': 'url("' + StardeckHX._shipMatrix[i].thumbnail + '")'});
        }
        break;
      }
    }
  }
}
