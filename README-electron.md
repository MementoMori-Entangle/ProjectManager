// Electron起動用のREADME

# ElectronでWindowsアプリとして起動する方法

1. 依存パッケージのインストール（初回のみ）
   ```
npm install
npm install --save-dev electron
   ```
2. Expressサーバー・Reactアプリのビルド（必要に応じて）
   ```
npm run build
   ```
3. Electronアプリの起動
   ```
npm run electron
   ```

- `electron-main.js` がElectronのエントリーポイントです。
- ExpressサーバーとReact開発サーバーを自動で起動し、Electronウィンドウで `http://localhost:3000` を表示します。
- 本番運用時はReactをビルドし、`mainWindow.loadFile('dist/index.html')` などに変更してください。
