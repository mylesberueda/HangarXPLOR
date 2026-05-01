(function() {
    'use strict';

    var TRUSTED_ORIGINS = [
        'https://stardeck.space/*',
        'http://localhost/*'
    ];
    var SNAPSHOT_KEY = 'cache:parsed_export';
    var MSG_REQUEST  = 'HangarXPLOR:request';
    var MSG_RESPONSE = 'HangarXPLOR:response';

    function currentOriginPattern() {
        var hostname = window.location.hostname;
        var protocol = window.location.protocol;
        if (hostname.length === 0) return null;
        if (protocol === 'https:') return 'https://' + hostname + '/*';
        if (protocol === 'http:' && hostname === 'localhost') return 'http://localhost/*';
        return null;
    }

    function isCurrentOriginTrusted() {
        var pattern = currentOriginPattern();
        return pattern !== null && TRUSTED_ORIGINS.indexOf(pattern) !== -1;
    }

    var VERSION = (chrome.runtime && chrome.runtime.getManifest) ? chrome.runtime.getManifest().version : null;

    function respond(requestId, status, payload) {
        var message = { type: MSG_RESPONSE, requestId: requestId, status: status, version: VERSION };
        if (status === 'ok') message.data = payload; else message.error = payload;
        window.postMessage(message, window.location.origin);
    }

    window.addEventListener('message', function(event) {
        if (event.source !== window) return;
        var data = event.data;
        if (!data || typeof data !== 'object') return;
        if (data.type !== MSG_REQUEST) return;
        if (typeof data.requestId !== 'string' || data.requestId.length === 0) return;

        var requestId = data.requestId;

        if (!isCurrentOriginTrusted()) {
            respond(requestId, 'error', 'not_trusted');
            return;
        }

        chrome.storage.local.get(SNAPSHOT_KEY, function(items) {
            var snapshot = items[SNAPSHOT_KEY];
            if (!snapshot) {
                respond(requestId, 'error', 'no_data');
                return;
            }
            respond(requestId, 'ok', snapshot);
        });
    });
})();
