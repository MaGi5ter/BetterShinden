chrome.declarativeNetRequest.onRuleMatchedDebug.addListener((e) => {
    console.log(e);
  });

  console.log('Service worker started.');