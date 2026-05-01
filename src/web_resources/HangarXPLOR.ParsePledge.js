
var StardeckHX = StardeckHX || {};

StardeckHX._shipCount     = StardeckHX._shipCount || 0;
StardeckHX._upgradeCount  = StardeckHX._upgradeCount || 0;
StardeckHX._giftableCount = StardeckHX._giftableCount || 0;
StardeckHX._packageCount  = StardeckHX._packageCount || 0;
StardeckHX._ltiCount      = StardeckHX._ltiCount || 0;
StardeckHX._warbondCount  = StardeckHX._warbondCount || 0;
StardeckHX._raw           = StardeckHX._raw || [];

// Apply a pre-defined filter to a list of items
StardeckHX.ParsePledge = function()
{
  // Pre-cache raw markup
  if (StardeckHX._fromCache != true) StardeckHX._raw.push(this.outerHTML);

  var pledgeName  = $('.js-pledge-name', this).val() || '';
  var $wrapper    = $('.wrapper-col', this);
  
  var h3Text     = $('.title-col h3', this)[0];

  if (pledgeName.length > 0) {

    pledgeName = pledgeName.replace(/ {2}/gi, " ")
                           .replace(/^add-ons - /i, '')
                           .replace(/^standalone ship - /i, '')
                           .replace(/^combo - /i, '')
                           .replace(/^package - /i, '')
                           .replace(/^ship upgrades - /i, '')
                           .replace(/^extras - /i, '')
                           .replace(/^paints - /i, '')
                           .trim();

    this.filters                 = {};

    this.pledge_type             = 'pledge';
    this.pledge_name             = pledgeName;
    this.pledge_id               = parseInt($('.js-pledge-id', this).val().trim());
    this.pledge_cost             = $('.js-pledge-value', this).val();
    this.displayName             = pledgeName;

    pledgeName = pledgeName.toLowerCase();

    StardeckHX.PreProcess.apply(this, [ pledgeName ]);
    StardeckHX.ParseShip.apply(this, [ pledgeName ]);
    StardeckHX.ParseComponent.apply(this, [ pledgeName ]);
    StardeckHX.ParseEquipment.apply(this, [ pledgeName ]);
    StardeckHX.ParseSkin.apply(this, [ pledgeName ]);
    StardeckHX.ParseDecoration.apply(this, [ pledgeName ]);
    StardeckHX.ParseUpgrade.apply(this, [ pledgeName ]);
    StardeckHX.ParseReward.apply(this, [ pledgeName ]);
    StardeckHX.ParseCoupon.apply(this, [ pledgeName ]);
    StardeckHX.ParseHangar.apply(this, [ pledgeName ]);

    this.melt_value              = parseFloat(this.pledge_cost.replace("$", "").replace(",", "").replace(" USD", ""));
    if (this.melt_value != this.melt_value) this.melt_value = 0; // NaN safety

    this.filters.has_squadron    = $('.title:contains(Squadron 42 Digital Download)', this).length > 0;
    this.filters.has_starcitizen = $('.title:contains(Star Citizen Digital Download)', this).length > 0;
    this.filters.is_warbond      = this.pledge_name.toLowerCase().indexOf(' warbond') > -1 || this.pledge_name.toLowerCase().indexOf(' wb') > -1 || this.pledge_name.toLowerCase().indexOf(' war bond') > -1;
    this.filters.is_meltable     = $('.js-reclaim', this).length > 0;
    this.filters.is_giftable     = $('.label:contains(Gift)', this).length > 0 && this.melt_value <= 1000;
    this.filters.is_package      = this.filters.has_squadron || this.filters.has_starcitizen;
    this.filters.has_value       = this.melt_value > 0;

    // TODO: Support for js-pledge-configuration-value
    
    this.filters.is_selected     = false;

    if (this.filters.is_ship)             this.pledge_type = 'ship';
    else if (this.filters.has_ship)       this.pledge_type = 'combo';
    else if (this.filters.has_component)  this.pledge_type = 'component';
    else if (this.filters.has_equipment)  this.pledge_type = 'equipment';
    else if (this.filters.has_skin)       this.pledge_type = 'skin';
    else if (this.filters.has_decoration) this.pledge_type = 'decoration';
    else if (this.filters.is_upgrade)     this.pledge_type = 'upgrade';
    else if (this.filters.is_coupon)      this.pledge_type = 'coupon';

    if (!this.filters.has_ship &&
        (this.filters.has_skin ? 1 : 0) +
        (this.filters.has_equipment ? 1 : 0) +
        (this.filters.has_component ? 1 : 0) +
        (this.filters.has_decoration ? 1 : 0) > 1) this.pledge_type = 'loot';
    
    if (this.filters.is_package)  StardeckHX._packageCount += 1;
    if (this.filters.is_giftable) StardeckHX._giftableCount += 1;
    
    var prefix = StardeckHX._setting.NoPrefix   ? '' : this.pledge_type + ' - ';
    var suffix = StardeckHX._setting.NoPledgeID ? '' : ' (' + this.pledge_id + ')';
    this.displayName = prefix + this.displayName + suffix;
    
    $wrapper.append($("<div>", { class: 'date-col melt-col' }).append($('<label>', { text: 'Melt Value: ' }), this.pledge_cost));
    $wrapper.append($("<div>", { class: 'items-col pledge-col' }).append($('<label>', { text: 'Base Pledge: ' }), this.pledge_name));
    
    this.sortName = this.displayName;
    h3Text.textContent = this.displayName;
    
    // if ($('.basic-infos .image', this).css('background-image') == 'url("https://cdn.robertsspaceindustries.com/static/images/Temp/default-image.png")' &&
    //     $('.items .image', this).length > 0)
    // {
    //     $('.basic-infos .image', this).css({ 'background-image': $($('.items .image', this)[0]).css('background-image') });
    // }
    
  } else {
    StardeckHX.Log('Warning: Error parsing', this.innerHTML);
  }

  StardeckHX._inventory.push(this);
}
