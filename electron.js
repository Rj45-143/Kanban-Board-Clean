// electron.js
const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const isDev = require('electron-is-dev');

let serverProcess;

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  let startURL;

  if (isDev) {
    // In dev, just load localhost:3000
    startURL = 'http://localhost:3000';
  } else {
    // In production, start Next.js server in background
    // Assumes 'npm run start' is built and working
    const nextPath = path.join(__dirname, 'node_modules', '.bin', process.platform === 'win32' ? 'next.cmd' : 'next');
    serverProcess = spawn(
      nextPath,
      ['start', '-p', '3000'], // run built Next.js server on port 3000
      {
        cwd: __dirname,
        stdio: 'inherit',
      }
    );

    startURL = 'http://localhost:3000';
  }

  // Load the app
  win.loadURL(startURL);

  // Optional: open devtools in dev
  if (isDev) win.webContents.openDevTools();

  // Cleanup server when window closes
  win.on('closed', () => {
    if (serverProcess) serverProcess.kill();
  });
}

// App lifecycle
app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
  if (serverProcess) serverProcess.kill();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
