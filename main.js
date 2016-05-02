require('Common');

var appSettings = {
  homePage: 'https://www.fimfiction.net/',
  urlPrefix: 'https://www.fimfiction.net/'
};

var settings = JSON.parse(application.storage || '{}') || {};
if (!settings.lastUrl) {
  settings.lastUrl = '';
}


var window = new Window();
application.exitAfterWindowsClose = true;
window.visible = true;
window.title = 'FimFiction.net Reader';

window.titleVisible = false;
window.animateOnSizeChange = true;
window.animateOnPositionChange = true;

window.state = 'maximized';

var ismac = (require('os').platform().toLowerCase() === "darwin" || require('os').platform().toLowerCase() === "mac");

var mainMenu = new Menu();

if (ismac) {
  var appleMenu = new MenuItem(application.name, '');
  mainMenu.appendChild(appleMenu);

  var appleSubmenu = new Menu(application.name);
  //appleSubmenu.appendChild(new MenuItem('About '+application.name, ''))
  //    .addEventListener('click', function() { console.log('Do something for about!'); });
  appleSubmenu.appendChild(new MenuItemSeparator());
  appleSubmenu.appendChild(new MenuItem('Hide ' + application.name, 'h'))
    .addEventListener('click', function () { application.visible = false; });
  appleSubmenu.appendChild(new MenuItem('Hide Others', ''))
    .addEventListener('click', function () { application.hideAllOtherApplications(); });
  appleSubmenu.appendChild(new MenuItem('Show All', ''))
    .addEventListener('click', function () { application.unhideAllOtherApplications(); });
  appleSubmenu.appendChild(new MenuItemSeparator());
  appleSubmenu.appendChild(new MenuItem('Quit ' + application.name, 'q'))
    .addEventListener('click', function () {
      process.exit(0);
    });
  appleMenu.submenu = appleSubmenu;
}

if (!ismac) {
  var fileMenu = new MenuItem('File', '');
  mainMenu.appendChild(fileMenu);
  var fileSubmenu = new Menu('File');
  fileSubmenu.appendChild(new MenuItem('Close', 'w', 'cmd'))
    .addEventListener('click', function () {
      process.exit(0);
    });
  fileMenu.submenu = fileSubmenu;
}

var editMenu = new MenuItem('Edit', '');
mainMenu.appendChild(editMenu);

var editSubmenu = new Menu('Edit');
var undo = new MenuItem('Undo', 'u');
undo.addEventListener('click', function () { application.undo(); });
editSubmenu.appendChild(undo);
editSubmenu.appendChild(new MenuItem('Redo', 'r'))
  .addEventListener('click', function () { application.redo(); });
editSubmenu.appendChild(new MenuItemSeparator());
editSubmenu.appendChild(new MenuItem('Copy', 'c'))
  .addEventListener('click', function () { application.copy(); });
editSubmenu.appendChild(new MenuItem('Cut', 'x'))
  .addEventListener('click', function () { application.cut(); });
editSubmenu.appendChild(new MenuItem('Paste', 'p'))
  .addEventListener('click', function () { application.paste(); });
editMenu.submenu = editSubmenu;


var windowMenu = new MenuItem('Window', '');
mainMenu.appendChild(windowMenu);
var windowSubmenu = new Menu('Window');
windowSubmenu.appendChild(new MenuItem('Minimize', 'm'))
  .addEventListener('click', function () { window.state = "minimized"; });
windowSubmenu.appendChild(new MenuItem('Zoom', ''))
  .addEventListener('click', function () { window.state = "maximized"; });
windowSubmenu.appendChild(new MenuItemSeparator());
windowSubmenu.appendChild(new MenuItem('Bring All to Front', ''))
  .addEventListener('click', function () { window.bringToFront(); });
windowSubmenu.appendChild(new MenuItemSeparator());
windowMenu.submenu = windowSubmenu;

window.menu = mainMenu;

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

toolbar.size = 'small';
toolbar.state = 'icon';

// Use 'space' for a OS-determined variable length space between items.
toolbar.appendChild(['space', backButton, reloadButton, forwardButton, homeButton, 'space', urlLocation, 'space']);
window.toolbar = toolbar;


backButton.addEventListener('click', function () { webview.back(); });
forwardButton.addEventListener('click', function () { webview.forward(); });
reloadButton.addEventListener('click', function () { webview.reload(); });
homeButton.addEventListener('click', function () { webview.location = appSettings.homePage; });

urlLocation.addEventListener('inputend', function () {
  var url = urlLocation.value;
  if (url.indexOf(appSettings.urlPrefix) === -1) {
    url = appSettings.urlPrefix + url;
  }
  webview.location = url;
});

webview.addEventListener('location-change', function (oldl, newl) {
  urlLocation.value = newl;
});

webview.addEventListener('loading', function () {
  if (webview.location !== settings.lastUrl) {
    settings.lastUrl = webview.location;
    application.storage = JSON.stringify(settings);
  }
});

urlLocation.alignment = 'center';
urlLocation.linewrap = false;
urlLocation.scrollable = true;

webview.left = webview.right = webview.top = webview.bottom = 0;
if (settings.lastUrl) {
  webview.location = settings.lastUrl;
} else {
  webview.location = appSettings.homePage;
}
