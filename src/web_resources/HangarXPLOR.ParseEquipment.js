
var StardeckHX = StardeckHX || {};

StardeckHX.ParseEquipment = function()
{
  var $equipment = $('.kind:contains(FPS Equipment)', this).parent().parent();

  this.filters.is_equipment  = $equipment.length == 1;
  this.filters.has_equipment = $equipment.length >= 1;
}
