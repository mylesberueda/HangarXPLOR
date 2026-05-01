
var StardeckHX = StardeckHX || {};

StardeckHX.ProcessPage = function($page, pageNo)
{
  var isEmpty = $('.list-items > li > .empty-list', $page).length > 0;

  var $items = $('.list-items > li', $page);

  // Detect duplicate pages: RSI returns the last page's results for any
  // page number beyond the actual last page instead of an empty list.
  var isDuplicate = false;
  if (!isEmpty && $items.length > 0) {
    var firstId = $('.js-pledge-id', $items.first()).val();
    if (firstId && firstId === StardeckHX._lastFirstPledgeId) {
      isDuplicate = true;
    }
    StardeckHX._lastFirstPledgeId = firstId;
  }

  if (!isEmpty && !isDuplicate) $items.each(StardeckHX.ParsePledge);

  if (isEmpty || isDuplicate || $items.length < 10)
  {
    StardeckHX.SaveCache();
    StardeckHX.MarkLoadingComplete();
  } else {
    StardeckHX.LoadPage(pageNo + 1);
  }
}
