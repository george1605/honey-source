chrome.runtime.onMessage.addListener(function(config) {
  if ("offscreen:tag" === config.type) {
    
    var iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.sandbox = "allow-forms allow-same-origin allow-scripts";
    iframe.src = config.affUrl;
    iframe.id = "myFrame";
    document.body.appendChild(iframe);
    setTimeout(function() {
      iframe.remove();
    }, 90000);

    var that = document.getElementById("myFrame");
    chrome.runtime.sendMessage({
      type : "offscreen:tag:success",
      msg : "tagged wtih ".concat(config.affUrl, " ").concat(config.storeId, " ").concat(that.id)
    });
  }
});
