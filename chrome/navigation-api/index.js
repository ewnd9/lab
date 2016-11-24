'use strict';

/*

listen to opening of new tabs

*/

chrome.webNavigation.onCreatedNavigationTarget.addListener(function(opts) {
  console.log(opts.sourceTabId);
  console.log(opts.tabId);
  console.log(opts.url);

  chrome.tabs.get(opts.tabId, function(tab) {
    console.log(tab.url);
  });

  chrome.tabs.get(opts.sourceTabId, function(tab) {
    console.log(tab.url);
  });
});
