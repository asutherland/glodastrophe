// We still want a browser button so we can debug.  The sidebar is a bit
// annoying on this front.
function handleClick() {
  browser.tabs.create({
    url: chrome.extension.getURL('index.html')
  });
}
browser.browserAction.onClicked.addListener(handleClick);
