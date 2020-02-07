const { app, BrowserWindow } = require("electron");

const path = require("path");
const url = require("url");

let mainWindow;

if (process.env.ENABLE_GPU_ACCELERATION !== "1") {
  app.disableHardwareAcceleration();
}
const IS_PRODUCTION =
  process.env.NODE_ENV && process.env.NODE_ENV === "production";

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1366,
    height: 768,
    useContentSize: true,
    frame: !IS_PRODUCTION,
    webPreferences: {
      nodeIntegration: true
    }
  });
  mainWindow.setMenuBarVisibility(false);
  // and load the index.html of the app.
  //   mainWindow.loadURL('chrome://gpu');

  if (IS_PRODUCTION) {
    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, "build", "index.html"),
        protocol: "file:",
        slashes: true
      })
    );
  } else {
    mainWindow.loadURL("http://localhost:8888");

    mainWindow.webContents.on("did-fail-load", (_, errorCode) => {
      const CODE_ABORTED = -3;
      if (errorCode !== CODE_ABORTED) {
        setTimeout(() => {
          mainWindow.webContents.reload();
        }, 1000);
      }
    });
  }

  if (!IS_PRODUCTION || process.env.DEV_CONSOLE === "1") {
    mainWindow.webContents.openDevTools();
  }

  // Emitted when the window is closed.
  mainWindow.on("closed", () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
  console.log("WINDOW_LAUNCHED");
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  app.quit();
});

process.on("unhandledRejection", error => {
  throw error;
});
