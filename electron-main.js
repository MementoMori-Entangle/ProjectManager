const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let serverProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false,
    },
  });
  mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', () => {
  const isDev = process.argv.some(arg => arg === '--mode=development');

  if (!isDev) {
    // APIサーバーが起動しているか事前チェック
    const http = require('http');
    const apiUrl = `http://localhost:3001/api/projects`;
    http.get(apiUrl, (res) => {
      if (res.statusCode === 200) {
        createWindow();
      } else {
        const { dialog } = require('electron');
        dialog.showErrorBox(
          'APIサーバー未起動',
          `APIサーバーが起動していません。\n\nnode .\\dist\\controllers\\api-server.js を起動してください。`
        );
        app.quit();
        process.exit(1);
      }
    }).on('error', () => {
      const { dialog } = require('electron');
      dialog.showErrorBox(
        'APIサーバー未起動',
        `APIサーバーが起動していません。\n\nnode .\\dist\\controllers\\api-server.js を起動してください。`
      );
      app.quit();
      process.exit(1);
    });
  } else {
    // Expressサーバーを直接Node.jsで起動（開発時のみ）
    const serverScript = path.join(__dirname, 'dist', 'controllers', 'api-server.js');
    serverProcess = spawn(process.execPath, [serverScript], {
      cwd: path.join(__dirname),
      shell: false,
      stdio: 'inherit',
    });
    // サーバー起動待ち後ウィンドウ表示（2秒待機）
    setTimeout(createWindow, 2000);
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
  if (serverProcess) serverProcess.kill();
});
