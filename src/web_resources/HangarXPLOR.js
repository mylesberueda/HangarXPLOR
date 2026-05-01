
var StardeckHX = StardeckHX || {};

StardeckHX.UpdateStatus = StardeckHX.UpdateStatus || function() {};
StardeckHX.MarkLoadingComplete = StardeckHX.MarkLoadingComplete || function() {
  if (typeof StardeckHX.GetCombinedList === 'function' && chrome && chrome.storage && chrome.storage.local) {
    try {
      var combined = StardeckHX.GetCombinedList($(StardeckHX._inventory));
      chrome.storage.local.set({ 'cache:parsed_export': {
        generatedAt: new Date().toISOString(),
        ships:       combined.ships,
        upgrades:    combined.upgrades
      }});
    } catch (e) {
      if (StardeckHX.Log) StardeckHX.Log('snapshot failed', e);
    }
  }
};

StardeckHX.$list = null;                            // Element where we display the pledges
StardeckHX._inventory = [];                         // Inventory containing all pledges
StardeckHX._debugRoot = $('#StardeckHX-js-0').attr('src').replace(/(.*)web_resources.*/, "$1");
StardeckHX._shipCount     = StardeckHX._shipCount || 0;
StardeckHX._upgradeCount  = StardeckHX._upgradeCount || 0;
StardeckHX._giftableCount = StardeckHX._giftableCount || 0;
StardeckHX._packageCount  = StardeckHX._packageCount || 0;
StardeckHX._ltiCount      = StardeckHX._ltiCount || 0;
StardeckHX._cacheSalt     = StardeckHX._cacheSalt || btoa(Math.random());
StardeckHX._initCount     = StardeckHX._initCount || 0;

var RSI = RSI || {};

StardeckHX.Initialize = function()
{  
  $.ajax({ 
    url: '/ship-matrix/index', 
    method: 'GET', 
    dataType: 'json', 
    success: (response) => { 
      
      var customShips = $.extend({}, StardeckHX._ships);
      
      StardeckHX._shipMatrix = response.data
        .map((ship) => {
          var rsiShip = {
            name: ship.name
              .replace(/^Aegis /i, '')
              .replace(/^Anvil /i, '')
              .replace(/^Aopoa /i, '')
              .replace(/^Argo /i, '')
              .replace(/^Banu /i, '')
              .replace(/^CNOU /i, '')
              .replace(/^Drake /i, '')
              .replace(/^Esperia /i, '')
              .replace(/^Greycat /i, '')
              .replace(/^Kruger /i, '')
              .replace(/^MISC /i, '')
              .replace(/^Origin /i, '')
              .replace(/^RSI /i, '')
              .replace(/^Tumbril /i, '')
              .replace(/^Vanduul /i, '')
              .replace(/^Xi'an /i, '')
              .trim(),
            thumbnail: ship.media[0].images.heap_infobox,
            url: ship.url,
            focus: ship.focus,
          };
          
          var customShip = StardeckHX._ships[rsiShip.name];

          delete customShips[rsiShip.name];

          return $.extend({}, rsiShip, customShip);
        })
      
        .concat($.map(customShips, (ship, key) => {
          if (ship.name == undefined) ship.name = key;
          return ship;
        }))
      
        .sort((a, b) => {
          if (a.name.length > b.name.length) return -1;
          if (a.name < b.name) return 0;
          return 1;
        });
      
      StardeckHX._componentMatrix = []
        .concat($.map(StardeckHX._components, (component, key) => {
          if (component.name == undefined) component.name = key;
          return component;
        }))
        .sort((a, b) => {
          if (a.name.length > b.name.length) return -1;
          if (a.name < b.name) return -1;
          return 1;
        });
      
      StardeckHX.LoadSettings(function() {
        var $lists = $('.list-items');
        
        if ($lists.length == 1) {
          StardeckHX.$list = $($lists[0]);
          StardeckHX.$list.addClass('js-inventory');
          $lists = undefined;
          
          StardeckHX.UpdateStatus(0);
          
          RSI.Api.Account.pledgeLog((payload) => {

            var today = new Date().toISOString();
            var safetySalt = '';

            // CIG Released ship naming in March 2021, which requires us to invalidate cache
            if (today.substr(0, 7) == '2021-03') safetySalt = today.substr(0, 13) + ':';

            StardeckHX._activeHash = safetySalt + payload.data.rendered.length + ':' + btoa(payload.data.rendered.substr(39, 20)) + ':' + StardeckHX._cacheSalt;

            StardeckHX.LoadCache(StardeckHX.LoadPage);
          });
          
        } else {
          StardeckHX.Log('Error locating inventory');
        }
      });
    }
  });
}

if (StardeckHX._initCount++ == 0) StardeckHX.Initialize();
