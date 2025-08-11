# ProjectManager

経緯  
TypeScriptの勉強を兼ねて、  
個人開発を行っているうえで不便だと感じる部分を  
ツール化で効率化する。  
複数のプロジェクト間を行き来する時や  
しばらく触っていないプロジェクトを更新する時、  
異なるアーキテクトを採用することがあるため、  
コマンドやしきたりを忘れていたりすることがある。  
関連テキストなどから当時の作業履歴を追って、  
必要な情報を参照するにはそれなりにコストがかる。  
そこで、プロジェクト毎の特定(コマンドやしきたり)に  
特化したタスク管理ツールを作成する。  
(よくあるタスク管理ツールは多機能なため)

React.js + Node.jsで実装(Next.jsは未使用)

・APIサーバー  
npm run start:server  
node .\dist\controllers\api-server.js

・Web or ネイティブアプリ(electron)  
npm run start:client  
or  
npm run start  
npm run electron
