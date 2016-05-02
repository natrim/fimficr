require('Common');

var window = new Window();
application.exitAfterWindowsClose = true;
window.visible = true;
window.title = "FimFiction.net Reader";

window.titleVisible = false;
window.animateOnSizeChange = true;
window.animateOnPositionChange = true;


var webview = new WebView();
window.appendChild(webview);

var urlLocation = new TextInput();
var toolbar = new Toolbar();
var backButton = new Button();
var forwardButton = new Button();
var homeButton = new Button();
var reloadButton = new Button();

backButton.image = 'back'; // named system icon
forwardButton.image = 'forward'; // named system icon
homeButton.image = 'home';
reloadButton.image = 'reload';

// Use 'space' for a OS-determined variable length space between items.
toolbar.appendChild([backButton, reloadButton, forwardButton, homeButton, 'space', urlLocation, 'space']);
window.toolbar = toolbar;


backButton.addEventListener('click', function () { webview.back(); });
forwardButton.addEventListener('click', function () { webview.forward(); });
reloadButton.addEventListener('click', function () { webview.reload(); });
homeButton.addEventListener('click', function () { webview.location = "https://www.fimfiction.net/"; });

urlLocation.addEventListener('inputend', function () {
  var url = urlLocation.value;
  if (url.indexOf('fimfiction.net') === -1) url = "https://www.fimfiction.net/" + url;
  webview.location = url;
});

webview.addEventListener('location-change', function (oldl, newl) {
  urlLocation.value = newl;
});

urlLocation.alignment = 'center';
urlLocation.linewrap = false;
urlLocation.scrollable = true;

webview.left = webview.right = webview.top = webview.bottom = 0;
webview.location = "https://www.fimfiction.net/";
