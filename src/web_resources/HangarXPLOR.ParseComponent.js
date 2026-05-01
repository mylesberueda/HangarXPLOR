
var StardeckHX = StardeckHX || {};

StardeckHX.ParseComponent = function()
{
  var $component = $('.kind:contains(Component)', this).parent().parent();

  this.filters.is_component  = $component.length == 1;
  this.filters.has_component = $component.length >= 1;

  if (this.filters.is_component)
  {
    this.component_name      = this.pledge_name
                              .replace(/ (- )?lti/i, '')
                              .replace(/ (- )?warbond edition/i, '')
                              .replace(/ (- )?warbond/i, '')
                              .replace(/ (- )?war bond/i, '')
                              .replace(/ promo wb/i, '');
    
    if (!this.filters.has_ship) {
      for (var i = 0, j = StardeckHX._componentMatrix.length; i < j; i++) {
        if (this.component_name.toLowerCase().indexOf(StardeckHX._componentMatrix[i].name.toLowerCase()) > -1) {
          $('.basic-infos .image', this).css({ 'background-image': 'url("' + StardeckHX._componentMatrix[i].thumbnail + '")'});
          break;
        }
      }
    }
  }
}
