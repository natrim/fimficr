require('Common');

var window = new Window();
application.exitAfterWindowsClose = true;
window.visible = true;
window.title = "FimFiction.net Reader";

var webview = new WebView();
window.appendChild(webview);

webview.left = webview.right = webview.top = webview.bottom = 0;

webview.location = "https://www.fimfiction.net/"
