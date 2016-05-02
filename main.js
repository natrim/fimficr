require('Common');

var window = new Window();
application.exitAfterWindowsClose = true;
window.visible = true;

var appSettings = {
  homePage: 'https://www.fimfiction.net/',
  urlPrefix: 'https://www.fimfiction.net/'
};

var settings = JSON.parse(application.storage || '{}') || {};
if (!settings.lastUrl) {
  settings.lastUrl = '';
}
if (!settings.window) {
  settings.window = {};
}

function saveSettings() {
  application.storage = JSON.stringify(settings);
}

window.x = settings.window.x || 0;
window.y = settings.window.y || 0;

window.addEventListener('move', function () {
  settings.window.x = window.x;
  settings.window.y = window.y;
  saveSettings();
});

window.width = settings.window.width || 1280;
window.height = settings.window.height || 800;

window.minimumWidth = 375;
window.minimumHeight = 627;

window.addEventListener('resize', function () {
  settings.window.width = window.width;
  settings.window.height = window.height;
  settings.window.x = window.x;
  settings.window.y = window.y;
  saveSettings();
});

window.canBeFullscreen = true;

window.title = 'FimFiction.net Reader';
window.titleVisible = false;
window.animateOnSizeChange = true;
window.animateOnPositionChange = true;

var ismac = (require('os').platform().toLowerCase() === "darwin" || require('os').platform().toLowerCase() === "mac");

if (ismac) {
  var mainMenu = new Menu();

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

  window.menu = mainMenu;
}


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
    saveSettings();
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
