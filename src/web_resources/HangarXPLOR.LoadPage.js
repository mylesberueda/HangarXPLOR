
var StardeckHX = StardeckHX || {};

StardeckHX._throttleAfterPage = 50;   // start throttling after this page number
StardeckHX._throttleDelay     = 500;  // ms to wait between pages once throttling kicks in
StardeckHX._retryDelay        = 5000; // ms for first retry after a 429; multiplied by attempt number
StardeckHX._maxRetries        = 5;

// Load a page of pledges from RSI
StardeckHX.LoadPage = function(pageNo, retryCount)
{
  pageNo     = pageNo     || 1;
  retryCount = retryCount || 0;

  StardeckHX.UpdateStatus(pageNo);

  var url = '/account/pledges?page=' + pageNo;

  if (pageNo == 1 && document.location.search == '?page=1')
      return StardeckHX.ProcessPage(document.body, pageNo);

  StardeckHX.Log('Loading', url);

  var doLoad = function() {
    $.ajax({
      url: url,
      method: 'GET',
      dataType: 'html',
      success: function(data) {
        var $tmp  = $('<div>').html(data);
        var page  = $tmp.find('.page-wrapper')[0] || $tmp[0];
        StardeckHX.ProcessPage(page, pageNo);
      },
      error: function(xhr) {
        if (xhr.status === 429 && retryCount < StardeckHX._maxRetries) {
          var delay = StardeckHX._retryDelay * (retryCount + 1);
          StardeckHX.Log('Rate limited on page ' + pageNo + ', retrying in ' + (delay / 1000) + 's (attempt ' + (retryCount + 1) + '/' + StardeckHX._maxRetries + ')');
          StardeckHX.UpdateStatus(pageNo, 'rate-limited', retryCount + 1, delay / 1000);
          setTimeout(function() { StardeckHX.LoadPage(pageNo, retryCount + 1); }, delay);
        } else {
          StardeckHX.Log('Error loading page ' + pageNo + ' of your hangar - please contact plugins@ddrit.com for further support');
          StardeckHX.UpdateStatus(pageNo, 'error');
        }
      }
    });
  };

  if (pageNo > StardeckHX._throttleAfterPage) {
    setTimeout(doLoad, StardeckHX._throttleDelay);
  } else {
    doLoad();
  }
}
