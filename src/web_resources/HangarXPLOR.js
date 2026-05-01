
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

// Observer mode: when upstream HangarXPLOR is also installed and walking the
// hangar, the upstream-observer.js content script captures every
// /account/pledges XHR response into window.__StardeckHX_observedPledges.
// We feed those responses into ProcessPage instead of firing our own walk,
// so RSI sees one walk total instead of two.
StardeckHX._observerProcessedPages = {};
StardeckHX._processObservedPage = function(record) {
  if (StardeckHX._observerProcessedPages[record.pageNo]) return;
  StardeckHX._observerProcessedPages[record.pageNo] = true;
  var $tmp = $('<div>').html(record.html);
  var page = $tmp.find('.page-wrapper')[0] || $tmp[0];
  StardeckHX.ProcessPage(page, record.pageNo);
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

            // Wait briefly to see if upstream HangarXPLOR is fetching pledge pages.
            // If observed XHRs land in this window, leech upstream's responses
            // instead of firing our own walk. Otherwise, fall through to the
            // normal LoadCache + LoadPage flow.
            setTimeout(function() {
              var observed = window.__StardeckHX_observedPledges || [];
              if (observed.length > 0) {
                StardeckHX.Log('Observer mode: leeching from upstream HangarXPLOR');
                StardeckHX._observerMode = true;
                observed.forEach(StardeckHX._processObservedPage);
                window.addEventListener('message', function(event) {
                  if (event.source !== window) return;
                  if (!event.data || event.data.type !== 'stardeckhx.observer.pledge-response') return;
                  StardeckHX._processObservedPage({ pageNo: event.data.pageNo, html: event.data.html });
                });
              } else {
                StardeckHX.LoadCache(StardeckHX.LoadPage);
              }
            }, 1500);
          });
          
        } else {
          StardeckHX.Log('Error locating inventory');
        }
      });
    }
  });
}

if (StardeckHX._initCount++ == 0) StardeckHX.Initialize();
