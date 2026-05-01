// Runs at document_start on RSI hangar pages. Its only job: inject a page-world
// <script> that wraps XMLHttpRequest so upstream HangarXPLOR's `$.ajax` fetches
// for /account/pledges?page=N are observed by Stardeck Edition.
//
// The page-world script posts observed responses back via window.postMessage
// with type 'stardeckhx.observer.pledge-response'. The main loader.js (running
// at document_end on the same page) listens for those messages and decides
// whether Stardeck Edition should leech upstream's data instead of firing its
// own walk.
//
// Without this, both extensions independently fetch every page of the user's
// hangar when both are installed, doubling RSI's load.
(function() {
    var MARKER = '__StardeckHX_xhrPatched';
    var MSG_TYPE = 'stardeckhx.observer.pledge-response';

    var patchSource = '(' + function(marker, msgType, bufferKey) {
        if (window[marker]) return;
        window[marker] = true;
        window[bufferKey] = window[bufferKey] || [];

        var origOpen = XMLHttpRequest.prototype.open;
        var origSend = XMLHttpRequest.prototype.send;

        XMLHttpRequest.prototype.open = function(method, url) {
            this.__stardeck_url = url;
            return origOpen.apply(this, arguments);
        };

        XMLHttpRequest.prototype.send = function() {
            var xhr = this;
            var url = xhr.__stardeck_url;
            if (typeof url === 'string' && url.indexOf('/account/pledges') !== -1) {
                xhr.addEventListener('load', function() {
                    if (xhr.status !== 200) return;
                    var match = url.match(/[?&]page=(\d+)/);
                    var pageNo = match ? parseInt(match[1], 10) : 1;
                    var record = { url: url, pageNo: pageNo, html: xhr.responseText, observedAt: Date.now() };
                    window[bufferKey].push(record);
                    window.postMessage({ type: msgType, pageNo: pageNo, html: xhr.responseText }, window.location.origin);
                });
            }
            return origSend.apply(this, arguments);
        };
    } + ')(' + JSON.stringify(MARKER) + ', ' + JSON.stringify(MSG_TYPE) + ', ' + JSON.stringify('__StardeckHX_observedPledges') + ');';

    var script = document.createElement('script');
    script.textContent = patchSource;
    (document.head || document.documentElement).appendChild(script);
    script.remove();
})();
